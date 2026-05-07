import { FileText } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';
import { getFullProfile } from '@/lib/profile/actions';
import ProfessionalAtsBuilder from '@/components/cv/ProfessionalAtsBuilder';
import { buildProfessionalAtsSnapshot } from '@/lib/cv/professionalAts';

export default async function GeneralCvBuilderPage() {
  const profile = await getFullProfile();

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

  const snapshot = buildProfessionalAtsSnapshot(profile);

  return (
    <ProtectedPage maxWidth="wide">
      <ProtectedPageHeader
        eyebrow="CV studio"
        title="Professional ATS"
        description="Edit a professional ATS-friendly CV generated from your Master Profile."
        icon={FileText}
      />
      <ProfessionalAtsBuilder initialSnapshot={snapshot} contextLabel="General CV" />
    </ProtectedPage>
  );
}
