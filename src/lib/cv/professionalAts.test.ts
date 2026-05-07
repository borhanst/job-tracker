import { describe, expect, it } from 'vitest';
import {
  buildProfessionalAtsSnapshot,
  DEFAULT_PROFESSIONAL_ATS_ORDER,
} from './professionalAts';

describe('buildProfessionalAtsSnapshot', () => {
  it('builds an ATS snapshot from profile data', () => {
    const snapshot = buildProfessionalAtsSnapshot({
      full_name: 'Alex Rahman',
      email: 'alex@example.com',
      phone: '+880100000000',
      location: 'Dhaka, BD',
      linkedin_url: 'https://linkedin.com/in/alex',
      github_url: 'https://github.com/alex',
      portfolio_url: 'https://alex.dev',
      summary: 'Frontend engineer with product-first delivery focus.',
      skills: [{ id: 's1', name: 'React', proficiency: 'expert' }],
      workExperience: [
        {
          id: 'w1',
          company: 'Acme',
          title: 'Frontend Engineer',
          start_date: '2022-01-01',
          end_date: null,
          is_current: true,
          achievements: ['Improved conversion through checkout redesign'],
          description: 'Built reusable component library\nReduced release bugs',
        },
      ],
      projects: [
        {
          id: 'p1',
          name: 'Design System',
          description: 'Created shared tokens and UI primitives',
          tech_stack: ['React', 'TypeScript'],
          url: 'https://project.example.com',
        },
      ],
      education: [{ id: 'e1', institution: 'BUET', degree: 'BSc', field: 'CSE' }],
      certifications: [{ id: 'c1', name: 'AWS CCP', issuer: 'AWS', issued_date: '2024-03-01' }],
      languages: [{ id: 'l1', name: 'English', proficiency: 'fluent' }],
    });

    expect(snapshot.template).toBe('professional-ats');
    expect(snapshot.header.full_name).toBe('Alex Rahman');
    expect(snapshot.skills).toHaveLength(1);
    expect(snapshot.experience).toHaveLength(1);
    expect(snapshot.experience[0]?.bullets).toHaveLength(3);
    expect(snapshot.projects).toHaveLength(1);
    expect(snapshot.education).toHaveLength(1);
    expect(snapshot.certifications).toHaveLength(1);
    expect(snapshot.languages).toHaveLength(1);
    expect(snapshot.section_order).toEqual(DEFAULT_PROFESSIONAL_ATS_ORDER);
  });

  it('handles empty profile arrays safely', () => {
    const snapshot = buildProfessionalAtsSnapshot({
      full_name: 'No Data',
    });

    expect(snapshot.experience).toEqual([]);
    expect(snapshot.projects).toEqual([]);
    expect(snapshot.education).toEqual([]);
    expect(snapshot.certifications).toEqual([]);
    expect(snapshot.languages).toEqual([]);
    expect(snapshot.skills).toEqual([]);
  });
});
