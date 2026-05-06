'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { applicationCreateSchema, applicationStatusUpdateSchema, validateWithSchema } from '@/lib/validation';

export async function createApplication(data: {
  url?: string | null;
  raw_text: string;
  job_data: any;
  match_score: number;
  status?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const validation = validateWithSchema(applicationCreateSchema, data);
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the application fields.');
  }

  const applicationInput = validation.data;

  const { data: application, error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      url: applicationInput.url,
      raw_text: applicationInput.raw_text,
      job_data: applicationInput.job_data,
      match_score: applicationInput.match_score,
      status: applicationInput.status,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error);
    throw new Error('Failed to save application');
  }

  revalidatePath('/applications');
  return application;
}

export async function getApplications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return data;
}

export async function updateApplicationStatus(id: string, status: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const validation = validateWithSchema(applicationStatusUpdateSchema, { id, status });
  if (!validation.success) {
    throw new Error(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the application status.');
  }

  const { error } = await supabase
    .from('applications')
    .update({ status: validation.data.status, updated_at: new Date().toISOString() })
    .eq('id', validation.data.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating status:', error);
    throw new Error('Failed to update status');
  }

  revalidatePath('/applications');
}

export async function getApplicationById(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: application, error } = await supabase
    .from('applications')
    .select('*, generated_documents(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching application:', error);
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile for application:', profileError);
  }

  return {
    ...application,
    profile
  };
}
