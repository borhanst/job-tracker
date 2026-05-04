'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { persistProfileCompletion, type ProfileCompletionSnapshot } from '@/lib/profile/completion';

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
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.full_name,
      phone: data.phone,
      location: data.location,
    })
    .eq('user_id', user.id);

  if (error) throw error;

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}

export async function saveOnboardingSummary(summary: string): Promise<ProfileCompletionSnapshot> {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('profiles')
    .update({ summary })
    .eq('user_id', user.id);

  if (error) throw error;

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}

export async function saveOnboardingSkills(skillNames: string[]): Promise<ProfileCompletionSnapshot> {
  const { supabase, user } = await getAuthenticatedUser();
  const names = skillNames
    .map((name) => name.trim())
    .filter(Boolean);

  if (names.length < 3) {
    throw new Error('Add at least 3 skills.');
  }

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
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase.from('work_experiences').insert({
    user_id: user.id,
    company: data.company,
    title: data.title,
    start_date: data.start_date,
    is_current: true,
    description: data.description,
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
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase.from('educations').insert({
    user_id: user.id,
    institution: data.institution,
    degree: data.degree,
    field: data.field,
    start_date: data.start_date,
  });

  if (error) throw error;

  const completion = await persistProfileCompletion(user.id);
  revalidateOnboardingSurfaces();
  return completion;
}
