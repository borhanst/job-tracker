import { describe, expect, it } from 'vitest';
import { validateWithSchema } from './result';
import {
  profileEducationSchema,
  profileExperienceSchema,
  profileItemSchemas,
  profilePersonalSchema,
  profileSummarySchema,
} from './profile';

describe('profilePersonalSchema', () => {
  it('normalizes personal information and optional URLs', () => {
    const result = validateWithSchema(profilePersonalSchema, {
      full_name: '  Jordan Parker ',
      phone: ' +1 555 0000 ',
      location: ' Remote ',
      linkedin_url: '',
      github_url: ' https://github.com/jordan ',
      portfolio_url: 'https://jordan.example',
    });

    expect(result).toEqual({
      success: true,
      data: {
        full_name: 'Jordan Parker',
        phone: '+1 555 0000',
        location: 'Remote',
        linkedin_url: '',
        github_url: 'https://github.com/jordan',
        portfolio_url: 'https://jordan.example',
      },
    });
  });

  it('rejects invalid optional URLs', () => {
    const result = validateWithSchema(profilePersonalSchema, {
      full_name: '',
      phone: '',
      location: '',
      linkedin_url: 'not-a-url',
      github_url: '',
      portfolio_url: '',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        full_name: ['Enter your full name'],
        phone: ['Enter your phone number'],
        location: ['Enter your location'],
        linkedin_url: ['Enter a valid LinkedIn URL'],
      },
      formErrors: [],
    });
  });
});

describe('profileSummarySchema', () => {
  it('normalizes a professional summary', () => {
    const result = validateWithSchema(profileSummarySchema, {
      summary: '  Senior frontend engineer. ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        summary: 'Senior frontend engineer.',
      },
    });
  });
});

describe('profileExperienceSchema', () => {
  it('normalizes optional dates and current-role state', () => {
    const result = validateWithSchema(profileExperienceSchema, {
      company: ' Acme ',
      title: ' Engineer ',
      start_date: '2024-01-01',
      end_date: '',
      is_current: true,
      description: '  Built the platform. ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        company: 'Acme',
        title: 'Engineer',
        start_date: '2024-01-01',
        end_date: null,
        is_current: true,
        description: 'Built the platform.',
      },
    });
  });
});

describe('profileEducationSchema', () => {
  it('normalizes optional education fields', () => {
    const result = validateWithSchema(profileEducationSchema, {
      institution: ' Example University ',
      degree: ' BSc ',
      field: ' Computer Science ',
      start_date: '2020-09-01',
      end_date: '',
      gpa: ' 3.8 ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        institution: 'Example University',
        degree: 'BSc',
        field: 'Computer Science',
        start_date: '2020-09-01',
        end_date: null,
        gpa: '3.8',
      },
    });
  });
});

describe('profileItemSchemas', () => {
  it('validates skills', () => {
    const result = validateWithSchema(profileItemSchemas.skills, {
      name: ' TypeScript ',
      proficiency: 'expert',
    });

    expect(result).toEqual({
      success: true,
      data: {
        name: 'TypeScript',
        proficiency: 'expert',
      },
    });
  });

  it('validates project URLs only when present', () => {
    const result = validateWithSchema(profileItemSchemas.projects, {
      name: ' Portfolio ',
      url: '',
      description: ' Design system ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        name: 'Portfolio',
        url: '',
        description: 'Design system',
      },
    });
  });
});
