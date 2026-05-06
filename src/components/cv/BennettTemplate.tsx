import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingRight: 58,
    paddingBottom: 44,
    paddingLeft: 58,
    fontSize: 9.4,
    fontFamily: 'Helvetica',
    color: '#262626',
    backgroundColor: '#ffffff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headline: {
    fontSize: 13,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: 1,
    borderBottomColor: '#2f2f2f',
    paddingBottom: 7,
  },
  contactItem: {
    width: '32%',
    textAlign: 'center',
    fontSize: 8,
    color: '#3f3f3f',
  },
  section: {
    paddingTop: 12,
    paddingBottom: 11,
    borderBottom: 1,
    borderBottomColor: '#2f2f2f',
  },
  lastSection: {
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    color: '#111111',
  },
  paragraph: {
    lineHeight: 1.45,
    color: '#333333',
  },
  item: {
    marginBottom: 11,
  },
  itemMeta: {
    fontSize: 8.8,
    color: '#5b5b5b',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 9.6,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1e1e1e',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillCell: {
    width: '33.333%',
    marginBottom: 5,
    paddingRight: 10,
  },
  skillText: {
    fontSize: 9,
    color: '#1f1f1f',
  },
});

const cleanLines = (value?: string) => {
  if (!value) return [];

  return value
    .split('\n')
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean);
};

const formatDateRange = (item: any) => {
  if (!item) return '';
  const start = item.start_date || item.startDate || '';
  const end = item.is_current ? 'Present' : item.end_date || item.endDate || '';

  if (!start && !end) return '';
  return `${start}${start && end ? ' - ' : ''}${end}`;
};

export const BennettTemplate = ({ data }: any) => {
  const { profile, tailoredData, application, jobData } = data;
  const experiences = tailoredData?.experiences || [];
  const education = profile?.education || [];
  const skills = tailoredData?.skills || [];
  const roleTitle =
    jobData?.title ||
    application?.job_data?.title ||
    experiences[0]?.title ||
    profile?.headline ||
    'Professional';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile?.full_name || 'Candidate Name'}</Text>
          <Text style={styles.headline}>{roleTitle}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{profile?.phone || 'Phone available on request'}</Text>
            <Text style={styles.contactItem}>{profile?.email || 'Email available on request'}</Text>
            <Text style={styles.contactItem}>{profile?.location || 'Location available on request'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.paragraph}>{tailoredData?.summary || profile?.summary || ''}</Text>
        </View>

        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.itemMeta}>
                  {edu.institution}
                  {formatDateRange(edu) ? ` | ${formatDateRange(edu)}` : ''}
                </Text>
                <Text style={styles.itemTitle}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                </Text>
                {edu.description && <Text style={styles.paragraph}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {experiences.map((exp: any, index: number) => {
              const rawExp = profile?.workExperience?.find((item: any) => item.id === exp.id);
              const dateRange = formatDateRange(rawExp);
              const lines = cleanLines(exp.description);

              return (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemMeta}>
                    {exp.company}
                    {dateRange ? ` | ${dateRange}` : ''}
                  </Text>
                  <Text style={styles.itemTitle}>{exp.title}</Text>
                  <Text style={styles.paragraph}>{lines.join(' ')}</Text>
                </View>
              );
            })}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.lastSection}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsGrid}>
              {skills.map((skill: string, index: number) => (
                <View key={index} style={styles.skillCell}>
                  <Text style={styles.skillText}>- {skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};
