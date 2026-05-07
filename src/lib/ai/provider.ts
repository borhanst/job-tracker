import { createClient } from '@/lib/supabase/server';
import { decryptKey } from '@/lib/settings/encryption';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI as createGroq } from '@ai-sdk/openai'; // Groq uses OpenAI SDK structure

function resolveOllamaBaseUrl() {
  const rawBaseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').trim();
  const rootBaseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

  return {
    rootBaseUrl,
    openAIBaseUrl: rootBaseUrl.endsWith('/v1') ? rootBaseUrl : `${rootBaseUrl}/v1`,
  };
}

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
  const providerModels = settings.provider_models || {};
  const configuredModel = providerModels[provider] || model;
  const modelName =
    provider === 'gemini' && configuredModel?.startsWith('gemini-1.5')
      ? 'gemini-2.5-flash'
      : configuredModel;

  let apiKey = '';

  if (provider === 'gemini') apiKey = decryptKey(settings.gemini_key_enc);
  if (provider === 'openai') apiKey = decryptKey(settings.openai_key_enc);
  if (provider === 'anthropic') apiKey = decryptKey(settings.anthropic_key_enc);
  if (provider === 'groq') apiKey = decryptKey(settings.groq_key_enc);
  if (provider === 'ollama') apiKey = 'ollama';

  // Fallback to environment variables if user hasn't set a key
  if (!apiKey) {
    if (provider === 'gemini') {
      apiKey =
        process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
        process.env.GOOGLE_GENERINI_API_KEY ||
        '';
    }
    if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY || '';
    if (provider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY || '';
    if (provider === 'groq') apiKey = process.env.GROQ_API_KEY || '';
    if (provider === 'ollama') apiKey = 'ollama';
  }

  if (!apiKey) {
    throw new Error(`API key for ${provider} is missing. Please configure it in Settings.`);
  }

  switch (provider) {
    case 'gemini':
      const google = createGoogleGenerativeAI({ apiKey });
      return google(modelName);
    case 'openai':
      const openai = createOpenAI({ apiKey });
      return openai(modelName);
    case 'anthropic':
      const anthropic = createAnthropic({ apiKey });
      return anthropic(modelName);
    case 'groq':
      const groq = createGroq({ apiKey, baseURL: 'https://api.groq.com/openai/v1' });
      return groq(modelName);
    case 'ollama':
      const ollama = createOpenAI({ apiKey, baseURL: resolveOllamaBaseUrl().openAIBaseUrl });
      return ollama(modelName);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
