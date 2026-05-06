import { z } from 'zod';

const requiredTrimmedString = (message: string) => z.string().trim().min(1, message);

const optionalTitle = z
  .string()
  .trim()
  .nullish()
  .transform((value) => value || null);

export const jdHandoffCreateSchema = z.object({
  url: requiredTrimmedString('Enter a job listing URL').pipe(z.url('Enter a valid job listing URL')),
  title: optionalTitle,
  sections: z
    .array(requiredTrimmedString('Selected section text is required'))
    .min(1, 'Add at least one selected section'),
});

export type JdHandoffCreateInput = z.infer<typeof jdHandoffCreateSchema>;
