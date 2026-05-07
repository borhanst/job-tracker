'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { encryptKey } from './encryption';
import {
  AI_PROVIDERS,
  DEFAULT_AI_MODELS,
  settingsSchema,
  validateWithSchema,
  type AiProvider,
} from '@/lib/validation';

function normalizeModel(provider: string, model: string | null | undefined) {
  if (!model) return DEFAULT_AI_MODELS[provider as AiProvider] || '';
  if (provider === 'gemini' && model.startsWith('gemini-1.5')) {
    return DEFAULT_AI_MODELS.gemini;
  }
  return model;
}

function hasSavedKeyForProvider(settings: any, provider: string) {
  if (!settings) return false;
  if (provider === 'gemini') return Boolean(settings.gemini_key_enc);
  if (provider === 'openai') return Boolean(settings.openai_key_enc);
  if (provider === 'anthropic') return Boolean(settings.anthropic_key_enc);
  if (provider === 'groq') return Boolean(settings.groq_key_enc);
  return false;
}

function getProviderModels(settings: any) {
  const savedModels = settings.provider_models || {};

  return AI_PROVIDERS.reduce<Record<string, string>>((models, provider) => {
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

function resolveOllamaRootBaseUrl() {
  const rawBaseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').trim();
  const rootBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  return rootBaseUrl.endsWith('/v1') ? rootBaseUrl.slice(0, -3) : rootBaseUrl;
}

async function getInstalledOllamaModels() {
  const endpoint = `${resolveOllamaRootBaseUrl()}/api/tags`;
  const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Could not load installed Ollama models. Start Ollama and try again.');
  }

  const payload = await response.json();
  if (!Array.isArray(payload?.models)) {
    return [] as string[];
  }

  return payload.models
    .map((entry: { name?: string }) => entry?.name)
    .filter((name: string | undefined): name is string => Boolean(name));
}

function mapSettingsPersistenceError(error: any): Error {
  if (error?.code === '22P02' && String(error?.message || '').includes('enum ai_provider')) {
    return new Error(
      'Your database schema is outdated and does not include the Ollama provider yet. Run the latest Supabase migrations, then try again.'
    );
  }

  return error instanceof Error
    ? error
    : new Error(error?.message || 'Failed to save settings.');
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
      model: DEFAULT_AI_MODELS.gemini,
      provider_models: { gemini: DEFAULT_AI_MODELS.gemini },
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
    .select('provider_models, gemini_key_enc, openai_key_enc, anthropic_key_enc, groq_key_enc')
    .eq('user_id', user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  const validation = validateWithSchema(settingsSchema, {
    provider,
    model: normalizedModel,
    newKey: newKey || '',
    hasExistingKey: hasSavedKeyForProvider(existingSettings, provider),
  });

  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the AI provider settings.');
  }

  if (validation.data.provider === 'ollama') {
    const installedModels = await getInstalledOllamaModels();
    if (!installedModels.includes(validation.data.model)) {
      throw new Error('Select a model from available Ollama models.');
    }
  }

  const providerModels = {
    ...(existingSettings?.provider_models || {}),
    [validation.data.provider]: validation.data.model,
  };

  const updatePayload: any = {
    user_id: user.id,
    provider: validation.data.provider,
    model: validation.data.model,
    provider_models: providerModels,
  };

  if (validation.data.newKey) {
    const encryptedKey = encryptKey(validation.data.newKey);
    if (validation.data.provider === 'gemini') updatePayload.gemini_key_enc = encryptedKey;
    if (validation.data.provider === 'openai') updatePayload.openai_key_enc = encryptedKey;
    if (validation.data.provider === 'anthropic') updatePayload.anthropic_key_enc = encryptedKey;
    if (validation.data.provider === 'groq') updatePayload.groq_key_enc = encryptedKey;
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert(updatePayload, { onConflict: 'user_id' });

  if (error) throw mapSettingsPersistenceError(error);
  revalidatePath('/settings');
}
