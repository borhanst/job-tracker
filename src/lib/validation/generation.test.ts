import { describe, expect, it } from 'vitest';
import { validateWithSchema } from './result';
import { generationRequestSchema } from './generation';

describe('generationRequestSchema', () => {
  it('normalizes the application id', () => {
    const result = validateWithSchema(generationRequestSchema, {
      applicationId: '  app_123 ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        applicationId: 'app_123',
      },
    });
  });

  it('rejects a missing application id', () => {
    const result = validateWithSchema(generationRequestSchema, {
      applicationId: ' ',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        applicationId: ['Application ID is required'],
      },
      formErrors: [],
    });
  });
});
