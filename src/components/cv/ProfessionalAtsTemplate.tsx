import React from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { CvSectionId, ProfessionalAtsSnapshot } from '@/lib/cv/professionalAts';

const styles = StyleSheet.create({
  page: {
    paddingTop: 38,
    paddingRight: 40,
    paddingBottom: 40,
    paddingLeft: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#111111',
  },
  headline: {
    fontSize: 10,
    marginBottom: 6,
  },
  contact: {
    fontSize: 9,
    color: '#1f2937',
    lineHeight: 1.35,
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
    paddingBottom: 2,
    borderBottom: 1,
    borderBottomColor: '#374151',
    letterSpacing: 0.8,
  },
  paragraph: {
    lineHeight: 1.45,
    color: '#1f2937',
  },
  entry: {
    marginBottom: 8,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryTitle: {
    fontWeight: 'bold',
    color: '#111111',
  },
  entryMeta: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 3,
  },
  date: {
    fontSize: 9,
    color: '#4b5563',
  },
  bullet: {
    marginLeft: 9,
    marginBottom: 2,
    lineHeight: 1.35,
  },
  inlineList: {
    lineHeight: 1.45,
    color: '#1f2937',
  },
});

const shortUrl = (value: string): string => value.replace(/^https?:\/\//, '').replace(/\/$/, '');

const formatMonthYear = (value: string | null): string => {
  if (!value) return '';

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsed);
};

const formatRange = (start: string | null, end: string | null, isCurrent: boolean): string => {
  const startLabel = formatMonthYear(start);
  const endLabel = isCurrent ? 'Present' : formatMonthYear(end);

  if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
  return startLabel || endLabel;
};

const hasText = (value: string): boolean => value.trim().length > 0;

interface ProfessionalAtsTemplateProps {
  snapshot: ProfessionalAtsSnapshot;
  hiddenSections?: CvSectionId[];
}

export function ProfessionalAtsTemplate({ snapshot, hiddenSections = [] }: ProfessionalAtsTemplateProps) {
  const hiddenSet = new Set(hiddenSections);
  const contactParts = [
    snapshot.header.location,
    snapshot.header.email,
    snapshot.header.phone,
    snapshot.header.linkedin_url ? shortUrl(snapshot.header.linkedin_url) : '',
    snapshot.header.portfolio_url ? shortUrl(snapshot.header.portfolio_url) : '',
    snapshot.header.github_url ? shortUrl(snapshot.header.github_url) : '',
  ].filter(hasText);

  const visibleSkills = [...snapshot.skills]
    .filter((entry) => entry.visible)
    .sort((a, b) => a.sort_order - b.sort_order);
  const visibleExperience = [...snapshot.experience]
    .filter((entry) => entry.visible)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((entry) => ({
      ...entry,
      bullets: [...entry.bullets]
        .filter((bullet) => bullet.visible)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));
  const visibleProjects = [...snapshot.projects]
    .filter((entry) => entry.visible)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((entry) => ({
      ...entry,
      bullets: [...entry.bullets]
        .filter((bullet) => bullet.visible)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));
  const visibleEducation = [...snapshot.education]
    .filter((entry) => entry.visible)
    .sort((a, b) => a.sort_order - b.sort_order);
  const visibleCertifications = [...snapshot.certifications]
    .filter((entry) => entry.visible)
    .sort((a, b) => a.sort_order - b.sort_order);
  const visibleLanguages = [...snapshot.languages]
    .filter((entry) => entry.visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  const sectionOrder = snapshot.section_order;

  const renderSection = (sectionId: CvSectionId) => {
    if (hiddenSet.has(sectionId)) return null;

    if (sectionId === 'summary' && hasText(snapshot.summary)) {
      return (
        <View style={styles.section} key="summary">
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.paragraph}>{snapshot.summary}</Text>
        </View>
      );
    }

    if (sectionId === 'skills' && visibleSkills.length > 0) {
      return (
        <View style={styles.section} key="skills">
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text style={styles.inlineList}>{visibleSkills.map((skill) => skill.name).join(', ')}</Text>
        </View>
      );
    }

    if (sectionId === 'experience' && visibleExperience.length > 0) {
      return (
        <View style={styles.section} key="experience">
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {visibleExperience.map((entry) => (
            <View key={entry.id} style={styles.entry}>
              <View style={styles.entryTop}>
                <Text style={styles.entryTitle}>{entry.title || 'Role'}</Text>
                <Text style={styles.date}>{formatRange(entry.start_date, entry.end_date, entry.is_current)}</Text>
              </View>
              <Text style={styles.entryMeta}>{entry.company}</Text>
              {entry.bullets.slice(0, 5).map((bullet) => (
                <Text key={bullet.id} style={styles.bullet}>- {bullet.text}</Text>
              ))}
            </View>
          ))}
        </View>
      );
    }

    if (sectionId === 'projects' && visibleProjects.length > 0) {
      return (
        <View style={styles.section} key="projects">
          <Text style={styles.sectionTitle}>Projects</Text>
          {visibleProjects.map((entry) => {
            const metaParts = [
              entry.tech_stack.length > 0 ? entry.tech_stack.join(', ') : '',
              entry.url ? shortUrl(entry.url) : '',
            ].filter(hasText);

            return (
              <View key={entry.id} style={styles.entry}>
                <Text style={styles.entryTitle}>{entry.name || 'Project'}</Text>
                {metaParts.length > 0 && <Text style={styles.entryMeta}>{metaParts.join(' | ')}</Text>}
                {(entry.bullets.length > 0 ? entry.bullets : [{ id: `${entry.id}-fallback`, text: entry.description, visible: true, sort_order: 0 }])
                  .filter((bullet) => hasText(bullet.text))
                  .slice(0, 3)
                  .map((bullet) => (
                    <Text key={bullet.id} style={styles.bullet}>- {bullet.text}</Text>
                  ))}
              </View>
            );
          })}
        </View>
      );
    }

    if (sectionId === 'education' && visibleEducation.length > 0) {
      return (
        <View style={styles.section} key="education">
          <Text style={styles.sectionTitle}>Education</Text>
          {visibleEducation.map((entry) => (
            <View key={entry.id} style={styles.entry}>
              <View style={styles.entryTop}>
                <Text style={styles.entryTitle}>{[entry.degree, entry.field].filter(hasText).join(' in ') || entry.degree || entry.field}</Text>
                <Text style={styles.date}>{formatRange(entry.start_date, entry.end_date, false)}</Text>
              </View>
              <Text style={styles.entryMeta}>{entry.institution}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (sectionId === 'certifications' && visibleCertifications.length > 0) {
      return (
        <View style={styles.section} key="certifications">
          <Text style={styles.sectionTitle}>Certifications</Text>
          {visibleCertifications.map((entry) => {
            const parts = [
              entry.name,
              entry.issuer,
              formatMonthYear(entry.issued_date),
              entry.url ? shortUrl(entry.url) : '',
            ].filter(hasText);

            return (
              <Text key={entry.id} style={styles.paragraph}>{parts.join(' | ')}</Text>
            );
          })}
        </View>
      );
    }

    if (sectionId === 'languages' && visibleLanguages.length > 0) {
      return (
        <View style={styles.section} key="languages">
          <Text style={styles.sectionTitle}>Languages</Text>
          <Text style={styles.inlineList}>
            {visibleLanguages.map((entry) => `${entry.name}${hasText(entry.proficiency) ? ` - ${entry.proficiency}` : ''}`).join(' | ')}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{snapshot.header.full_name || 'Candidate Name'}</Text>
          {hasText(snapshot.header.headline) && <Text style={styles.headline}>{snapshot.header.headline}</Text>}
          {contactParts.length > 0 && <Text style={styles.contact}>{contactParts.join(' | ')}</Text>}
        </View>

        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </Page>
    </Document>
  );
}
