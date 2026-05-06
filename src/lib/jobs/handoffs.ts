import { createClient } from '@/lib/supabase/server';
import type { JdHandoffCreateInput } from '@/lib/validation/handoffs';
import {
  combineJdHandoffSections,
  getJdHandoffExpiresAt,
  getJdHandoffLoadFailure,
  type JdHandoffRecord,
} from './handoff-core';

export {
  combineJdHandoffSections,
  getJdHandoffExpiresAt,
  getJdHandoffLoadFailure,
  JD_HANDOFF_TTL_MS,
  type JdHandoffLoadFailure,
  type JdHandoffRecord,
} from './handoff-core';

export async function createJdHandoff(userId: string, input: JdHandoffCreateInput) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jd_handoffs')
    .insert({
      user_id: userId,
      url: input.url,
      title: input.title,
      sections: input.sections,
      expires_at: getJdHandoffExpiresAt(),
    })
    .select('id, url, title, sections, expires_at, created_at')
    .single();

  if (error) {
    console.error('Error creating JD Handoff:', error);
    throw new Error('Failed to create JD Handoff');
  }

  return data;
}

export async function loadAndConsumeJdHandoff(id: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jd_handoffs')
    .select('id, user_id, url, title, sections, consumed_at, created_at, expires_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error loading JD Handoff:', error);
    throw new Error('Failed to load JD Handoff');
  }

  if (!data) {
    return {
      success: false as const,
      status: 404 as const,
      error: 'JD Handoff was not found',
    };
  }

  const failure = getJdHandoffLoadFailure(data as JdHandoffRecord, userId);

  if (failure) {
    return {
      success: false as const,
      status: failure.status,
      error: failure.message,
    };
  }

  const consumedAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('jd_handoffs')
    .update({ consumed_at: consumedAt })
    .eq('id', id)
    .eq('user_id', userId)
    .is('consumed_at', null);

  if (updateError) {
    console.error('Error consuming JD Handoff:', updateError);
    throw new Error('Failed to consume JD Handoff');
  }

  const handoff = data as JdHandoffRecord;

  return {
    success: true as const,
    handoff: {
      id: handoff.id,
      url: handoff.url,
      title: handoff.title,
      sections: handoff.sections,
      rawText: combineJdHandoffSections(handoff.sections),
      consumedAt,
    },
  };
}
