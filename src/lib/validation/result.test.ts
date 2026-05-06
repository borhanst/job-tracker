import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { formDataToObject, validateWithSchema } from './result';

describe('validateWithSchema', () => {
  const schema = z.object({
    email: z.email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }).refine((value) => value.email !== value.password, {
    message: 'Email and password must be different',
  });

  it('returns parsed data for valid input', () => {
    const result = validateWithSchema(schema, {
      email: 'person@example.com',
      password: 'correct-horse',
    });

    expect(result).toEqual({
      success: true,
      data: {
        email: 'person@example.com',
        password: 'correct-horse',
      },
    });
  });

  it('maps field errors and form errors into a stable contract', () => {
    const result = validateWithSchema(schema, {
      email: 'same',
      password: 'same',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        email: ['Enter a valid email address'],
        password: ['Password must be at least 8 characters'],
      },
      formErrors: ['Email and password must be different'],
    });
  });
});

describe('formDataToObject', () => {
  it('converts form data into a plain object without Next action metadata', () => {
    const formData = new FormData();
    formData.append('email', 'person@example.com');
    formData.append('skills', 'TypeScript');
    formData.append('skills', 'React');
    formData.append('$ACTION_ID_abc', 'ignored');

    expect(formDataToObject(formData)).toEqual({
      email: 'person@example.com',
      skills: ['TypeScript', 'React'],
    });
  });
});
