import { generateObject, generateText } from 'ai';
import { z } from 'zod';

export const cvSectionSchema = z.object({
  summary: z.string().describe('A tailored 3-4 sentence professional summary'),
  experiences: z.array(z.object({
    id: z.string(),
    company: z.string(),
    title: z.string(),
    description: z.string().describe('3-4 bullet points tailored to the job description'),
  })),
  skills: z.array(z.string()).describe('Top 10 most relevant skills for this job'),
});

export async function generateTailoredCV(jobData: any, profile: any, model: any) {
  const { object } = await generateObject({
    model,
    schema: cvSectionSchema,
    prompt: `
      You are an expert career coach and CV writer. Your goal is to tailor the candidate's profile to a specific job description.
      
      Job Description:
      - Title: ${jobData.title}
      - Company: ${jobData.company}
      - Requirements: ${jobData.requiredSkills.join(', ')}
      
      Candidate Profile:
      - Name: ${profile.full_name}
      - Summary: ${profile.summary}
      - Skills: ${profile.skills?.map((s: any) => s.name).join(', ')}
      - Experience: ${profile.workExperience?.map((w: any) => \`\${w.title} at \${w.company}: \${w.description}\`).join(' | ')}
      
      Task:
      1. Rewrite the professional summary to highlight the most relevant experience for this job.
      2. For each work experience, rewrite the description as a cohesive block of bullet points (use \n for bullets) that emphasize accomplishments related to the job's needs.
      3. Select and rank the top 10 skills that match the job description.
      
      Maintain the candidate's actual experience; do not fabricate roles or skills they don't have.
    `,
  });

  return object;
}

export async function generateCoverLetter(jobData: any, profile: any, model: any) {
  const { text } = await generateText({
    model,
    prompt: `
      Write a highly personalized, professional cover letter for the following job application.
      
      Job Info:
      - Title: ${jobData.title}
      - Company: ${jobData.company}
      
      Candidate Info:
      - Name: ${profile.full_name}
      - Background: ${profile.summary}
      
      The letter should:
      - Be roughly 300-400 words.
      - Have a professional header and greeting.
      - Start with a strong opening that expresses genuine interest in ${jobData.company}.
      - Connect 2-3 key accomplishments from the candidate's profile to the job requirements.
      - End with a professional call to action.
      - Use a tone that is confident but not arrogant.
    `,
  });

  return text;
}
