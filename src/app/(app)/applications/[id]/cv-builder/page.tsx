import { notFound } from 'next/navigation';
import { FileText } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';
import ProfessionalAtsBuilder from '@/components/cv/ProfessionalAtsBuilder';
import { getApplicationById } from '@/lib/jobs/actions';
import { getFullProfile } from '@/lib/profile/actions';
import { buildProfessionalAtsSnapshotForApplication } from '@/lib/cv/professionalAts';
import { getLatestCvVersion } from '@/lib/cv/actions';

export default async function ApplicationCvBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [application, profile] = await Promise.all([
    getApplicationById(id),
    getFullProfile(),
  ]);

  if (!application) {
    notFound();
  }

  if (!profile) {
    return (
      <ProtectedPage>
        <ProtectedPageHeader
          eyebrow="CV studio"
          title="Professional ATS"
          description="We could not load your profile data yet. Refresh the page or complete profile setup first."
          icon={FileText}
        />
      </ProtectedPage>
    );
  }

  const snapshot = buildProfessionalAtsSnapshotForApplication(profile, application);
  const latestVersion = await getLatestCvVersion(application.id);
  const initialSnapshot = latestVersion?.content ?? snapshot;
  const initialHiddenSections = Array.isArray(latestVersion?.section_visibility?.hidden_sections)
    ? latestVersion.section_visibility.hidden_sections
    : [];
  const jobTitle = application.job_data?.title || 'Target role';
  const company = application.job_data?.company || 'Target company';

  return (
    <ProtectedPage maxWidth="wide">
      <ProtectedPageHeader
        eyebrow="CV studio"
        title="Professional ATS"
        description={`Edit a tailored CV draft for ${jobTitle} at ${company}.`}
        icon={FileText}
      />
      <ProfessionalAtsBuilder
        initialSnapshot={initialSnapshot}
        contextLabel={`${jobTitle} at ${company}`}
        applicationId={application.id}
        initialVersionId={latestVersion?.id ?? null}
        initialHiddenSections={initialHiddenSections}
      />
    </ProtectedPage>
  );
}
