import { z } from 'zod';

export const AI_PROVIDERS = ['gemini', 'openai', 'anthropic', 'groq', 'ollama'] as const;

export const AI_MODEL_OPTIONS = {
  gemini: ['gemini-2.5-flash', 'gemini-2.5-pro'],
  openai: ['gpt-4o-mini', 'gpt-4o'],
  anthropic: ['claude-3-haiku-20240307', 'claude-3-5-sonnet-20240620'],
  groq: ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'],
  ollama: [] as const,
} as const;

export const DEFAULT_AI_MODELS: Record<AiProvider, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-haiku-20240307',
  groq: 'openai/gpt-oss-120b',
  ollama: '',
};

export type AiProvider = (typeof AI_PROVIDERS)[number];

const optionalApiKey = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

export const settingsSchema = z
  .object({
    provider: z.enum(AI_PROVIDERS),
    model: z.string().trim().min(1, 'Choose a model'),
    newKey: optionalApiKey,
    hasExistingKey: z.boolean().default(false),
  })
  .superRefine((value, context) => {
    if (value.provider === 'ollama') {
      return;
    }

    const models = AI_MODEL_OPTIONS[value.provider];

    if (!(models as readonly string[]).includes(value.model)) {
      context.addIssue({
        code: 'custom',
        path: ['model'],
        message: 'Choose a supported model for this provider',
      });
    }

    if (!value.hasExistingKey && !value.newKey) {
      context.addIssue({
        code: 'custom',
        path: ['newKey'],
        message: 'Enter an API key for this provider',
      });
    }
  });

export type SettingsInput = z.infer<typeof settingsSchema>;
