import type { z } from 'zod';

export type ValidationSuccess<T> = {
  success: true;
  data: T;
};

export type ValidationFailure = {
  success: false;
  fieldErrors: Record<string, string[]>;
  formErrors: string[];
};

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function validateWithSchema<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): ValidationResult<z.infer<TSchema>> {
  const result = schema.safeParse(input);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const fieldErrors: Record<string, string[]> = {};
  const formErrors: string[] = [];

  for (const issue of result.error.issues) {
    if (issue.path.length === 0) {
      formErrors.push(issue.message);
      continue;
    }

    const field = issue.path.join('.');
    fieldErrors[field] = [...(fieldErrors[field] || []), issue.message];
  }

  return {
    success: false,
    fieldErrors,
    formErrors,
  };
}

export function formDataToObject(formData: FormData): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
  const output: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$ACTION_')) {
      continue;
    }

    const existing = output[key];

    if (existing === undefined) {
      output[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      output[key] = [existing, value];
    }
  }

  return output;
}
