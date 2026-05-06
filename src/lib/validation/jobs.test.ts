import { describe, expect, it } from 'vitest';
import { validateWithSchema } from './result';
import {
  applicationCreateSchema,
  applicationStatusUpdateSchema,
  extractRequestSchema,
  scrapeRequestSchema,
} from './jobs';

const jobData = {
  title: 'Product Designer',
  company: 'Acme',
  location: 'Remote',
  type: 'Full-time',
  salary: null,
  requiredSkills: ['Research', 'Figma'],
  niceToHaveSkills: ['React'],
  experience: '3+ years',
  responsibilities: ['Run discovery'],
  aboutCompany: null,
  deadline: null,
};

describe('scrapeRequestSchema', () => {
  it('normalizes a valid job listing URL', () => {
    const result = validateWithSchema(scrapeRequestSchema, {
      url: ' https://company.example/jobs/123 ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        url: 'https://company.example/jobs/123',
      },
    });
  });

  it('rejects invalid job listing URLs', () => {
    const result = validateWithSchema(scrapeRequestSchema, { url: 'not-a-url' });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        url: ['Enter a valid job listing URL'],
      },
      formErrors: [],
    });
  });
});

describe('extractRequestSchema', () => {
  it('normalizes raw job description text', () => {
    const result = validateWithSchema(extractRequestSchema, {
      rawText: '  This role needs a designer who can run research and ship product UX.  ',
    });

    expect(result).toEqual({
      success: true,
      data: {
        rawText: 'This role needs a designer who can run research and ship product UX.',
      },
    });
  });

  it('rejects empty job description text', () => {
    const result = validateWithSchema(extractRequestSchema, { rawText: ' ' });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        rawText: ['Paste the job description text'],
      },
      formErrors: [],
    });
  });
});

describe('applicationCreateSchema', () => {
  it('normalizes a saved application payload', () => {
    const result = validateWithSchema(applicationCreateSchema, {
      url: '',
      raw_text: '  A complete job description. ',
      job_data: jobData,
      match_score: 87.4,
      status: undefined,
    });

    expect(result).toEqual({
      success: true,
      data: {
        url: null,
        raw_text: 'A complete job description.',
        job_data: jobData,
        match_score: 87,
        status: 'saved',
      },
    });
  });

  it('accepts an already-normalized null URL before server save', () => {
    const result = validateWithSchema(applicationCreateSchema, {
      url: null,
      raw_text: 'A complete job description.',
      job_data: jobData,
      match_score: 87,
      status: 'saved',
    });

    expect(result).toEqual({
      success: true,
      data: {
        url: null,
        raw_text: 'A complete job description.',
        job_data: jobData,
        match_score: 87,
        status: 'saved',
      },
    });
  });

  it('normalizes extracted job data when optional AI fields are missing', () => {
    const { salary, niceToHaveSkills, aboutCompany, deadline, ...partialJobData } = jobData;

    const result = validateWithSchema(applicationCreateSchema, {
      url: '',
      raw_text: 'A complete job description.',
      job_data: partialJobData,
      match_score: 72,
    });

    expect(result).toEqual({
      success: true,
      data: {
        url: null,
        raw_text: 'A complete job description.',
        job_data: {
          ...partialJobData,
          salary: null,
          niceToHaveSkills: [],
          aboutCompany: null,
          deadline: null,
        },
        match_score: 72,
        status: 'saved',
      },
    });
  });

  it('normalizes null AI extraction fields before save', () => {
    const result = validateWithSchema(applicationCreateSchema, {
      url: '',
      raw_text: 'A complete job description.',
      job_data: {
        title: null,
        company: null,
        location: null,
        type: null,
        salary: null,
        requiredSkills: null,
        niceToHaveSkills: null,
        experience: null,
        responsibilities: null,
        aboutCompany: null,
        deadline: null,
      },
      match_score: 64,
    });

    expect(result).toEqual({
      success: true,
      data: {
        url: null,
        raw_text: 'A complete job description.',
        job_data: {
          title: 'Untitled role',
          company: 'Unknown company',
          location: 'Not specified',
          type: 'Role type unknown',
          salary: null,
          requiredSkills: [],
          niceToHaveSkills: [],
          experience: '',
          responsibilities: [],
          aboutCompany: null,
          deadline: null,
        },
        match_score: 64,
        status: 'saved',
      },
    });
  });

  it('rejects invalid application fields before save', () => {
    const result = validateWithSchema(applicationCreateSchema, {
      raw_text: 'A complete job description.',
      job_data: { ...jobData, title: '', requiredSkills: [] },
      match_score: 101,
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        match_score: ['Match score must be between 0 and 100'],
      },
      formErrors: [],
    });
  });
});

describe('applicationStatusUpdateSchema', () => {
  it('accepts a supported Application Pipeline status', () => {
    const result = validateWithSchema(applicationStatusUpdateSchema, {
      id: 'app_123',
      status: 'interview',
    });

    expect(result).toEqual({
      success: true,
      data: {
        id: 'app_123',
        status: 'interview',
      },
    });
  });

  it('rejects unsupported Application Pipeline status updates', () => {
    const result = validateWithSchema(applicationStatusUpdateSchema, {
      id: '',
      status: 'maybe',
    });

    expect(result).toEqual({
      success: false,
      fieldErrors: {
        id: ['Application ID is required'],
        status: ['Choose a supported application status'],
      },
      formErrors: [],
    });
  });
});
