'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createApplication(data: {
  url?: string;
  raw_text: string;
  job_data: any;
  match_score: number;
  status?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Not authenticated');

  const { data: application, error } = await supabase
    .from('applications')
    .insert({
      user_id: user.id,
      url: data.url,
      raw_text: data.raw_text,
      job_data: data.job_data,
      match_score: data.match_score,
      status: data.status || 'saved',
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

  const { error } = await supabase
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
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

  const { data, error } = await supabase
    .from('applications')
    .select('*, generated_documents(*), profiles(*)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching application:', error);
    return null;
  }

  // Flatten profiles array from Supabase select
  return {
    ...data,
    profile: data.profiles
  };
}
