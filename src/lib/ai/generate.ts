import { generateObject, generateText } from 'ai';
import { z } from 'zod';

const cvSectionOrderSchema = z.enum([
  'summary',
  'skills',
  'experience',
  'projects',
  'education',
  'certifications',
  'languages',
]);

export const cvSectionSchema = z.object({
  headline: z.string().optional().default(''),
  summary: z.string().describe('A tailored 3-4 sentence professional summary'),
  experiences: z.array(z.object({
    id: z.string(),
    company: z.string(),
    title: z.string(),
    description: z.string().describe('3-4 bullet points tailored to the job description'),
  })).default([]),
  skills: z.array(z.string()).describe('Top 10 most relevant skills for this job').default([]),
  projectOrder: z.array(z.string()).optional().default([]),
  certificationOrder: z.array(z.string()).optional().default([]),
  languageOrder: z.array(z.string()).optional().default([]),
  sectionOrder: z.array(cvSectionOrderSchema).optional().default([]),
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
      - Location: ${jobData.location}
      - Job Type: ${jobData.type}
      - Salary: ${jobData.salary || 'Not specified'}
      - Experience Requested: ${jobData.experience || 'Not specified'}
      - Required Skills: ${(jobData.requiredSkills || []).join(', ')}
      - Nice to Have Skills: ${(jobData.niceToHaveSkills || []).join(', ')}
      - Responsibilities: ${(jobData.responsibilities || []).join(' | ')}
      - About Company: ${jobData.aboutCompany || 'Not specified'}
      - Deadline: ${jobData.deadline || 'Not specified'}
      - Original Posting URL: ${jobData.url || 'Not provided'}
      - Full Job Text: ${jobData.rawText || 'Not provided'}
      
      Candidate Profile:
      - Name: ${profile.full_name}
      - Summary: ${profile.summary}
      - Skills: ${profile.skills?.map((s: any) => s.name).join(', ')}
      - Experience: ${profile.workExperience?.map((w: any) => `${w.title} at ${w.company}: ${w.description}`).join(' | ')}
      - Projects: ${profile.projects?.map((p: any) => `${p.id}: ${p.name} - ${p.description || ''}`).join(' | ')}
      - Certifications: ${profile.certifications?.map((c: any) => `${c.id}: ${c.name} (${c.issuer})`).join(' | ')}
      - Languages: ${profile.languages?.map((l: any) => `${l.id}: ${l.name} (${l.proficiency})`).join(' | ')}
      
      Task:
      1. Suggest a concise headline for the CV header based on the role title.
      1. Rewrite the professional summary to highlight the most relevant experience for this job.
      2. For each work experience, rewrite the description as a cohesive block of bullet points (use \n for bullets) that emphasize accomplishments related to the job's needs.
      3. Select and rank the top 10 skills that match the job description.
      4. Return projectOrder, certificationOrder, and languageOrder as arrays of existing IDs ranked by relevance.
      5. Return sectionOrder (from: summary, skills, experience, projects, education, certifications, languages) if reordering improves relevance.
      
      Rules:
      - Use only facts from the provided candidate profile.
      - Do not invent companies, roles, certifications, languages, projects, or impact metrics.
      - Preserve existing IDs in experiences and ordering arrays.
      - If data for an item is missing, omit it instead of fabricating.
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
