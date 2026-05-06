import { describe, expect, it } from 'vitest';
import { validateWithSchema } from './result';
import { jdHandoffCreateSchema } from './handoffs';

describe('jdHandoffCreateSchema', () => {
  it('normalizes a Browser JD Capture payload', () => {
    const result = validateWithSchema(jdHandoffCreateSchema, {
      url: ' https://company.example/jobs/accountant ',
      title: '  Senior Accountant - Company ',
      sections: ['  About the role ', 'Responsibilities\n', 'Requirements'],
    });

    expect(result).toEqual({
      success: true,
      data: {
        url: 'https://company.example/jobs/accountant',
        title: 'Senior Accountant - Company',
        sections: ['About the role', 'Responsibilities', 'Requirements'],
      },
    });
  });

  it('allows a missing page title', () => {
    const result = validateWithSchema(jdHandoffCreateSchema, {
      url: 'https://company.example/jobs/accountant',
      sections: ['About the role'],
    });

    expect(result).toEqual({
      success: true,
      data: {
        url: 'https://company.example/jobs/accountant',
        title: null,
        sections: ['About the role'],
      },
    });
  });

  it('rejects malformed JD Handoff payloads', () => {
    const result = validateWithSchema(jdHandoffCreateSchema, {
      url: 'not-a-url',
      title: '',
      sections: [' ', 'Requirements'],
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        url: ['Enter a valid job listing URL'],
        'sections.0': ['Selected section text is required'],
      },
      formErrors: [],
    });
  });
});
