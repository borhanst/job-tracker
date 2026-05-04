import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: '#000',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  contact: {
    fontSize: 9,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: 1,
    borderBottomColor: '#000',
    marginTop: 15,
    marginBottom: 8,
    paddingBottom: 2,
  },
  expItem: {
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontWeight: 'bold',
  },
  bullet: {
    marginLeft: 15,
    marginTop: 2,
    lineHeight: 1.3,
  },
});

export const ClassicTemplate = ({ data }: any) => {
  const { profile, tailoredData } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name}</Text>
          <Text style={styles.contact}>
            {profile.location} | {profile.phone} | {profile.email}
          </Text>
          <Text style={styles.contact}>
            {profile.linkedin_url} | {profile.portfolio_url}
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={{ lineHeight: 1.4 }}>{tailoredData.summary}</Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
          {tailoredData.experiences.map((exp: any, i: number) => {
            const rawExp = profile.workExperience.find((w: any) => w.id === exp.id);
            return (
              <View key={i} style={styles.expItem}>
                <View style={styles.row}>
                  <Text style={{ fontWeight: 'bold' }}>{exp.company}</Text>
                  <Text>{rawExp ? `${rawExp.start_date} - ${rawExp.is_current ? 'Present' : rawExp.end_date}` : ''}</Text>
                </View>
                <Text style={{ fontStyle: 'italic', marginBottom: 2 }}>{exp.title}</Text>
                {exp.description.split('\n').map((b: string, j: number) => (
                  <Text key={j} style={styles.bullet}>• {b.replace(/^•\s*/, '')}</Text>
                ))}
              </View>
            );
          })}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {profile.education?.map((edu: any, i: number) => (
            <View key={i} style={{ marginBottom: 5 }}>
              <View style={styles.row}>
                <Text style={{ fontWeight: 'bold' }}>{edu.institution}</Text>
                <Text>{edu.start_date} - {edu.end_date || 'Present'}</Text>
              </View>
              <Text>{edu.degree} in {edu.field} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}</Text>
            </View>
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          <Text>{tailoredData.skills.join(', ')}</Text>
        </View>
      </Page>
    </Document>
  );
};
