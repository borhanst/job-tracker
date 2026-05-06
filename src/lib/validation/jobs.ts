import { z } from 'zod';

const requiredTrimmedString = (message: string) => z.string().trim().min(1, message);

export const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'phone_screen',
  'interview',
  'offer',
  'accepted',
  'rejected',
] as const;

const applicationStatusSchema = z.enum(APPLICATION_STATUSES, {
  error: 'Choose a supported application status',
});

const optionalUrlToNull = z
  .string()
  .trim()
  .nullish()
  .transform((value) => value || null)
  .refine((value) => {
    if (value === null) return true;
    return z.url().safeParse(value).success;
  }, 'Enter a valid job listing URL');

const nullableTrimmedString = z
  .string()
  .trim()
  .nullish()
  .transform((value) => value ?? null);

const aiStringWithDefault = (defaultValue: string) =>
  z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || defaultValue);

const aiStringList = z
  .array(z.string().trim().min(1))
  .nullish()
  .transform((value) => value ?? []);

export const scrapeRequestSchema = z.object({
  url: requiredTrimmedString('Enter a job listing URL').pipe(z.url('Enter a valid job listing URL')),
});

export const extractRequestSchema = z.object({
  rawText: requiredTrimmedString('Paste the job description text'),
});

export const extractedJobDataSchema = z.object({
  title: aiStringWithDefault('Untitled role'),
  company: aiStringWithDefault('Unknown company'),
  location: aiStringWithDefault('Not specified'),
  type: aiStringWithDefault('Role type unknown'),
  salary: nullableTrimmedString,
  requiredSkills: aiStringList,
  niceToHaveSkills: aiStringList,
  experience: aiStringWithDefault(''),
  responsibilities: aiStringList,
  aboutCompany: nullableTrimmedString,
  deadline: nullableTrimmedString,
});

export const applicationCreateSchema = z.object({
  url: optionalUrlToNull.optional().default(null),
  raw_text: requiredTrimmedString('Job description text is required'),
  job_data: extractedJobDataSchema,
  match_score: z
    .number()
    .min(0, 'Match score must be between 0 and 100')
    .max(100, 'Match score must be between 0 and 100')
    .transform((score) => Math.round(score)),
  status: applicationStatusSchema.default('saved'),
});

export const applicationStatusUpdateSchema = z.object({
  id: requiredTrimmedString('Application ID is required'),
  status: applicationStatusSchema,
});

export type ScrapeRequestInput = z.infer<typeof scrapeRequestSchema>;
export type ExtractRequestInput = z.infer<typeof extractRequestSchema>;
export type ExtractedJobDataInput = z.infer<typeof extractedJobDataSchema>;
export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
export type ApplicationStatusUpdateInput = z.infer<typeof applicationStatusUpdateSchema>;
