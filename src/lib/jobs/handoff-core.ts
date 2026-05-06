export const JD_HANDOFF_TTL_MS = 30 * 60 * 1000;

export type JdHandoffRecord = {
  id: string;
  user_id: string;
  url: string;
  title: string | null;
  sections: string[];
  consumed_at: string | null;
  created_at: string;
  expires_at: string;
};

export type JdHandoffLoadFailure = {
  status: 404 | 410;
  message: string;
};

export function getJdHandoffExpiresAt(now = new Date()) {
  return new Date(now.getTime() + JD_HANDOFF_TTL_MS).toISOString();
}

export function combineJdHandoffSections(sections: string[]) {
  return sections.map((section) => section.trim()).filter(Boolean).join('\n\n');
}

export function getJdHandoffLoadFailure(
  handoff: JdHandoffRecord,
  userId: string,
  now = new Date(),
): JdHandoffLoadFailure | null {
  if (handoff.user_id !== userId) {
    return {
      status: 404,
      message: 'JD Handoff was not found',
    };
  }

  if (handoff.consumed_at) {
    return {
      status: 410,
      message: 'JD Handoff has already been used',
    };
  }

  if (new Date(handoff.expires_at).getTime() <= now.getTime()) {
    return {
      status: 410,
      message: 'JD Handoff has expired',
    };
  }

  return null;
}
