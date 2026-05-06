'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  Sparkles, 
  Download, 
  FileText, 
  Layout, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  RefreshCw,
  WandSparkles
} from 'lucide-react';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { CompactTemplate } from './CompactTemplate';
import { BennettTemplate } from './BennettTemplate';

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="cv-preview-loading">Loading PDF preview...</div> }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface CVBuilderProps {
  applicationId: string;
  initialData?: any;
}

type CVTemplateKey = 'modern' | 'classic' | 'executive' | 'compact' | 'bennett';

const templateOptions: {
  key: CVTemplateKey;
  name: string;
  description: string;
  icon: typeof Layout;
}[] = [
  { key: 'modern', name: 'Modern Teal', description: 'Polished, balanced, ATS-friendly', icon: Layout },
  { key: 'classic', name: 'Classic Serif', description: 'Traditional, formal, recruiter-safe', icon: FileText },
  { key: 'executive', name: 'Executive Slate', description: 'Leadership-forward sidebar layout', icon: Sparkles },
  { key: 'compact', name: 'Compact Orange', description: 'Dense one-page impact format', icon: WandSparkles },
  { key: 'bennett', name: 'Bennett Minimal', description: 'Centered monochrome layout like the reference', icon: FileText },
];

const templateComponents = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  executive: ExecutiveTemplate,
  compact: CompactTemplate,
  bennett: BennettTemplate,
};

export default function CVBuilder({ applicationId, initialData }: CVBuilderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any>(initialData || null);
  const [template, setTemplate] = useState<CVTemplateKey>('modern');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });
      const result = await res.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const TemplateComponent = templateComponents[template];
  const jobTitle = data?.application?.job_data?.title || 'target role';
  const company = data?.application?.job_data?.company || 'company';
  const candidateName = data?.profile?.full_name || 'Candidate';

  return (
    <div className="cv-workbench">
      {!data ? (
        <div className="cv-empty-state">
          <div className="cv-empty-state__icon">
            <WandSparkles size={36} />
          </div>
          <span>Tailored CV studio</span>
          <h3>Generate your tailored CV</h3>
          <p>
            Our AI will analyze your profile and the job description to create a high-impact CV that highlights your best matches.
          </p>
          
          {error && (
            <div className="cv-message is-error">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="cv-primary-action"
          >
            {isGenerating ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Tailoring Content...
              </>
            ) : (
              <>
                Generate Now with AI
                <Sparkles size={20} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="cv-review-desk">
          <aside className="cv-review-controls">
            <div className="cv-control-panel">
              <div className="cv-control-panel__header">
                <span><Layout size={15} /> Template</span>
                <h4>Presentation style</h4>
              </div>
              <div className="cv-template-list">
                {templateOptions.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.key}
                      onClick={() => setTemplate(option.key)}
                      className={`cv-template-option is-${option.key} ${template === option.key ? 'is-active' : ''}`}
                      type="button"
                    >
                      <Icon size={20} />
                      <span>
                        <strong>{option.name}</strong>
                        <em>{option.description}</em>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="cv-control-panel">
              <div className="cv-control-panel__header">
                <span><Download size={15} /> Export</span>
                <h4>Actions</h4>
              </div>
              <PDFDownloadLink
                document={<TemplateComponent data={data} />}
                fileName={`CV_${company}_${candidateName.replace(' ', '_')}.pdf`}
                className="cv-download-action"
              >
                {({ loading }) => (
                  <>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                    Download PDF
                  </>
                )}
              </PDFDownloadLink>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="cv-secondary-action"
                type="button"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                Regenerate Content
              </button>
            </div>
            
            <div className="cv-success-note">
              <CheckCircle2 size={18} />
              <span>AI tailored your CV based on {jobTitle} requirements.</span>
            </div>
          </aside>

          <section className="cv-preview-panel">
            <div className="cv-preview-panel__topbar">
              <div>
                <span><Eye size={15} /> Live preview</span>
                <h4>{candidateName}</h4>
              </div>
              <div className="cv-preview-meta">
                <strong>{template}</strong>
                <span>{company}</span>
              </div>
            </div>
            <div className="cv-preview-frame">
              <PDFViewer className="cv-pdf-viewer">
                <TemplateComponent data={data} />
              </PDFViewer>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
