'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { persistProfileCompletion, type ProfileCompletionSnapshot } from '@/lib/profile/completion';
import {
  onboardingEducationSchema,
  onboardingExperienceSchema,
  onboardingPersonalSchema,
  onboardingSkillsSchema,
  onboardingSummarySchema,
  validateWithSchema,
} from '@/lib/validation';

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  return { supabase, user };
}

function revalidateOnboardingSurfaces() {
  revalidatePath('/onboarding');
  revalidatePath('/profile');
  revalidatePath('/dashboard');
}

export async function saveOnboardingPersonal(data: {
  full_name: string;
  phone: string;
  location: string;
}): Promise<ProfileCompletionSnapshot> {
  const validation = validateWithSchema(onboardingPersonalSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the personal information fields.');
  }

  const { supabase, user } = await getAuthenticatedUser();
  const personal = validation.data;

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: personal.full_name,
      phone: personal.phone,
      location: personal.location,
    })
    .eq('user_id', user.id);

  if (error) throw error;

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}

export async function saveOnboardingSummary(summary: string): Promise<ProfileCompletionSnapshot> {
  const validation = validateWithSchema(onboardingSummarySchema, { summary });
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the professional summary.');
  }

  const { supabase, user } = await getAuthenticatedUser();
  const summaryData = validation.data;

  const { error } = await supabase
    .from('profiles')
    .update({ summary: summaryData.summary })
    .eq('user_id', user.id);

  if (error) throw error;

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}

export async function saveOnboardingSkills(skillNames: string[]): Promise<ProfileCompletionSnapshot> {
  const validation = validateWithSchema(onboardingSkillsSchema, { skills: skillNames });
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? validation.fieldErrors.skills?.[0] ?? 'Add at least 3 skills.');
  }

  const { supabase, user } = await getAuthenticatedUser();
  const names = validation.data.skills;

  const { data: existingSkills, error: existingError } = await supabase
    .from('skills')
    .select('name')
    .eq('user_id', user.id);

  if (existingError) throw existingError;

  const existing = new Set((existingSkills || []).map((skill) => skill.name.toLowerCase()));
  const newRows = names
    .filter((name) => !existing.has(name.toLowerCase()))
    .map((name) => ({
      user_id: user.id,
      name,
      proficiency: 'intermediate',
    }));

  if (newRows.length > 0) {
    const { error } = await supabase.from('skills').insert(newRows);
    if (error) throw error;
  }

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}

export async function saveOnboardingExperience(data: {
  company: string;
  title: string;
  start_date: string;
  description: string;
}): Promise<ProfileCompletionSnapshot> {
  const validation = validateWithSchema(onboardingExperienceSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the work experience fields.');
  }

  const { supabase, user } = await getAuthenticatedUser();
  const experience = validation.data;

  const { error } = await supabase.from('work_experiences').insert({
    user_id: user.id,
    company: experience.company,
    title: experience.title,
    start_date: experience.start_date,
    is_current: true,
    description: experience.description,
  });

  if (error) throw error;

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}

export async function saveOnboardingEducation(data: {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
}): Promise<ProfileCompletionSnapshot> {
  const validation = validateWithSchema(onboardingEducationSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the education fields.');
  }

  const { supabase, user } = await getAuthenticatedUser();
  const education = validation.data;

  const { error } = await supabase.from('educations').insert({
    user_id: user.id,
    institution: education.institution,
    degree: education.degree,
    field: education.field,
    start_date: education.start_date,
  });

  if (error) throw error;

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}
