'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Download, Edit3, EyeOff, Loader2, Save, Sparkles } from 'lucide-react';
import type {
  CvBullet,
  CvCertificationEntry,
  CvEducationEntry,
  CvExperienceEntry,
  CvLanguageEntry,
  CvProjectEntry,
  CvSkillEntry,
  CvSectionId,
  ProfessionalAtsSnapshot,
} from '@/lib/cv/professionalAts';
import ProfessionalAtsPreview from './ProfessionalAtsPreview';
import { ProfessionalAtsTemplate } from './ProfessionalAtsTemplate';

interface ProfessionalAtsBuilderProps {
  initialSnapshot: ProfessionalAtsSnapshot;
  contextLabel: string;
  applicationId?: string | null;
  initialVersionId?: string | null;
  initialHiddenSections?: CvSectionId[];
}

interface SuspiciousClaim {
  section: 'summary' | 'experience' | 'projects';
  entryId?: string;
  bulletId?: string;
  text: string;
}

const cloneSnapshot = (snapshot: ProfessionalAtsSnapshot): ProfessionalAtsSnapshot => JSON.parse(JSON.stringify(snapshot));

function SectionPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cv-control-panel">
      <div className="cv-control-panel__header">
        <span><Edit3 size={15} /> Edit</span>
        <h4>{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default function ProfessionalAtsBuilder({
  initialSnapshot,
  contextLabel,
  applicationId = null,
  initialVersionId = null,
  initialHiddenSections = [],
}: ProfessionalAtsBuilderProps) {
  const [snapshot, setSnapshot] = useState<ProfessionalAtsSnapshot>(() => cloneSnapshot(initialSnapshot));
  const [hiddenSections, setHiddenSections] = useState<CvSectionId[]>(initialHiddenSections);
  const [versionId, setVersionId] = useState<string | null>(initialVersionId);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showDownloadChecklist, setShowDownloadChecklist] = useState(false);
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<ProfessionalAtsSnapshot>(() => cloneSnapshot(initialSnapshot));
  const [lastSavedHiddenSections, setLastSavedHiddenSections] = useState<CvSectionId[]>(initialHiddenSections);

  const baselineNumericTokens = useMemo(() => {
    const collectText = (value: string) => value.match(/\b\d+(?:\.\d+)?%?\b/g) ?? [];
    const tokens = new Set<string>();

    const addText = (value: string) => {
      collectText(value).forEach((token) => tokens.add(token));
    };

    addText(initialSnapshot.summary || '');
    initialSnapshot.experience.forEach((entry) => {
      entry.bullets.forEach((bullet) => addText(bullet.text));
    });
    initialSnapshot.projects.forEach((entry) => {
      entry.bullets.forEach((bullet) => addText(bullet.text));
      addText(entry.description || '');
    });

    return tokens;
  }, [initialSnapshot]);

  const visibleSectionCount = useMemo(() => {
    const counts = [
      snapshot.summary ? 1 : 0,
      snapshot.skills.length > 0 ? 1 : 0,
      snapshot.experience.length > 0 ? 1 : 0,
      snapshot.projects.length > 0 ? 1 : 0,
      snapshot.education.length > 0 ? 1 : 0,
      snapshot.certifications.length > 0 ? 1 : 0,
      snapshot.languages.length > 0 ? 1 : 0,
    ];

    return counts.reduce((total, value) => total + value, 0);
  }, [snapshot]);

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(snapshot) !== JSON.stringify(lastSavedSnapshot)
      || JSON.stringify(hiddenSections) !== JSON.stringify(lastSavedHiddenSections);
  }, [snapshot, lastSavedSnapshot, hiddenSections, lastSavedHiddenSections]);

  const suspiciousClaims = useMemo<SuspiciousClaim[]>(() => {
    const claims: SuspiciousClaim[] = [];
    const hasNumericClaim = (value: string) => /\b\d+(?:\.\d+)?%?\b/.test(value);
    const hasStrongClaimWord = (value: string) => /(increased|reduced|improved|boosted|grew|cut|saved|accelerated)/i.test(value);
    const extractTokens = (value: string) => value.match(/\b\d+(?:\.\d+)?%?\b/g) ?? [];

    const isSuspicious = (value: string): boolean => {
      if (!hasNumericClaim(value)) return false;
      if (!hasStrongClaimWord(value)) return false;
      const tokens = extractTokens(value);
      return tokens.some((token) => !baselineNumericTokens.has(token));
    };

    if (isSuspicious(snapshot.summary)) {
      claims.push({ section: 'summary', text: snapshot.summary });
    }

    snapshot.experience.forEach((entry) => {
      entry.bullets.forEach((bullet) => {
        if (isSuspicious(bullet.text)) {
          claims.push({ section: 'experience', entryId: entry.id, bulletId: bullet.id, text: bullet.text });
        }
      });
    });

    snapshot.projects.forEach((entry) => {
      entry.bullets.forEach((bullet) => {
        if (isSuspicious(bullet.text)) {
          claims.push({ section: 'projects', entryId: entry.id, bulletId: bullet.id, text: bullet.text });
        }
      });
    });

    return claims;
  }, [snapshot, baselineNumericTokens]);

  const qualityChecklist = useMemo(() => {
    const critical: string[] = [];
    const advisory: string[] = [];

    const hasName = snapshot.header.full_name.trim().length > 0;
    const hasEmailOrPhone = snapshot.header.email.trim().length > 0 || snapshot.header.phone.trim().length > 0;
    const hasSummary = snapshot.summary.trim().length > 0;
    const visibleExperience = snapshot.experience.filter((entry) => entry.visible);
    const visibleSkills = snapshot.skills.filter((entry) => entry.visible);
    const visibleProjects = snapshot.projects.filter((entry) => entry.visible);
    const visibleCerts = snapshot.certifications.filter((entry) => entry.visible);
    const visibleLanguages = snapshot.languages.filter((entry) => entry.visible);
    const hasEducation = snapshot.education.some((entry) => entry.visible);
    const isEntryLevel = visibleExperience.length === 0 && hasEducation;

    if (!hasName) critical.push('Missing full name in CV header.');
    if (!hasEmailOrPhone) critical.push('Add at least one contact method (email or phone).');
    if (!hasSummary) critical.push('Professional Summary is empty.');

    if (visibleExperience.length === 0) {
      if (isEntryLevel) advisory.push('No Work Experience entries (allowed for entry-level profile).');
      else critical.push('Work Experience is empty for a non-entry-level profile.');
    }

    if (suspiciousClaims.length > 0) {
      critical.push(`Potential fabricated claims detected (${suspiciousClaims.length}).`);
    }

    if (snapshot.experience.length > 6) advisory.push('Experience list is long; consider hiding older roles.');
    if (visibleSkills.length === 0) advisory.push('No visible skills; ATS matching may degrade.');
    if (!snapshot.header.linkedin_url && !snapshot.header.portfolio_url && !snapshot.header.github_url) {
      advisory.push('No professional links (LinkedIn/portfolio/GitHub).');
    }
    if (visibleProjects.length === 0) advisory.push('No visible Projects section entries.');
    if (visibleCerts.length === 0) advisory.push('No visible Certifications section entries.');
    if (visibleLanguages.length === 0) advisory.push('No visible Languages section entries.');

    return { critical, advisory };
  }, [snapshot, suspiciousClaims]);

  const updateHeader = (key: keyof ProfessionalAtsSnapshot['header'], value: string) => {
    setSnapshot((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [key]: value,
      },
    }));
  };

  const moveItem = <T,>(items: T[], index: number, direction: -1 | 1): T[] => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return items;
    const clone = [...items];
    const [target] = clone.splice(index, 1);
    clone.splice(nextIndex, 0, target);
    return clone;
  };

  const moveSection = (sectionId: CvSectionId, direction: -1 | 1) => {
    setSnapshot((prev) => {
      const index = prev.section_order.indexOf(sectionId);
      if (index === -1) return prev;
      const section_order = moveItem(prev.section_order, index, direction);
      return { ...prev, section_order };
    });
  };

  const toggleSection = (sectionId: CvSectionId) => {
    setHiddenSections((prev) => (prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]));
  };

  const moveEntry = <T extends { sort_order: number }>(
    section: keyof Pick<ProfessionalAtsSnapshot, 'skills' | 'experience' | 'projects' | 'education' | 'certifications' | 'languages'>,
    index: number,
    direction: -1 | 1,
  ) => {
    setSnapshot((prev) => {
      const entries = moveItem(prev[section] as T[], index, direction).map((entry, entryIndex) => ({
        ...entry,
        sort_order: entryIndex,
      }));
      return { ...prev, [section]: entries } as ProfessionalAtsSnapshot;
    });
  };

  const moveBullet = (
    section: 'experience' | 'projects',
    entryIndex: number,
    bulletIndex: number,
    direction: -1 | 1,
  ) => {
    setSnapshot((prev) => {
      const entries = [...prev[section]];
      const entry = { ...entries[entryIndex] };
      const bullets = moveItem(entry.bullets, bulletIndex, direction).map((bullet, index) => ({
        ...bullet,
        sort_order: index,
      }));
      entry.bullets = bullets;
      entries[entryIndex] = entry;
      return { ...prev, [section]: entries } as ProfessionalAtsSnapshot;
    });
  };

  const updateSkill = (index: number, patch: Partial<CvSkillEntry>) => {
    setSnapshot((prev) => {
      const skills = [...prev.skills];
      skills[index] = { ...skills[index], ...patch };
      return { ...prev, skills };
    });
  };

  const updateExperience = (index: number, patch: Partial<CvExperienceEntry>) => {
    setSnapshot((prev) => {
      const experience = [...prev.experience];
      experience[index] = { ...experience[index], ...patch };
      return { ...prev, experience };
    });
  };

  const updateExperienceBullet = (entryIndex: number, bulletIndex: number, patch: Partial<CvBullet>) => {
    setSnapshot((prev) => {
      const experience = [...prev.experience];
      const entry = { ...experience[entryIndex] };
      const bullets = [...entry.bullets];
      bullets[bulletIndex] = { ...bullets[bulletIndex], ...patch };
      entry.bullets = bullets;
      experience[entryIndex] = entry;
      return { ...prev, experience };
    });
  };

  const updateProject = (index: number, patch: Partial<CvProjectEntry>) => {
    setSnapshot((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], ...patch };
      return { ...prev, projects };
    });
  };

  const updateProjectBullet = (entryIndex: number, bulletIndex: number, patch: Partial<CvBullet>) => {
    setSnapshot((prev) => {
      const projects = [...prev.projects];
      const entry = { ...projects[entryIndex] };
      const bullets = [...entry.bullets];
      bullets[bulletIndex] = { ...bullets[bulletIndex], ...patch };
      entry.bullets = bullets;
      projects[entryIndex] = entry;
      return { ...prev, projects };
    });
  };

  const updateEducation = (index: number, patch: Partial<CvEducationEntry>) => {
    setSnapshot((prev) => {
      const education = [...prev.education];
      education[index] = { ...education[index], ...patch };
      return { ...prev, education };
    });
  };

  const updateCertification = (index: number, patch: Partial<CvCertificationEntry>) => {
    setSnapshot((prev) => {
      const certifications = [...prev.certifications];
      certifications[index] = { ...certifications[index], ...patch };
      return { ...prev, certifications };
    });
  };

  const updateLanguage = (index: number, patch: Partial<CvLanguageEntry>) => {
    setSnapshot((prev) => {
      const languages = [...prev.languages];
      languages[index] = { ...languages[index], ...patch };
      return { ...prev, languages };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/cv-versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: versionId,
          applicationId,
          snapshot,
          hiddenSections,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save CV');
      }

      setVersionId(result.version?.id || versionId);
      setLastSavedSnapshot(cloneSnapshot(snapshot));
      setLastSavedHiddenSections([...hiddenSections]);
      setSaveMessage('Saved CV version snapshot.');
    } catch (error: any) {
      setSaveMessage(error?.message || 'Failed to save CV version.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (qualityChecklist.critical.length > 0 || qualityChecklist.advisory.length > 0 || hasUnsavedChanges) {
      setShowDownloadChecklist(true);
      return;
    }

    await performDownload();
  };

  const performDownload = async () => {
    if (hasUnsavedChanges) {
      const shouldContinue = window.confirm('You have unsaved changes. Download current editor state anyway?');
      if (!shouldContinue) return;
    }

    setIsDownloading(true);

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(
        <ProfessionalAtsTemplate snapshot={snapshot} hiddenSections={hiddenSections} />,
      ).toBlob();

      const slug = contextLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'cv';
      const fileName = `professional-ats-${slug}.pdf`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const toLines = (value: string): string[] => value
    .split('\n')
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);

  const scoreText = (value: string, terms: string[]): number => {
    const haystack = value.toLowerCase();
    return terms.reduce((score, term) => {
      const token = term.toLowerCase().trim();
      if (!token) return score;
      return haystack.includes(token) ? score + 1 : score;
    }, 0);
  };

  const handleTailorWithAI = async () => {
    if (!applicationId) return;

    setIsTailoring(true);
    setSaveMessage(null);

    try {
      const response = await fetch('/api/generate/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId }),
      });

      const result = await response.json();
      if (!result.success || !result.tailoredData) {
        throw new Error(result.error || 'Failed to tailor CV content');
      }

      const tailoredSkills: string[] = Array.isArray(result.tailoredData.skills)
        ? result.tailoredData.skills.map((value: string) => value.trim()).filter(Boolean)
        : [];
      const requiredSkills: string[] = Array.isArray(result.application?.job_data?.requiredSkills)
        ? result.application.job_data.requiredSkills
        : [];
      const relevanceTerms = [...tailoredSkills, ...requiredSkills].filter(Boolean);

      setSnapshot((prev) => {
        const tailoredById = new Map<string, any>(
          (Array.isArray(result.tailoredData.experiences) ? result.tailoredData.experiences : [])
            .map((item: any) => [String(item.id), item]),
        );

        const nextExperience = prev.experience.map((entry, index) => {
          const tailored = tailoredById.get(entry.id);
          if (!tailored) return entry;

          const nextBullets = toLines(String(tailored.description || ''))
            .slice(0, 5)
            .map((line, bulletIndex) => ({
              id: `${entry.id}-tailored-${bulletIndex + 1}`,
              text: line,
              visible: true,
              sort_order: bulletIndex,
            }));

          return {
            ...entry,
            title: String(tailored.title || entry.title),
            company: String(tailored.company || entry.company),
            bullets: nextBullets.length > 0 ? nextBullets : entry.bullets,
            sort_order: index,
          };
        });

        const skillPriority = new Map<string, number>(
          tailoredSkills.map((skill, index) => [skill.toLowerCase(), index]),
        );

        const nextSkills = [...prev.skills]
          .sort((left, right) => {
            const leftPriority = skillPriority.get(left.name.toLowerCase()) ?? Number.POSITIVE_INFINITY;
            const rightPriority = skillPriority.get(right.name.toLowerCase()) ?? Number.POSITIVE_INFINITY;

            if (leftPriority !== rightPriority) return leftPriority - rightPriority;
            return left.sort_order - right.sort_order;
          })
          .map((entry, index) => ({ ...entry, sort_order: index }));

        const nextProjects = [...prev.projects]
          .sort((left, right) => {
            const leftText = `${left.name} ${left.description} ${left.tech_stack.join(' ')} ${left.bullets.map((b) => b.text).join(' ')}`;
            const rightText = `${right.name} ${right.description} ${right.tech_stack.join(' ')} ${right.bullets.map((b) => b.text).join(' ')}`;
            return scoreText(rightText, relevanceTerms) - scoreText(leftText, relevanceTerms);
          })
          .map((entry, index) => ({ ...entry, sort_order: index }));

        const nextCertifications = [...prev.certifications]
          .sort((left, right) => {
            const leftText = `${left.name} ${left.issuer}`;
            const rightText = `${right.name} ${right.issuer}`;
            return scoreText(rightText, relevanceTerms) - scoreText(leftText, relevanceTerms);
          })
          .map((entry, index) => ({ ...entry, sort_order: index }));

        const nextLanguages = [...prev.languages]
          .sort((left, right) => {
            const leftScore = scoreText(`${left.name} ${left.proficiency}`, relevanceTerms);
            const rightScore = scoreText(`${right.name} ${right.proficiency}`, relevanceTerms);
            return rightScore - leftScore;
          })
          .map((entry, index) => ({ ...entry, sort_order: index }));

        return {
          ...prev,
          summary: String(result.tailoredData.summary || prev.summary),
          header: {
            ...prev.header,
            headline: prev.header.headline || String(result.application?.job_data?.title || ''),
          },
          experience: nextExperience,
          skills: nextSkills,
          projects: nextProjects,
          certifications: nextCertifications,
          languages: nextLanguages,
        };
      });

      setSaveMessage('Applied AI tailoring to summary, experience, and relevance ordering.');
    } catch (error: any) {
      setSaveMessage(error?.message || 'Failed to tailor CV content.');
    } finally {
      setIsTailoring(false);
    }
  };

  const sanitizeClaimText = (value: string): string => {
    return value
      .replace(/\b\d+(?:\.\d+)?%\b/g, 'significantly')
      .replace(/\b\d+(?:\.\d+)?\b/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s,/, ',')
      .trim();
  };

  const handleRewriteSafely = () => {
    setSnapshot((prev) => {
      const next = cloneSnapshot(prev);

      if (suspiciousClaims.some((claim) => claim.section === 'summary')) {
        next.summary = sanitizeClaimText(next.summary);
      }

      next.experience = next.experience.map((entry) => ({
        ...entry,
        bullets: entry.bullets.map((bullet) => {
          const isFlagged = suspiciousClaims.some(
            (claim) => claim.section === 'experience' && claim.entryId === entry.id && claim.bulletId === bullet.id,
          );

          return isFlagged
            ? { ...bullet, text: sanitizeClaimText(bullet.text) }
            : bullet;
        }),
      }));

      next.projects = next.projects.map((entry) => ({
        ...entry,
        bullets: entry.bullets.map((bullet) => {
          const isFlagged = suspiciousClaims.some(
            (claim) => claim.section === 'projects' && claim.entryId === entry.id && claim.bulletId === bullet.id,
          );

          return isFlagged
            ? { ...bullet, text: sanitizeClaimText(bullet.text) }
            : bullet;
        }),
      }));

      return next;
    });

    setSaveMessage('Rewrote flagged lines in safer non-numeric language.');
  };

  return (
    <div className="cv-review-desk">
      <aside className="cv-review-controls">
        <SectionPanel title="Sections">
          {snapshot.section_order.map((sectionId, index) => {
            const isHidden = hiddenSections.includes(sectionId);

            return (
              <div key={sectionId} className="cv-entry-row">
                <span className="cv-entry-label">{sectionId}</span>
                <div className="cv-entry-actions">
                  <button type="button" onClick={() => moveSection(sectionId, -1)} disabled={index === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                  <button type="button" onClick={() => moveSection(sectionId, 1)} disabled={index === snapshot.section_order.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                  <button type="button" onClick={() => toggleSection(sectionId)} className={`cv-mini-btn ${isHidden ? 'is-hidden' : ''}`} title="Toggle section visibility"><EyeOff size={14} /></button>
                </div>
              </div>
            );
          })}
        </SectionPanel>

        <SectionPanel title="Header">
          <input value={snapshot.header.full_name} onChange={(e) => updateHeader('full_name', e.target.value)} placeholder="Full name" className="cv-field" />
          <input value={snapshot.header.headline} onChange={(e) => updateHeader('headline', e.target.value)} placeholder="Target role / headline" className="cv-field" />
          <input value={snapshot.header.location} onChange={(e) => updateHeader('location', e.target.value)} placeholder="Location" className="cv-field" />
          <input value={snapshot.header.email} onChange={(e) => updateHeader('email', e.target.value)} placeholder="Email" className="cv-field" />
          <input value={snapshot.header.phone} onChange={(e) => updateHeader('phone', e.target.value)} placeholder="Phone" className="cv-field" />
          <input value={snapshot.header.linkedin_url} onChange={(e) => updateHeader('linkedin_url', e.target.value)} placeholder="LinkedIn URL" className="cv-field" />
          <input value={snapshot.header.portfolio_url} onChange={(e) => updateHeader('portfolio_url', e.target.value)} placeholder="Portfolio URL" className="cv-field" />
          <input value={snapshot.header.github_url} onChange={(e) => updateHeader('github_url', e.target.value)} placeholder="GitHub URL" className="cv-field" />
        </SectionPanel>

        <SectionPanel title="Professional Summary">
          <textarea value={snapshot.summary} onChange={(e) => setSnapshot((prev) => ({ ...prev, summary: e.target.value }))} className="cv-field" rows={5} />
        </SectionPanel>

        <SectionPanel title="Skills">
          {snapshot.skills.map((skill, index) => (
            <div key={skill.id} className="cv-entry-row">
              <input
                value={skill.name}
                onChange={(e) => updateSkill(index, { name: e.target.value })}
                className="cv-field"
              />
              <div className="cv-entry-actions">
                <button type="button" onClick={() => moveEntry('skills', index, -1)} disabled={index === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => moveEntry('skills', index, 1)} disabled={index === snapshot.skills.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => updateSkill(index, { visible: !skill.visible })} className={`cv-mini-btn ${!skill.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
              </div>
            </div>
          ))}
        </SectionPanel>

        <SectionPanel title="Work Experience">
          {snapshot.experience.map((entry, entryIndex) => (
            <div key={entry.id} style={{ marginBottom: 12 }}>
              <div className="cv-entry-actions" style={{ margin: '0 1rem 0.5rem' }}>
                <button type="button" onClick={() => moveEntry('experience', entryIndex, -1)} disabled={entryIndex === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => moveEntry('experience', entryIndex, 1)} disabled={entryIndex === snapshot.experience.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => updateExperience(entryIndex, { visible: !entry.visible })} className={`cv-mini-btn ${!entry.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
              </div>
              <input value={entry.title} onChange={(e) => updateExperience(entryIndex, { title: e.target.value })} className="cv-field" placeholder="Title" />
              <input value={entry.company} onChange={(e) => updateExperience(entryIndex, { company: e.target.value })} className="cv-field" placeholder="Company" />
              {entry.bullets.map((bullet, bulletIndex) => (
                <div key={bullet.id} className="cv-entry-row">
                  <textarea
                    value={bullet.text}
                    onChange={(e) => updateExperienceBullet(entryIndex, bulletIndex, { text: e.target.value })}
                    className="cv-field"
                    rows={2}
                  />
                  <div className="cv-entry-actions">
                    <button type="button" onClick={() => moveBullet('experience', entryIndex, bulletIndex, -1)} disabled={bulletIndex === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                    <button type="button" onClick={() => moveBullet('experience', entryIndex, bulletIndex, 1)} disabled={bulletIndex === entry.bullets.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                    <button type="button" onClick={() => updateExperienceBullet(entryIndex, bulletIndex, { visible: !bullet.visible })} className={`cv-mini-btn ${!bullet.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </SectionPanel>

        <SectionPanel title="Projects">
          {snapshot.projects.map((entry, entryIndex) => (
            <div key={entry.id} style={{ marginBottom: 12 }}>
              <div className="cv-entry-actions" style={{ margin: '0 1rem 0.5rem' }}>
                <button type="button" onClick={() => moveEntry('projects', entryIndex, -1)} disabled={entryIndex === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => moveEntry('projects', entryIndex, 1)} disabled={entryIndex === snapshot.projects.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => updateProject(entryIndex, { visible: !entry.visible })} className={`cv-mini-btn ${!entry.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
              </div>
              <input value={entry.name} onChange={(e) => updateProject(entryIndex, { name: e.target.value })} className="cv-field" placeholder="Project name" />
              <input value={entry.url || ''} onChange={(e) => updateProject(entryIndex, { url: e.target.value })} className="cv-field" placeholder="Project URL" />
              {entry.bullets.map((bullet, bulletIndex) => (
                <div key={bullet.id} className="cv-entry-row">
                  <textarea
                    value={bullet.text}
                    onChange={(e) => updateProjectBullet(entryIndex, bulletIndex, { text: e.target.value })}
                    className="cv-field"
                    rows={2}
                  />
                  <div className="cv-entry-actions">
                    <button type="button" onClick={() => moveBullet('projects', entryIndex, bulletIndex, -1)} disabled={bulletIndex === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                    <button type="button" onClick={() => moveBullet('projects', entryIndex, bulletIndex, 1)} disabled={bulletIndex === entry.bullets.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                    <button type="button" onClick={() => updateProjectBullet(entryIndex, bulletIndex, { visible: !bullet.visible })} className={`cv-mini-btn ${!bullet.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </SectionPanel>

        <SectionPanel title="Education">
          {snapshot.education.map((entry, index) => (
            <div key={entry.id} style={{ marginBottom: 12 }}>
              <div className="cv-entry-actions" style={{ margin: '0 1rem 0.5rem' }}>
                <button type="button" onClick={() => moveEntry('education', index, -1)} disabled={index === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => moveEntry('education', index, 1)} disabled={index === snapshot.education.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => updateEducation(index, { visible: !entry.visible })} className={`cv-mini-btn ${!entry.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
              </div>
              <input value={entry.degree} onChange={(e) => updateEducation(index, { degree: e.target.value })} className="cv-field" placeholder="Degree" />
              <input value={entry.field} onChange={(e) => updateEducation(index, { field: e.target.value })} className="cv-field" placeholder="Field" />
              <input value={entry.institution} onChange={(e) => updateEducation(index, { institution: e.target.value })} className="cv-field" placeholder="Institution" />
            </div>
          ))}
        </SectionPanel>

        <SectionPanel title="Certifications">
          {snapshot.certifications.map((entry, index) => (
            <div key={entry.id} style={{ marginBottom: 12 }}>
              <div className="cv-entry-actions" style={{ margin: '0 1rem 0.5rem' }}>
                <button type="button" onClick={() => moveEntry('certifications', index, -1)} disabled={index === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => moveEntry('certifications', index, 1)} disabled={index === snapshot.certifications.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => updateCertification(index, { visible: !entry.visible })} className={`cv-mini-btn ${!entry.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
              </div>
              <input value={entry.name} onChange={(e) => updateCertification(index, { name: e.target.value })} className="cv-field" placeholder="Certification" />
              <input value={entry.issuer} onChange={(e) => updateCertification(index, { issuer: e.target.value })} className="cv-field" placeholder="Issuer" />
            </div>
          ))}
        </SectionPanel>

        <SectionPanel title="Languages">
          {snapshot.languages.map((entry, index) => (
            <div key={entry.id} style={{ marginBottom: 12 }}>
              <div className="cv-entry-actions" style={{ margin: '0 1rem 0.5rem' }}>
                <button type="button" onClick={() => moveEntry('languages', index, -1)} disabled={index === 0} className="cv-mini-btn"><ArrowUp size={14} /></button>
                <button type="button" onClick={() => moveEntry('languages', index, 1)} disabled={index === snapshot.languages.length - 1} className="cv-mini-btn"><ArrowDown size={14} /></button>
                <button type="button" onClick={() => updateLanguage(index, { visible: !entry.visible })} className={`cv-mini-btn ${!entry.visible ? 'is-hidden' : ''}`}><EyeOff size={14} /></button>
              </div>
              <input value={entry.name} onChange={(e) => updateLanguage(index, { name: e.target.value })} className="cv-field" placeholder="Language" />
              <input value={entry.proficiency} onChange={(e) => updateLanguage(index, { proficiency: e.target.value })} className="cv-field" placeholder="Proficiency" />
            </div>
          ))}
        </SectionPanel>

        <div className="cv-success-note">
          <span>Editing {visibleSectionCount} populated sections in Professional ATS mode.</span>
        </div>
        <div className="cv-success-note">
          <span>AI rewriting uses your profile facts only. Do not include fabricated metrics or claims.</span>
        </div>

        <button type="button" className="cv-secondary-action" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save
        </button>
        {applicationId && (
          <button type="button" className="cv-secondary-action" onClick={handleTailorWithAI} disabled={isTailoring}>
            {isTailoring ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            Tailor with AI
          </button>
        )}
        <button type="button" className="cv-download-action" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          Download PDF
        </button>
        {saveMessage && (
          <p className="cv-save-message">{saveMessage}</p>
        )}
        {hasUnsavedChanges && (
          <p className="cv-save-message">You have unsaved changes.</p>
        )}
        {suspiciousClaims.length > 0 && (
          <div className="cv-warning-note">
            <strong>Potential fabricated claims detected ({suspiciousClaims.length}).</strong>
            <p>These lines include numeric impact claims not present in your baseline profile data.</p>
            <button type="button" className="cv-secondary-action" onClick={handleRewriteSafely}>
              Rewrite safely
            </button>
          </div>
        )}
      </aside>
      <ProfessionalAtsPreview snapshot={snapshot} templateLabel="professional-ats" contextLabel={contextLabel} hiddenSections={hiddenSections} />

      {showDownloadChecklist && (
        <div className="cv-checklist-modal" role="dialog" aria-modal="true" aria-label="ATS quality checklist">
          <div className="cv-checklist-modal__backdrop" onClick={() => setShowDownloadChecklist(false)} />
          <div className="cv-checklist-modal__content">
            <h4>Pre-download ATS quality checklist</h4>
            {hasUnsavedChanges && <p className="cv-checklist-warning">You have unsaved changes.</p>}

            <div className="cv-checklist-group">
              <strong>Critical</strong>
              {qualityChecklist.critical.length === 0 ? (
                <p>None.</p>
              ) : (
                <ul>
                  {qualityChecklist.critical.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>

            <div className="cv-checklist-group">
              <strong>Advisory</strong>
              {qualityChecklist.advisory.length === 0 ? (
                <p>None.</p>
              ) : (
                <ul>
                  {qualityChecklist.advisory.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </div>

            <div className="cv-checklist-actions">
              <button type="button" className="cv-secondary-action" onClick={() => setShowDownloadChecklist(false)}>
                Fix now
              </button>
              <button
                type="button"
                className="cv-download-action"
                onClick={async () => {
                  setShowDownloadChecklist(false);
                  await performDownload();
                }}
              >
                Download anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
