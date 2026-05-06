import { describe, expect, it } from 'vitest';
import { validateWithSchema } from './result';
import {
  onboardingEducationSchema,
  onboardingExperienceSchema,
  onboardingPersonalSchema,
  onboardingSkillsSchema,
  onboardingSummarySchema,
} from './onboarding';

describe('onboardingPersonalSchema', () => {
  it('normalizes required contact baseline fields', () => {
    const result = validateWithSchema(onboardingPersonalSchema, {
      full_name: '  Jordan Parker  ',
      phone: '  +1 555 0000 ',
      location: '  Dhaka, Bangladesh ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        full_name: 'Jordan Parker',
        phone: '+1 555 0000',
        location: 'Dhaka, Bangladesh',
      },
    });
  });

  it('rejects missing contact baseline fields', () => {
    const result = validateWithSchema(onboardingPersonalSchema, {
      full_name: '',
      phone: ' ',
      location: '',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        full_name: ['Enter your full name'],
        phone: ['Enter your phone number'],
        location: ['Enter your location'],
      },
      formErrors: [],
    });
  });
});

describe('onboardingSummarySchema', () => {
  it('normalizes the professional summary', () => {
    const result = validateWithSchema(onboardingSummarySchema, {
      summary: '  Product designer focused on SaaS onboarding.  ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        summary: 'Product designer focused on SaaS onboarding.',
      },
    });
  });

  it('rejects an empty professional summary', () => {
    const result = validateWithSchema(onboardingSummarySchema, { summary: ' ' });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        summary: ['Enter your professional summary'],
      },
      formErrors: [],
    });
  });
});

describe('onboardingSkillsSchema', () => {
  it('normalizes skills and removes blank rows', () => {
    const result = validateWithSchema(onboardingSkillsSchema, {
      skills: [' TypeScript ', '', ' React ', 'Product Strategy'],
    });

    expect(result).toEqual({
      success: true,
      data: {
        skills: ['TypeScript', 'React', 'Product Strategy'],
      },
    });
  });

  it('requires at least three non-empty skills', () => {
    const result = validateWithSchema(onboardingSkillsSchema, {
      skills: ['TypeScript', ' ', 'React'],
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        skills: ['Add at least 3 skills'],
      },
      formErrors: [],
    });
  });
});

describe('onboardingExperienceSchema', () => {
  it('normalizes required experience fields and optional description', () => {
    const result = validateWithSchema(onboardingExperienceSchema, {
      company: ' Acme ',
      title: ' Product Designer ',
      start_date: '2025-01-01',
      description: '  Improved conversion. ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        company: 'Acme',
        title: 'Product Designer',
        start_date: '2025-01-01',
        description: 'Improved conversion.',
      },
    });
  });

  it('rejects missing experience proof point fields', () => {
    const result = validateWithSchema(onboardingExperienceSchema, {
      company: '',
      title: '',
      start_date: '',
      description: '',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        company: ['Enter the company name'],
        title: ['Enter your role title'],
        start_date: ['Enter a valid start date'],
      },
      formErrors: [],
    });
  });
});

describe('onboardingEducationSchema', () => {
  it('normalizes required education proof point fields', () => {
    const result = validateWithSchema(onboardingEducationSchema, {
      institution: ' Example University ',
      degree: ' BSc ',
      field: ' Computer Science ',
      start_date: '2024-09-01',
    });

    expect(result).toEqual({
      success: true,
      data: {
        institution: 'Example University',
        degree: 'BSc',
        field: 'Computer Science',
        start_date: '2024-09-01',
      },
    });
  });

  it('rejects missing education proof point fields', () => {
    const result = validateWithSchema(onboardingEducationSchema, {
      institution: '',
      degree: '',
      field: '',
      start_date: 'not-a-date',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        institution: ['Enter the institution name'],
        degree: ['Enter your degree'],
        field: ['Enter your field of study'],
        start_date: ['Enter a valid start date'],
      },
      formErrors: [],
    });
  });
});
