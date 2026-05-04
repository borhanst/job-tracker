import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type ProfileCompletionSnapshot = {
  profile_completion_percentage: number;
  profile_completed: boolean;
  onboarding_completed_at: string | null;
};

type CompletionProfile = {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  summary?: string | null;
};

type FullProfileForCompletion = CompletionProfile & {
  skills?: unknown[] | null;
  workExperience?: unknown[] | null;
  education?: unknown[] | null;
};

const REQUIRED_STEPS = 7;

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim().length > 0);
}

export function calculateProfileCompletion(profile: FullProfileForCompletion | null): ProfileCompletionSnapshot {
  if (!profile) {
    return {
      profile_completion_percentage: 0,
      profile_completed: false,
      onboarding_completed_at: null,
    };
  }

  const completedCount = [
    hasValue(profile.full_name),
    hasValue(profile.email),
    hasValue(profile.phone),
    hasValue(profile.location),
    hasValue(profile.summary),
    (profile.skills?.length || 0) >= 3,
    (profile.workExperience?.length || 0) > 0 || (profile.education?.length || 0) > 0,
  ].filter(Boolean).length;

  const percentage = Math.round((completedCount / REQUIRED_STEPS) * 100);
  const completed = completedCount === REQUIRED_STEPS;

  return {
    profile_completion_percentage: percentage,
    profile_completed: completed,
    onboarding_completed_at: completed ? new Date().toISOString() : null,
  };
}

export async function getStoredProfileCompletion(): Promise<ProfileCompletionSnapshot | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('profile_completion_percentage, profile_completed, onboarding_completed_at')
    .eq('user_id', user.id)
    .single();

  if (!data) return null;

  return data as ProfileCompletionSnapshot;
}

export async function persistProfileCompletion(userId: string): Promise<ProfileCompletionSnapshot> {
  const supabase = await createClient();

  const [
    { data: profile },
    { data: skills },
    { data: workExperience },
    { data: education },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, email, phone, location, summary, onboarding_completed_at').eq('user_id', userId).single(),
    supabase.from('skills').select('id').eq('user_id', userId),
    supabase.from('work_experiences').select('id').eq('user_id', userId).limit(1),
    supabase.from('educations').select('id').eq('user_id', userId).limit(1),
  ]);

  const nextCompletion = calculateProfileCompletion({
    ...(profile || {}),
    skills: skills || [],
    workExperience: workExperience || [],
    education: education || [],
  });

  const shouldPreserveCompletedAt = Boolean((profile as any)?.onboarding_completed_at && nextCompletion.profile_completed);

  const updatePayload = {
    profile_completion_percentage: nextCompletion.profile_completion_percentage,
    profile_completed: nextCompletion.profile_completed,
    onboarding_completed_at: shouldPreserveCompletedAt
      ? (profile as any).onboarding_completed_at
      : nextCompletion.onboarding_completed_at,
  };

  const { error } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('user_id', userId);

  if (error) throw error;

  return updatePayload;
}
