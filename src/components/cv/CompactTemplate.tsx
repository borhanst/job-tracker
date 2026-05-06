import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1f2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
    paddingBottom: 10,
    marginBottom: 12,
    borderBottom: 3,
    borderBottomColor: '#f97316',
  },
  nameBlock: {
    width: '58%',
  },
  name: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  summary: {
    lineHeight: 1.35,
    color: '#4b5563',
  },
  contact: {
    width: '42%',
    fontSize: 8,
    color: '#475569',
    textAlign: 'right',
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  main: {
    width: '66%',
  },
  side: {
    width: '34%',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#ea580c',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  exp: {
    marginBottom: 9,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontWeight: 'bold',
    color: '#111827',
  },
  date: {
    fontSize: 7.5,
    color: '#64748b',
  },
  title: {
    color: '#ea580c',
    marginBottom: 3,
  },
  bullet: {
    lineHeight: 1.32,
    marginBottom: 1.8,
  },
  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  skill: {
    padding: '3 5',
    color: '#111827',
    backgroundColor: '#fff7ed',
    borderRadius: 3,
    fontSize: 7.5,
  },
  edu: {
    marginBottom: 7,
    lineHeight: 1.35,
  },
});

export const CompactTemplate = ({ data }: any) => {
  const { profile, tailoredData } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{profile.full_name}</Text>
            <Text style={styles.summary}>{tailoredData.summary}</Text>
          </View>
          <View style={styles.contact}>
            {profile.email && <Text>{profile.email}</Text>}
            {profile.phone && <Text>{profile.phone}</Text>}
            {profile.location && <Text>{profile.location}</Text>}
            {profile.linkedin_url && <Text>{profile.linkedin_url}</Text>}
            {profile.portfolio_url && <Text>{profile.portfolio_url}</Text>}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.main}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {tailoredData.experiences?.map((exp: any, i: number) => {
                const rawExp = profile.workExperience?.find((w: any) => w.id === exp.id);
                return (
                  <View key={i} style={styles.exp}>
                    <View style={styles.expHeader}>
                      <Text style={styles.company}>{exp.company}</Text>
                      <Text style={styles.date}>{rawExp ? `${rawExp.start_date} - ${rawExp.is_current ? 'Present' : rawExp.end_date}` : ''}</Text>
                    </View>
                    <Text style={styles.title}>{exp.title}</Text>
                    {exp.description?.split('\n').slice(0, 4).map((line: string, j: number) => (
                      <Text key={j} style={styles.bullet}>• {line.replace(/^•\s*/, '')}</Text>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.side}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillWrap}>
                {tailoredData.skills?.map((skill: string, i: number) => (
                  <Text key={i} style={styles.skill}>{skill}</Text>
                ))}
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {profile.education?.map((edu: any, i: number) => (
                <Text key={i} style={styles.edu}>
                  {edu.degree} in {edu.field}{'\n'}{edu.institution}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
