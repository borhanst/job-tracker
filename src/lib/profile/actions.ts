'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { persistProfileCompletion } from './completion';
import {
  profileEducationSchema,
  profileExperienceSchema,
  profileItemSchemas,
  profilePersonalSchema,
  profileSummarySchema,
  validateWithSchema,
  type ProfileItemTable,
} from '@/lib/validation';

export async function getFullProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [
    { data: profile },
    { data: workExperience },
    { data: education },
    { data: skills },
    { data: projects },
    { data: certifications },
    { data: languages },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('work_experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    supabase.from('educations').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
    supabase.from('skills').select('*').eq('user_id', user.id),
    supabase.from('projects').select('*').eq('user_id', user.id),
    supabase.from('certifications').select('*').eq('user_id', user.id),
    supabase.from('languages').select('*').eq('user_id', user.id),
  ]);

  return {
    ...profile,
    workExperience: workExperience || [],
    education: education || [],
    skills: skills || [],
    projects: projects || [],
    certifications: certifications || [],
    languages: languages || [],
  };
}

export async function updateProfile(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const schema = Object.prototype.hasOwnProperty.call(formData, 'summary')
    ? profileSummarySchema
    : profilePersonalSchema;
  const validation = validateWithSchema(schema, formData);

  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the profile fields.');
  }

  const { error } = await supabase
    .from('profiles')
    .update(validation.data)
    .eq('user_id', user.id);

  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

// Work Experience Actions
export async function addWorkExperience(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const validation = validateWithSchema(profileExperienceSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the work experience fields.');
  }

  const { error } = await supabase.from('work_experiences').insert({ ...validation.data, user_id: user.id });
  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

export async function updateWorkExperience(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const validation = validateWithSchema(profileExperienceSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the work experience fields.');
  }

  const { error } = await supabase.from('work_experiences').update(validation.data).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

export async function deleteWorkExperience(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('work_experiences').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

// Education Actions
export async function addEducation(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const validation = validateWithSchema(profileEducationSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the education fields.');
  }

  const { error } = await supabase.from('educations').insert({ ...validation.data, user_id: user.id });
  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

export async function updateEducation(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const validation = validateWithSchema(profileEducationSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the education fields.');
  }

  const { error } = await supabase.from('educations').update(validation.data).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

export async function deleteEducation(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('educations').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

// Generic Actions for remaining tables
export async function addProfileItem(table: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  if (!Object.prototype.hasOwnProperty.call(profileItemSchemas, table)) {
    throw new Error('Unsupported profile section.');
  }

  const schema = profileItemSchemas[table as ProfileItemTable];
  const validation = validateWithSchema(schema, data);

  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the profile section fields.');
  }

  const { error } = await supabase.from(table).insert({ ...validation.data, user_id: user.id });
  if (error) throw error;
  if (table === 'skills') {
    await persistProfileCompletion(user.id);
  }
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

export async function deleteProfileItem(table: string, id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from(table).delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  if (table === 'skills') {
    await persistProfileCompletion(user.id);
  }
  revalidatePath('/profile');
  revalidatePath('/onboarding');
  revalidatePath('/dashboard');
}

export async function skipOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_skipped: true })
    .eq('user_id', user.id);

  if (error) throw error;
  await persistProfileCompletion(user.id);
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
