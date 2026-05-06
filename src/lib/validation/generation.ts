import { z } from 'zod';

export const generationRequestSchema = z.object({
  applicationId: z.string().trim().min(1, 'Application ID is required'),
});

export type GenerationRequestInput = z.infer<typeof generationRequestSchema>;
