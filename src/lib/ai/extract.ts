import { generateObject } from 'ai';
import { z } from 'zod';

export const jobDataSchema = z.object({
  title: z.string().describe('The job title'),
  company: z.string().describe('The name of the company hiring'),
  location: z.string().describe('The location of the job (e.g. Remote, New York, NY)'),
  type: z.string().describe('Job type (e.g. Full-time, Contract, Part-time, Internship)'),
  salary: z.string().nullable().describe('Salary range if mentioned, otherwise null'),
  requiredSkills: z.array(z.string()).describe('List of strictly required skills or technologies'),
  niceToHaveSkills: z.array(z.string()).describe('List of nice-to-have or preferred skills'),
  experience: z.string().describe('Required years of experience or seniority level'),
  responsibilities: z.array(z.string()).describe('Key responsibilities or day-to-day tasks'),
  aboutCompany: z.string().nullable().describe('A short paragraph about the company, if mentioned'),
  deadline: z.string().nullable().describe('Application deadline if mentioned, otherwise null'),
});

export type JobData = z.infer<typeof jobDataSchema>;

export async function extractJobData(rawText: string, model: any): Promise<JobData> {
  const { object } = await generateObject({
    model,
    schema: jobDataSchema,
    prompt: `
      Analyze the following job description and extract the structured information requested.
      Be precise. If a piece of information is not present in the text, return null for that field 
      (or an empty array for lists). Do not invent or hallucinate information.
      
      Job Description:
      ${rawText.substring(0, 15000)} // Trim to avoid massive token usage on accidental giant scrapes
    `,
  });

  return object;
}

export async function computeMatchScore(jobData: JobData, profile: any, model: any): Promise<number> {
  // If the profile is completely empty, return 0
  if (!profile || (!profile.summary && profile.skills.length === 0 && profile.workExperience.length === 0)) {
    return 0;
  }

  const scoreSchema = z.object({
    score: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how well the profile matches the job requirements'),
    reasoning: z.string().describe('A brief, one-sentence explanation of the score'),
  });

  const { object } = await generateObject({
    model,
    schema: scoreSchema,
    prompt: `
      You are an expert technical recruiter. Evaluate how well the candidate's profile matches the job requirements.
      Return a match score from 0 to 100. Be realistic and critical.

      Job Requirements:
      - Title: ${jobData.title}
      - Required Skills: ${jobData.requiredSkills.join(', ')}
      - Nice to Have: ${jobData.niceToHaveSkills.join(', ')}
      - Experience: ${jobData.experience}

      Candidate Profile:
      - Summary: ${profile.summary || 'N/A'}
      - Skills: ${profile.skills?.map((s: any) => \`\${s.name} (\${s.proficiency})\`).join(', ') || 'N/A'}
      - Work Experience: ${profile.workExperience?.map((w: any) => \`\${w.title} at \${w.company} (\${w.start_date} to \${w.end_date || 'Present'})\`).join(' | ') || 'N/A'}
      - Education: ${profile.education?.map((e: any) => \`\${e.degree} in \${e.field}\`).join(', ') || 'N/A'}
    `,
  });

  return object.score;
}
