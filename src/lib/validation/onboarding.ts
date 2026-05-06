import { z } from 'zod';

const requiredTrimmedString = (message: string) => z.string().trim().min(1, message);

const optionalTrimmedString = z.string().trim();

const dateString = z
  .string()
  .trim()
  .refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    return !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
  }, 'Enter a valid start date');

export const onboardingPersonalSchema = z.object({
  full_name: requiredTrimmedString('Enter your full name'),
  phone: requiredTrimmedString('Enter your phone number'),
  location: requiredTrimmedString('Enter your location'),
});

export const onboardingSummarySchema = z.object({
  summary: requiredTrimmedString('Enter your professional summary'),
});

export const onboardingSkillsSchema = z.object({
  skills: z
    .array(z.string())
    .transform((skills) => skills.map((skill) => skill.trim()).filter(Boolean))
    .pipe(z.array(z.string()).min(3, 'Add at least 3 skills')),
});

export const onboardingExperienceSchema = z.object({
  company: requiredTrimmedString('Enter the company name'),
  title: requiredTrimmedString('Enter your role title'),
  start_date: dateString,
  description: optionalTrimmedString,
});

export const onboardingEducationSchema = z.object({
  institution: requiredTrimmedString('Enter the institution name'),
  degree: requiredTrimmedString('Enter your degree'),
  field: requiredTrimmedString('Enter your field of study'),
  start_date: dateString,
});

export type OnboardingPersonalInput = z.infer<typeof onboardingPersonalSchema>;
export type OnboardingSummaryInput = z.infer<typeof onboardingSummarySchema>;
export type OnboardingSkillsInput = z.infer<typeof onboardingSkillsSchema>;
export type OnboardingExperienceInput = z.infer<typeof onboardingExperienceSchema>;
export type OnboardingEducationInput = z.infer<typeof onboardingEducationSchema>;
