import { FileText } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';
import { getFullProfile } from '@/lib/profile/actions';
import ProfessionalAtsPreview from '@/components/cv/ProfessionalAtsPreview';
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
        description="Preview a professional ATS-friendly CV generated from your Master Profile."
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
              <span>Sections</span>
              <h4>Auto-populated</h4>
            </div>
            <p className="cv-success-note" style={{ display: 'block' }}>
              This preview renders all non-empty profile sections: summary, skills, work experience, projects, education, certifications, and languages.
            </p>
          </div>
        </aside>
        <ProfessionalAtsPreview snapshot={snapshot} />
      </div>
    </ProtectedPage>
  );
}
