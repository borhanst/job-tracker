import { z } from 'zod';

export const generationRequestSchema = z.object({
  applicationId: z.string().trim().min(1, 'Application ID is required'),
  save: z.boolean().optional().default(true),
});

export type GenerationRequestInput = z.infer<typeof generationRequestSchema>;
