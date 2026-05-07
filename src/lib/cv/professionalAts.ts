export type CvSectionId =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'languages';

export const DEFAULT_PROFESSIONAL_ATS_ORDER: CvSectionId[] = [
  'summary',
  'skills',
  'experience',
  'projects',
  'education',
  'certifications',
  'languages',
];

export interface CvBullet {
  id: string;
  text: string;
  visible: boolean;
  sort_order: number;
}

export interface CvExperienceEntry {
  id: string;
  company: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  bullets: CvBullet[];
  visible: boolean;
  sort_order: number;
}

export interface CvProjectEntry {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  url: string | null;
  bullets: CvBullet[];
  visible: boolean;
  sort_order: number;
}

export interface CvEducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string | null;
  end_date: string | null;
  gpa: string | null;
  visible: boolean;
  sort_order: number;
}

export interface CvCertificationEntry {
  id: string;
  name: string;
  issuer: string;
  issued_date: string | null;
  url: string | null;
  visible: boolean;
  sort_order: number;
}

export interface CvLanguageEntry {
  id: string;
  name: string;
  proficiency: string;
  visible: boolean;
  sort_order: number;
}

export interface CvSkillEntry {
  id: string;
  name: string;
  proficiency: string;
  visible: boolean;
  sort_order: number;
}

export interface ProfessionalAtsSnapshot {
  template: 'professional-ats';
  header: {
    full_name: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    linkedin_url: string;
    github_url: string;
    portfolio_url: string;
  };
  summary: string;
  skills: CvSkillEntry[];
  experience: CvExperienceEntry[];
  projects: CvProjectEntry[];
  education: CvEducationEntry[];
  certifications: CvCertificationEntry[];
  languages: CvLanguageEntry[];
  section_order: CvSectionId[];
}

const cleanText = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const toBulletLines = (value: unknown): string[] => {
  if (typeof value !== 'string') return [];

  return value
    .split('\n')
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);
};

const toSafeId = (value: unknown, fallbackPrefix: string, index: number): string => {
  const candidate = cleanText(value);
  return candidate || `${fallbackPrefix}-${index + 1}`;
};

const asArray = (value: unknown): any[] => (Array.isArray(value) ? value : []);

export function buildProfessionalAtsSnapshot(profile: any): ProfessionalAtsSnapshot {
  const summary = cleanText(profile?.summary);

  const experience = asArray(profile?.workExperience).map((item, index) => {
    const bullets: CvBullet[] = [
      ...asArray(item?.achievements).map((achievement, achievementIndex) => ({
        id: `${toSafeId(item?.id, 'experience', index)}-ach-${achievementIndex + 1}`,
        text: cleanText(achievement),
        visible: true,
        sort_order: achievementIndex,
      })),
      ...toBulletLines(item?.description).map((line, lineIndex) => ({
        id: `${toSafeId(item?.id, 'experience', index)}-desc-${lineIndex + 1}`,
        text: line,
        visible: true,
        sort_order: asArray(item?.achievements).length + lineIndex,
      })),
    ].filter((bullet) => bullet.text);

    return {
      id: toSafeId(item?.id, 'experience', index),
      company: cleanText(item?.company),
      title: cleanText(item?.title),
      start_date: cleanText(item?.start_date) || null,
      end_date: cleanText(item?.end_date) || null,
      is_current: Boolean(item?.is_current),
      bullets,
      visible: true,
      sort_order: index,
    };
  }).filter((item) => item.company || item.title || item.bullets.length > 0);

  const projects = asArray(profile?.projects).map((item, index) => {
    const descriptionBullets = toBulletLines(item?.description);
    const bullets: CvBullet[] = descriptionBullets.map((line, lineIndex) => ({
      id: `${toSafeId(item?.id, 'project', index)}-desc-${lineIndex + 1}`,
      text: line,
      visible: true,
      sort_order: lineIndex,
    }));

    return {
      id: toSafeId(item?.id, 'project', index),
      name: cleanText(item?.name),
      description: cleanText(item?.description),
      tech_stack: asArray(item?.tech_stack).map((value) => cleanText(value)).filter(Boolean),
      url: cleanText(item?.url) || null,
      bullets,
      visible: true,
      sort_order: index,
    };
  }).filter((item) => item.name || item.description || item.bullets.length > 0);

  const education = asArray(profile?.education).map((item, index) => ({
    id: toSafeId(item?.id, 'education', index),
    institution: cleanText(item?.institution),
    degree: cleanText(item?.degree),
    field: cleanText(item?.field),
    start_date: cleanText(item?.start_date) || null,
    end_date: cleanText(item?.end_date) || null,
    gpa: cleanText(item?.gpa) || null,
    visible: true,
    sort_order: index,
  })).filter((item) => item.institution || item.degree || item.field);

  const certifications = asArray(profile?.certifications).map((item, index) => ({
    id: toSafeId(item?.id, 'certification', index),
    name: cleanText(item?.name),
    issuer: cleanText(item?.issuer),
    issued_date: cleanText(item?.issued_date) || null,
    url: cleanText(item?.url) || null,
    visible: true,
    sort_order: index,
  })).filter((item) => item.name || item.issuer);

  const languages = asArray(profile?.languages).map((item, index) => ({
    id: toSafeId(item?.id, 'language', index),
    name: cleanText(item?.name),
    proficiency: cleanText(item?.proficiency),
    visible: true,
    sort_order: index,
  })).filter((item) => item.name);

  const skills = asArray(profile?.skills).map((item, index) => ({
    id: toSafeId(item?.id, 'skill', index),
    name: cleanText(item?.name),
    proficiency: cleanText(item?.proficiency),
    visible: true,
    sort_order: index,
  })).filter((item) => item.name);

  return {
    template: 'professional-ats',
    header: {
      full_name: cleanText(profile?.full_name),
      headline: '',
      location: cleanText(profile?.location),
      email: cleanText(profile?.email),
      phone: cleanText(profile?.phone),
      linkedin_url: cleanText(profile?.linkedin_url),
      github_url: cleanText(profile?.github_url),
      portfolio_url: cleanText(profile?.portfolio_url),
    },
    summary,
    skills,
    experience,
    projects,
    education,
    certifications,
    languages,
    section_order: [...DEFAULT_PROFESSIONAL_ATS_ORDER],
  };
}

export function buildProfessionalAtsSnapshotForApplication(profile: any, application: any): ProfessionalAtsSnapshot {
  const snapshot = buildProfessionalAtsSnapshot(profile);
  const jobTitle = cleanText(application?.job_data?.title);

  if (jobTitle) {
    snapshot.header.headline = jobTitle;
  }

  return snapshot;
}
