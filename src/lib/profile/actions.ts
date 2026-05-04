'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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

  const { error } = await supabase
    .from('profiles')
    .update(formData)
    .eq('user_id', user.id);

  if (error) throw error;
  revalidatePath('/profile');
}

// Work Experience Actions
export async function addWorkExperience(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('work_experiences').insert({ ...data, user_id: user.id });
  if (error) throw error;
  revalidatePath('/profile');
}

export async function updateWorkExperience(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('work_experiences').update(data).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  revalidatePath('/profile');
}

export async function deleteWorkExperience(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('work_experiences').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  revalidatePath('/profile');
}

// Education Actions
export async function addEducation(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('educations').insert({ ...data, user_id: user.id });
  if (error) throw error;
  revalidatePath('/profile');
}

export async function updateEducation(id: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('educations').update(data).eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  revalidatePath('/profile');
}

export async function deleteEducation(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('educations').delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  revalidatePath('/profile');
}

// Generic Actions for remaining tables
export async function addProfileItem(table: string, data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from(table).insert({ ...data, user_id: user.id });
  if (error) throw error;
  revalidatePath('/profile');
}

export async function deleteProfileItem(table: string, id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from(table).delete().eq('id', id).eq('user_id', user.id);
  if (error) throw error;
  revalidatePath('/profile');
}

