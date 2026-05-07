'use server';

import { createClient } from '@/lib/supabase/server';

export async function getLatestCvVersion(applicationId?: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let query = supabase
    .from('cv_versions')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1);

  query = applicationId
    ? query.eq('application_id', applicationId)
    : query.is('application_id', null);

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error loading CV version:', error);
    return null;
  }

  return data;
}
