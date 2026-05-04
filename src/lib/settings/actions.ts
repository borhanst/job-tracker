'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { encryptKey } from './encryption';

const DEFAULT_MODELS: Record<string, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-haiku-20240307',
  groq: 'llama3-8b-8192',
};

const PROVIDERS = ['gemini', 'openai', 'anthropic', 'groq'] as const;

function normalizeModel(provider: string, model: string | null | undefined) {
  if (!model) return DEFAULT_MODELS[provider] || '';
  if (provider === 'gemini' && model.startsWith('gemini-1.5')) {
    return DEFAULT_MODELS.gemini;
  }
  return model;
}

function getProviderModels(settings: any) {
  const savedModels = settings.provider_models || {};

  return PROVIDERS.reduce<Record<string, string>>((models, provider) => {
    const savedModel =
      typeof savedModels === 'object' && savedModels !== null
        ? savedModels[provider]
        : undefined;

    models[provider] = normalizeModel(
      provider,
      provider === settings.provider ? settings.model : savedModel
    );

    return models;
  }, {});
}

export async function getUserSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching settings:', error);
    return null;
  }

  // Create default if none exists
  if (!data) {
    const defaultSettings = {
      user_id: user.id,
      provider: 'gemini',
      model: DEFAULT_MODELS.gemini,
      provider_models: { gemini: DEFAULT_MODELS.gemini },
    };
    await supabase.from('user_settings').insert(defaultSettings);
    return {
      provider: defaultSettings.provider,
      model: defaultSettings.model,
      providerModels: getProviderModels(defaultSettings),
      hasGeminiKey: false,
      hasOpenaiKey: false,
      hasAnthropicKey: false,
      hasGroqKey: false,
    };
  }

  const providerModels = getProviderModels(data);
  const normalizedModel = providerModels[data.provider];
  const normalizedProviderModels = {
    ...(data.provider_models || {}),
    [data.provider]: normalizedModel,
  };

  if (
    normalizedModel !== data.model ||
    JSON.stringify(normalizedProviderModels) !== JSON.stringify(data.provider_models || {})
  ) {
    await supabase
      .from('user_settings')
      .update({ model: normalizedModel, provider_models: normalizedProviderModels })
      .eq('user_id', user.id);
  }

  // We return a masked version of the keys to the client, or just a boolean indicating presence
  return {
    provider: data.provider,
    model: normalizedModel,
    providerModels,
    hasGeminiKey: !!data.gemini_key_enc,
    hasOpenaiKey: !!data.openai_key_enc,
    hasAnthropicKey: !!data.anthropic_key_enc,
    hasGroqKey: !!data.groq_key_enc,
  };
}

export async function updateUserSettings(provider: string, model: string, newKey?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const normalizedModel = normalizeModel(provider, model);

  const { data: existingSettings, error: fetchError } = await supabase
    .from('user_settings')
    .select('provider_models')
    .eq('user_id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  const providerModels = {
    ...(existingSettings?.provider_models || {}),
    [provider]: normalizedModel,
  };

  const updatePayload: any = {
    user_id: user.id,
    provider,
    model: normalizedModel,
    provider_models: providerModels,
  };

  if (newKey) {
    const encryptedKey = encryptKey(newKey);
    if (provider === 'gemini') updatePayload.gemini_key_enc = encryptedKey;
    if (provider === 'openai') updatePayload.openai_key_enc = encryptedKey;
    if (provider === 'anthropic') updatePayload.anthropic_key_enc = encryptedKey;
    if (provider === 'groq') updatePayload.groq_key_enc = encryptedKey;
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert(updatePayload, { onConflict: 'user_id' });

  if (error) throw error;
  revalidatePath('/settings');
}
