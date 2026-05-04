import { createClient } from '@/lib/supabase/server';
import { decryptKey } from '@/lib/settings/encryption';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI as createGroq } from '@ai-sdk/openai'; // Groq uses OpenAI SDK structure

export async function getModelInstance(userId: string) {
  const supabase = await createClient();

  const { data: settings, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !settings) {
    throw new Error('Could not load user AI settings.');
  }

  const { provider, model } = settings;

  let apiKey = '';

  if (provider === 'gemini') apiKey = decryptKey(settings.gemini_key_enc);
  if (provider === 'openai') apiKey = decryptKey(settings.openai_key_enc);
  if (provider === 'anthropic') apiKey = decryptKey(settings.anthropic_key_enc);
  if (provider === 'groq') apiKey = decryptKey(settings.groq_key_enc);

  // Fallback to environment variables if user hasn't set a key
  if (!apiKey) {
    if (provider === 'gemini') apiKey = process.env.GOOGLE_GENERINI_API_KEY || '';
    if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY || '';
    if (provider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY || '';
    if (provider === 'groq') apiKey = process.env.GROQ_API_KEY || '';
  }

  if (!apiKey) {
    throw new Error(`API key for ${provider} is missing. Please configure it in Settings.`);
  }

  switch (provider) {
    case 'gemini':
      const google = createGoogleGenerativeAI({ apiKey });
      return google(model);
    case 'openai':
      const openai = createOpenAI({ apiKey });
      return openai(model);
    case 'anthropic':
      const anthropic = createAnthropic({ apiKey });
      return anthropic(model);
    case 'groq':
      const groq = createGroq({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
      return groq(model);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
