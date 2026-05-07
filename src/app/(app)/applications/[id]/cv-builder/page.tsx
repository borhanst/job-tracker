import { notFound } from 'next/navigation';
import { FileText } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';
import ProfessionalAtsPreview from '@/components/cv/ProfessionalAtsPreview';
import { getApplicationById } from '@/lib/jobs/actions';
import { getFullProfile } from '@/lib/profile/actions';
import { buildProfessionalAtsSnapshotForApplication } from '@/lib/cv/professionalAts';

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
  const jobTitle = application.job_data?.title || 'Target role';
  const company = application.job_data?.company || 'Target company';

  return (
    <ProtectedPage maxWidth="wide">
      <ProtectedPageHeader
        eyebrow="CV studio"
        title="Professional ATS"
        description={`Preview a tailored CV draft for ${jobTitle} at ${company}.`}
        icon={FileText}
      />
      <div className="cv-review-desk">
        <aside className="cv-review-controls">
          <div className="cv-control-panel">
            <div className="cv-control-panel__header">
              <span>Template</span>
              <h4>Default layout</h4>
            </div>
            <div className="cv-template-list">
              <div className="cv-template-option is-active is-modern">
                <span>
                  <strong>Professional ATS</strong>
                  <em>Single-column, recruiter-safe, ATS-first</em>
                </span>
              </div>
            </div>
          </div>
          <div className="cv-control-panel">
            <div className="cv-control-panel__header">
              <span>Context</span>
              <h4>Application-targeted</h4>
            </div>
            <p className="cv-success-note" style={{ display: 'block' }}>
              This draft starts from your Master Profile and sets the target headline from this application.
            </p>
          </div>
        </aside>
        <ProfessionalAtsPreview
          snapshot={snapshot}
          templateLabel="professional-ats"
          contextLabel={`${jobTitle} at ${company}`}
        />
      </div>
    </ProtectedPage>
  );
}
