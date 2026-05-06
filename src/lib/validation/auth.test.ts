import { describe, expect, it } from 'vitest';
import { validateWithSchema } from './result';
import { loginSchema, registerSchema } from './auth';

describe('loginSchema', () => {
  it('normalizes email and accepts a password', () => {
    const result = validateWithSchema(loginSchema, {
      email: '  PERSON@Example.COM  ',
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

  it('rejects invalid login input with field errors', () => {
    const result = validateWithSchema(loginSchema, {
      email: 'not-email',
      password: '',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        email: ['Enter a valid email address'],
        password: ['Enter your password'],
      },
      formErrors: [],
    });
  });
});

describe('registerSchema', () => {
  it('normalizes full name and email', () => {
    const result = validateWithSchema(registerSchema, {
      fullName: '  Jordan Parker  ',
      email: '  Jordan@Example.COM ',
      password: 'correct-horse',
    });

    expect(result).toEqual({
      success: true,
      data: {
        fullName: 'Jordan Parker',
        email: 'jordan@example.com',
        password: 'correct-horse',
      },
    });
  });

  it('rejects missing account setup fields', () => {
    const result = validateWithSchema(registerSchema, {
      fullName: '',
      email: 'nope',
      password: 'short',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        fullName: ['Enter your full name'],
        email: ['Enter a valid email address'],
        password: ['Password must be at least 8 characters'],
      },
      formErrors: [],
    });
  });
});
