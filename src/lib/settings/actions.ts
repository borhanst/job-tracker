'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { encryptKey, decryptKey } from './encryption';

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
    const defaultSettings = { user_id: user.id, provider: 'gemini', model: 'gemini-1.5-flash' };
    await supabase.from('user_settings').insert(defaultSettings);
    return defaultSettings;
  }

  // We return a masked version of the keys to the client, or just a boolean indicating presence
  return {
    provider: data.provider,
    model: data.model,
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

  const updatePayload: any = { provider, model };

  if (newKey) {
    const encryptedKey = encryptKey(newKey);
    if (provider === 'gemini') updatePayload.gemini_key_enc = encryptedKey;
    if (provider === 'openai') updatePayload.openai_key_enc = encryptedKey;
    if (provider === 'anthropic') updatePayload.anthropic_key_enc = encryptedKey;
    if (provider === 'groq') updatePayload.groq_key_enc = encryptedKey;
  }

  const { error } = await supabase
    .from('user_settings')
    .update(updatePayload)
    .eq('user_id', user.id);

  if (error) throw error;
  revalidatePath('/settings');
}
