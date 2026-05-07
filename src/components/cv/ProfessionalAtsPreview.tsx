'use client';

import dynamic from 'next/dynamic';
import { Eye } from 'lucide-react';
import { ProfessionalAtsTemplate } from './ProfessionalAtsTemplate';
import type { ProfessionalAtsSnapshot } from '@/lib/cv/professionalAts';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="cv-preview-loading">Loading PDF preview...</div> },
);

interface ProfessionalAtsPreviewProps {
  snapshot: ProfessionalAtsSnapshot;
}

export default function ProfessionalAtsPreview({ snapshot }: ProfessionalAtsPreviewProps) {
  return (
    <section className="cv-preview-panel">
      <div className="cv-preview-panel__topbar">
        <div>
          <span><Eye size={15} /> Live preview</span>
          <h4>{snapshot.header.full_name || 'Candidate'}</h4>
        </div>
        <div className="cv-preview-meta">
          <strong>professional-ats</strong>
          <span>General CV</span>
        </div>
      </div>
      <div className="cv-preview-frame">
        <PDFViewer className="cv-pdf-viewer">
          <ProfessionalAtsTemplate snapshot={snapshot} />
        </PDFViewer>
      </div>
    </section>
  );
}
