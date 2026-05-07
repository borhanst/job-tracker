export function getAiErrorMessage(error: unknown) {
  const fallback = 'Internal server error';
  const message = error instanceof Error ? error.message : '';

  if (!message) return fallback;

  const normalized = message.toLowerCase();

  if (normalized.includes('api key for') && normalized.includes('missing')) {
    return 'Configure your LLM provider in Settings before using Tailor with AI.';
  }

  if (normalized.includes('could not load user ai settings')) {
    return 'Configure your LLM provider in Settings before using Tailor with AI.';
  }
  const looksLikeOllama =
    normalized.includes('ollama') ||
    normalized.includes('11434') ||
    normalized.includes('/api/tags') ||
    normalized.includes('/v1');

  if (looksLikeOllama && (normalized.includes('connect') || normalized.includes('econnrefused') || normalized.includes('fetch failed'))) {
    return 'Could not connect to Ollama. Start Ollama and verify OLLAMA_BASE_URL points to the server root (for example: http://localhost:11434).';
  }

  if (looksLikeOllama && normalized.includes('not found') && normalized.includes('model')) {
    return 'The selected Ollama model is not installed. Pull it with `ollama pull <model>` or choose another installed model in Settings.';
  }

  return message;
}
