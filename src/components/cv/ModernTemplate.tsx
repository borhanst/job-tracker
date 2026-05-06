import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Register a clean font (Helvetica is default, but we can style better)
const styles = StyleSheet.create({
  page: {
    padding: 34,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 18,
    padding: 16,
    backgroundColor: '#f0fdfa',
    borderLeft: 5,
    borderLeftColor: '#0f766e',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  contact: {
    flexDirection: 'row',
    gap: 10,
    color: '#64748b',
    fontSize: 9,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f766e',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#ccfbf1',
    paddingBottom: 2,
  },
  summary: {
    lineHeight: 1.5,
    marginBottom: 10,
  },
  experienceItem: {
    marginBottom: 12,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  title: {
    color: '#0f766e',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    color: '#64748b',
    fontSize: 9,
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 2,
    lineHeight: 1.4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillBadge: {
    padding: '4 7',
    backgroundColor: '#f0fdfa',
    color: '#0f766e',
    borderRadius: 10,
    fontSize: 8,
    fontWeight: 'bold',
  },
});

interface ModernTemplateProps {
  data: {
    profile: any;
    tailoredData: any;
    jobData: any;
  };
}

export const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const { profile, tailoredData } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name}</Text>
          <View style={styles.contact}>
            <Text>{profile.email}</Text>
            {profile.phone && <Text>• {profile.phone}</Text>}
            {profile.location && <Text>• {profile.location}</Text>}
          </View>
          <View style={[styles.contact, { marginTop: 4 }]}>
            {profile.linkedin_url && <Text>LinkedIn: {profile.linkedin_url}</Text>}
            {profile.portfolio_url && <Text>Portfolio: {profile.portfolio_url}</Text>}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{tailoredData.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {tailoredData.experiences.map((exp: any, index: number) => {
            const rawExp = profile.workExperience.find((w: any) => w.id === exp.id);
            return (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.date}>
                    {rawExp ? `${rawExp.start_date} - ${rawExp.is_current ? 'Present' : rawExp.end_date}` : ''}
                  </Text>
                </View>
                <Text style={styles.title}>{exp.title}</Text>
                {exp.description.split('\n').map((bullet: string, i: number) => (
                  <Text key={i} style={styles.bullet}>• {bullet.replace(/^•\s*/, '')}</Text>
                ))}
              </View>
            );
          })}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Skills</Text>
          <View style={styles.skillsGrid}>
            {tailoredData.skills.map((skill: string, i: number) => (
              <View key={i} style={styles.skillBadge}>
                <Text>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {profile.education?.map((edu: any, i: number) => (
            <View key={i} style={{ marginBottom: 5 }}>
              <View style={styles.expHeader}>
                <Text style={{ fontWeight: 'bold' }}>{edu.institution}</Text>
                <Text style={styles.date}>{edu.start_date} - {edu.end_date || 'Present'}</Text>
              </View>
              <Text>{edu.degree} in {edu.field}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
