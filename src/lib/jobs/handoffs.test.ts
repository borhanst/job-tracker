import { describe, expect, it } from 'vitest';
import {
  combineJdHandoffSections,
  getJdHandoffLoadFailure,
  JD_HANDOFF_TTL_MS,
  type JdHandoffRecord,
} from './handoff-core';

const baseHandoff: JdHandoffRecord = {
  id: 'handoff-1',
  user_id: 'user-1',
  url: 'https://company.example/jobs/123',
  title: 'Senior Accountant',
  sections: ['About the role', 'Responsibilities', 'Requirements'],
  consumed_at: null,
  created_at: '2026-05-05T10:00:00.000Z',
  expires_at: '2026-05-05T10:30:00.000Z',
};

describe('combineJdHandoffSections', () => {
  it('preserves reviewed section order in editable raw text', () => {
    expect(combineJdHandoffSections(baseHandoff.sections)).toBe(
      'About the role\n\nResponsibilities\n\nRequirements',
    );
  });
});

describe('getJdHandoffLoadFailure', () => {
  it('allows the owning user to load an active JD Handoff', () => {
    expect(
      getJdHandoffLoadFailure(baseHandoff, 'user-1', new Date('2026-05-05T10:10:00.000Z')),
    ).toBeNull();
  });

  it('rejects a JD Handoff owned by another user', () => {
    expect(
      getJdHandoffLoadFailure(baseHandoff, 'user-2', new Date('2026-05-05T10:10:00.000Z')),
    ).toEqual({
      status: 404,
      message: 'JD Handoff was not found',
    });
  });

  it('rejects a consumed JD Handoff', () => {
    expect(
      getJdHandoffLoadFailure(
        { ...baseHandoff, consumed_at: '2026-05-05T10:12:00.000Z' },
        'user-1',
        new Date('2026-05-05T10:13:00.000Z'),
      ),
    ).toEqual({
      status: 410,
      message: 'JD Handoff has already been used',
    });
  });

  it('rejects an expired JD Handoff', () => {
    expect(
      getJdHandoffLoadFailure(
        baseHandoff,
        'user-1',
        new Date(new Date(baseHandoff.created_at).getTime() + JD_HANDOFF_TTL_MS + 1),
      ),
    ).toEqual({
      status: 410,
      message: 'JD Handoff has expired',
    });
  });
});
