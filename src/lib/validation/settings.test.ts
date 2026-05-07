import { describe, expect, it } from 'vitest';
import { validateWithSchema } from './result';
import { settingsSchema } from './settings';

describe('settingsSchema', () => {
  it('accepts a supported provider and model with an optional new key', () => {
    const result = validateWithSchema(settingsSchema, {
      provider: 'openai',
      model: 'gpt-4o-mini',
      newKey: '  sk-test-key  ',
      hasExistingKey: false,
    });

    expect(result).toEqual({
      success: true,
      data: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        newKey: 'sk-test-key',
        hasExistingKey: false,
      },
    });
  });

  it('allows a blank key when the selected provider already has one saved', () => {
    const result = validateWithSchema(settingsSchema, {
      provider: 'gemini',
      model: 'gemini-2.5-flash',
      newKey: '',
      hasExistingKey: true,
    });

    expect(result).toEqual({
      success: true,
      data: {
        provider: 'gemini',
        model: 'gemini-2.5-flash',
        newKey: undefined,
        hasExistingKey: true,
      },
    });
  });

  it('rejects unsupported provider and model pairs', () => {
    const result = validateWithSchema(settingsSchema, {
      provider: 'gemini',
      model: 'gpt-4o',
      newKey: 'key',
      hasExistingKey: false,
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        model: ['Choose a supported model for this provider'],
      },
      formErrors: [],
    });
  });

  it('requires a saved or newly entered API key for the selected provider', () => {
    const result = validateWithSchema(settingsSchema, {
      provider: 'groq',
      model: 'openai/gpt-oss-120b',
      newKey: '',
      hasExistingKey: false,
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        newKey: ['Enter an API key for this provider'],
      },
      formErrors: [],
    });
  });

  it('requires selecting an Ollama model value', () => {
    const result = validateWithSchema(settingsSchema, {
      provider: 'ollama',
      model: '',
      newKey: '',
      hasExistingKey: false,
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        model: ['Choose a model'],
      },
      formErrors: [],
    });
  });
});
