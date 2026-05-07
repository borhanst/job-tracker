'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Edit3, EyeOff, Loader2, Save } from 'lucide-react';
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

interface ProfessionalAtsBuilderProps {
  initialSnapshot: ProfessionalAtsSnapshot;
  contextLabel: string;
  applicationId?: string | null;
  initialVersionId?: string | null;
  initialHiddenSections?: CvSectionId[];
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
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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
      setSaveMessage('Saved CV version snapshot.');
    } catch (error: any) {
      setSaveMessage(error?.message || 'Failed to save CV version.');
    } finally {
      setIsSaving(false);
    }
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

        <button type="button" className="cv-secondary-action" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save
        </button>
        {saveMessage && (
          <p className="cv-save-message">{saveMessage}</p>
        )}
      </aside>
      <ProfessionalAtsPreview snapshot={snapshot} templateLabel="professional-ats" contextLabel={contextLabel} hiddenSections={hiddenSections} />
    </div>
  );
}
