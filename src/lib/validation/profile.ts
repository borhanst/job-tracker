import { z } from 'zod';
import {
  onboardingEducationSchema,
  onboardingExperienceSchema,
  onboardingPersonalSchema,
  onboardingSummarySchema,
} from './onboarding';

const optionalTrimmedString = z.string().trim();

const optionalDate = z
  .string()
  .trim()
  .transform((value) => value || null)
  .refine((value) => {
    if (value === null) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    return !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
  }, 'Enter a valid end date');

const optionalUrl = (message: string) => z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    return z.url().safeParse(value).success;
  }, message);

const requiredTrimmedString = (message: string) => z.string().trim().min(1, message);

export const profilePersonalSchema = onboardingPersonalSchema.extend({
  linkedin_url: optionalUrl('Enter a valid LinkedIn URL'),
  github_url: optionalUrl('Enter a valid GitHub URL'),
  portfolio_url: optionalUrl('Enter a valid portfolio URL'),
});

export const profileSummarySchema = onboardingSummarySchema;

export const profileExperienceSchema = onboardingExperienceSchema.extend({
  end_date: optionalDate,
  is_current: z.boolean().default(false),
});

export const profileEducationSchema = onboardingEducationSchema.extend({
  end_date: optionalDate,
  gpa: optionalTrimmedString,
});

export const profileItemSchemas = {
  skills: z.object({
    name: requiredTrimmedString('Enter the skill name'),
    proficiency: z.enum(['beginner', 'intermediate', 'expert']),
  }),
  projects: z.object({
    name: requiredTrimmedString('Enter the project name'),
    url: optionalUrl('Enter a valid project URL'),
    description: optionalTrimmedString,
  }),
  certifications: z.object({
    name: requiredTrimmedString('Enter the certification name'),
    issuer: requiredTrimmedString('Enter the issuing organization'),
    issued_date: optionalDate,
  }),
  languages: z.object({
    name: requiredTrimmedString('Enter the language'),
    proficiency: z.enum(['basic', 'conversational', 'fluent', 'native']),
  }),
} as const;

export type ProfileItemTable = keyof typeof profileItemSchemas;
export type ProfilePersonalInput = z.infer<typeof profilePersonalSchema>;
export type ProfileSummaryInput = z.infer<typeof profileSummarySchema>;
export type ProfileExperienceInput = z.infer<typeof profileExperienceSchema>;
export type ProfileEducationInput = z.infer<typeof profileEducationSchema>;
