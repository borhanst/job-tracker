import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 34,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  mast: {
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#0f172a',
    color: '#ffffff',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headline: {
    fontSize: 10,
    color: '#cbd5e1',
    marginBottom: 10,
  },
  contact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 8,
    color: '#e2e8f0',
  },
  layout: {
    flexDirection: 'row',
    gap: 18,
  },
  sidebar: {
    width: '30%',
    paddingRight: 10,
    borderRight: 1,
    borderRightColor: '#e5e7eb',
  },
  main: {
    width: '70%',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f766e',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 7,
  },
  body: {
    lineHeight: 1.45,
    color: '#374151',
  },
  skill: {
    padding: '4 0',
    borderBottom: 1,
    borderBottomColor: '#f1f5f9',
    color: '#1f2937',
    fontSize: 8.5,
  },
  item: {
    marginBottom: 11,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#111827',
  },
  date: {
    fontSize: 8,
    color: '#64748b',
  },
  title: {
    color: '#0f766e',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bullet: {
    marginBottom: 2,
    lineHeight: 1.38,
    color: '#374151',
  },
});

export const ExecutiveTemplate = ({ data }: any) => {
  const { profile, tailoredData } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.mast}>
          <Text style={styles.name}>{profile.full_name}</Text>
          <Text style={styles.headline}>{tailoredData.summary?.slice(0, 150)}</Text>
          <View style={styles.contact}>
            {profile.email && <Text>{profile.email}</Text>}
            {profile.phone && <Text>{profile.phone}</Text>}
            {profile.location && <Text>{profile.location}</Text>}
            {profile.linkedin_url && <Text>{profile.linkedin_url}</Text>}
          </View>
        </View>

        <View style={styles.layout}>
          <View style={styles.sidebar}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Core Skills</Text>
              {tailoredData.skills?.map((skill: string, i: number) => (
                <Text key={i} style={styles.skill}>{skill}</Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {profile.education?.map((edu: any, i: number) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>{edu.degree}</Text>
                  <Text style={styles.body}>{edu.institution}</Text>
                  <Text style={styles.date}>{edu.start_date} - {edu.end_date || 'Present'}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.main}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Executive Summary</Text>
              <Text style={styles.body}>{tailoredData.summary}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Selected Experience</Text>
              {tailoredData.experiences?.map((exp: any, i: number) => {
                const rawExp = profile.workExperience?.find((w: any) => w.id === exp.id);
                return (
                  <View key={i} style={styles.item}>
                    <View style={styles.itemTop}>
                      <Text style={styles.company}>{exp.company}</Text>
                      <Text style={styles.date}>{rawExp ? `${rawExp.start_date} - ${rawExp.is_current ? 'Present' : rawExp.end_date}` : ''}</Text>
                    </View>
                    <Text style={styles.title}>{exp.title}</Text>
                    {exp.description?.split('\n').map((line: string, j: number) => (
                      <Text key={j} style={styles.bullet}>- {line.replace(/^[-•]\s*/, '')}</Text>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
