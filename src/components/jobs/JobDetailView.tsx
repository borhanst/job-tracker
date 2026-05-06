'use client';

import React, { useState } from 'react';
import {
  Building2, 
  MapPin, 
  Briefcase, 
  CircleDollarSign, 
  Calendar, 
  Link as LinkIcon,
  ChevronLeft,
  FileText,
  Sparkles,
  MessageSquare,
  History,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Gauge,
  Layers3,
  TimerReset,
  Expand,
  X
} from 'lucide-react';
import Link from 'next/link';
import { updateApplicationStatus } from '@/lib/jobs/actions';
import CVBuilder from '@/components/cv/CVBuilder';
import CoverLetterBuilder from '@/components/cv/CoverLetterBuilder';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';
import { APPLICATION_STATUSES } from '@/lib/validation';

const statuses = [...APPLICATION_STATUSES];

const statusLabels: Record<string, string> = {
  saved: 'Saved',
  applied: 'Applied',
  phone_screen: 'Phone screen',
  interview: 'Interview',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

interface JobDetailViewProps {
  application: any;
}

export default function JobDetailView({ application }: JobDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState(application.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCvIndex, setSelectedCvIndex] = useState<number>(0);
  const [isCvStudioOpen, setIsCvStudioOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(application.id, newStatus);
      setStatus(newStatus);
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const { job_data } = application;
  const requiredSkills = job_data.requiredSkills || [];
  const niceToHaveSkills = job_data.niceToHaveSkills || [];
  const responsibilities = job_data.responsibilities || [];
  const documents = application.generated_documents || [];
  const cvDocuments = documents.filter((d: any) => d.type === 'cv');
  const coverLetterDocument = documents.find((d: any) => d.type === 'cover_letter');
  const selectedCv = cvDocuments[selectedCvIndex] || null;
  const selectedCvInitialData = selectedCv
    ? {
        application,
        profile: application.profile,
        tailoredData: selectedCv.content,
      }
    : null;

  return (
    <ProtectedPage maxWidth="wide">
      <div className="protected-page__back">
        <Link 
          href="/applications" 
          className="application-detail-back"
        >
          <ChevronLeft size={20} />
          Back to applications
        </Link>
      </div>

      <ProtectedPageHeader
        eyebrow="Application detail"
        title={job_data.title || 'Untitled role'}
        description={`${job_data.company || 'Unknown company'} ${job_data.location ? `in ${job_data.location}` : ''}`}
        icon={Briefcase}
      />

      <section className="application-detail">
        <div className="application-detail-hero">
          <div className="application-detail-hero__copy">
            <span><Sparkles size={16} /> Role dossier</span>
            <h2>{job_data.title || 'Untitled role'}</h2>
            <div className="application-detail-meta">
              <span><Building2 size={17} /> {job_data.company || 'Unknown company'}</span>
              <span><MapPin size={17} /> {job_data.location || 'Location not set'}</span>
              <span><Briefcase size={17} /> {job_data.type || 'Role type unknown'}</span>
            </div>
          </div>

          <div className="application-detail-score" aria-label={`${application.match_score}% match score`}>
            <Gauge size={20} />
            <strong>{application.match_score}%</strong>
            <span>match</span>
          </div>
        </div>

        <div className="application-detail-console">
          <div className="application-detail-status">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
            >
              {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
          </div>
          <div className="application-detail-fact">
            <CircleDollarSign size={18} />
            <div>
              <span>Salary</span>
              <strong>{job_data.salary || 'Not specified'}</strong>
            </div>
          </div>
          <div className="application-detail-fact">
            <TimerReset size={18} />
            <div>
              <span>Experience</span>
              <strong>{job_data.experience || 'Not specified'}</strong>
            </div>
          </div>
          <button className="application-detail-delete" type="button" aria-label="Delete application">
            <Trash2 size={19} />
          </button>
        </div>

        <div className="application-detail-layout">
          <nav className="application-detail-tabs" aria-label="Application detail sections">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'cvs', label: 'Generated CVs', icon: Sparkles },
              { id: 'cover-letters', label: 'Cover Letters', icon: MessageSquare },
              { id: 'notes', label: 'Notes & Activity', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`application-detail-tab ${activeTab === tab.id ? 'is-active' : ''}`}
                  type="button"
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <span><Icon size={19} /></span>
                  <strong>{tab.label}</strong>
                </button>
              );
            })}
          </nav>

          <div className="application-detail-content">
          {activeTab === 'overview' && (
            <div className="application-detail-panel">
              <div className="application-detail-panel__header">
                <span><Layers3 size={16} /> Extracted job data</span>
                <h3>Role overview</h3>
              </div>

              <div className="application-detail-grid">
                <div className="application-detail-section">
                  <h4>Required skills</h4>
                  <div className="application-detail-skill-list">
                    {requiredSkills.length > 0 ? requiredSkills.map((s: string) => (
                      <span key={s}>{s}</span>
                    )) : (
                      <em>No required skills extracted</em>
                    )}
                  </div>
                </div>

                <div className="application-detail-section">
                  <h4>Nice to have</h4>
                  <div className="application-detail-skill-list is-muted">
                    {niceToHaveSkills.length > 0 ? niceToHaveSkills.map((s: string) => (
                      <span key={s}>{s}</span>
                    )) : (
                      <em>No preferred skills extracted</em>
                    )}
                  </div>
                </div>
              </div>

              <div className="application-detail-section">
                <h4>Key responsibilities</h4>
                <ul className="application-detail-responsibilities">
                  {responsibilities.length > 0 ? responsibilities.map((r: string, i: number) => (
                    <li key={i}>
                      <CheckCircle2 size={16} />
                      {r}
                    </li>
                  )) : (
                    <li><CheckCircle2 size={16} /> No responsibilities extracted</li>
                  )}
                </ul>
              </div>

              {(job_data.aboutCompany || job_data.deadline || application.url) && (
                <div className="application-detail-footnotes">
                  {job_data.aboutCompany && (
                    <div>
                      <h4>Company note</h4>
                      <p>{job_data.aboutCompany}</p>
                    </div>
                  )}
                  {job_data.deadline && (
                    <div>
                      <h4>Deadline</h4>
                      <p><Calendar size={16} /> {job_data.deadline}</p>
                    </div>
                  )}
                  {application.url && (
                    <a href={application.url} target="_blank" rel="noreferrer">
                      View original posting
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cvs' && (
            <div className="application-detail-document-panel">
              <div className="application-detail-panel__header">
                <span><Sparkles size={16} /> CV Gallery</span>
                <h3>Generated CVs</h3>
                <p>
                  {cvDocuments.length > 0
                    ? 'Your generated CV versions are shown as quick previews. Click any card to open a full-screen editing studio.'
                    : 'No CV generated yet. Start with a fresh full-screen studio and create your first version.'}
                </p>
              </div>

              <div className="application-cv-gallery">
                {cvDocuments.length > 0 ? (
                  cvDocuments.map((document: any, index: number) => (
                    <button
                      key={document.id || `${document.type}-${index}`}
                      type="button"
                      className="application-cv-card"
                      onClick={() => {
                        setSelectedCvIndex(index);
                        setIsCvStudioOpen(true);
                      }}
                    >
                      <div className="application-cv-card__topbar">
                        <span>Version {cvDocuments.length - index}</span>
                        <Expand size={15} />
                      </div>
                      <div className="application-cv-card__sheet" aria-hidden="true">
                        <strong>{application.profile?.full_name || 'Candidate'}</strong>
                        <em>{job_data.title || 'Target role'}</em>
                        <i>{job_data.company || 'Company'}</i>
                        <u />
                        <u />
                        <u className="is-short" />
                      </div>
                      <p>
                        {document.created_at
                          ? new Date(document.created_at).toLocaleString()
                          : 'Saved CV snapshot'}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="application-cv-empty">
                    <Sparkles size={18} />
                    <p>Create your first tailored CV for this role.</p>
                  </div>
                )}

                <button
                  type="button"
                  className="application-cv-card is-generate"
                  onClick={() => {
                    setSelectedCvIndex(0);
                    setIsCvStudioOpen(true);
                  }}
                >
                  <div className="application-cv-card__topbar">
                    <span>New Version</span>
                    <Sparkles size={15} />
                  </div>
                  <div className="application-cv-card__sheet is-new" aria-hidden="true">
                    <strong>AI Tailored Studio</strong>
                    <em>Generate and compare variants</em>
                    <i>Open full-screen workspace</i>
                    <u />
                    <u className="is-short" />
                  </div>
                  <p>Launch the generator</p>
                </button>
              </div>

              {isCvStudioOpen && (
                <div className="application-cv-modal" role="dialog" aria-modal="true" aria-label="CV studio">
                  <div className="application-cv-modal__backdrop" onClick={() => setIsCvStudioOpen(false)} />
                  <div className="application-cv-modal__content">
                    <div className="application-cv-modal__topbar">
                      <div>
                        <span><Sparkles size={15} /> CV Studio</span>
                        <h4>{selectedCv ? `Version ${cvDocuments.length - selectedCvIndex}` : 'New tailored version'}</h4>
                      </div>
                      <button type="button" onClick={() => setIsCvStudioOpen(false)} aria-label="Close CV studio">
                        <X size={18} />
                      </button>
                    </div>
                    <CVBuilder
                      applicationId={application.id}
                      initialData={selectedCvInitialData}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'cover-letters' && (
            <div className="application-detail-document-panel">
              <div className="application-detail-panel__header">
                <span><MessageSquare size={16} /> Outreach</span>
                <h3>Cover letter</h3>
                <p>{coverLetterDocument ? 'Review or regenerate the saved cover letter for this application.' : 'Generate a cover letter grounded in this role and your profile.'}</p>
              </div>
              <CoverLetterBuilder 
                applicationId={application.id} 
                initialText={coverLetterDocument?.content.text}
              />
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="application-detail-panel">
              <div className="application-detail-panel__header">
                <span><History size={16} /> Activity</span>
                <h3>Notes & activity</h3>
                <p>Timeline tools are not wired yet. Use status and generated documents as the current activity record.</p>
              </div>
              <div className="application-detail-activity">
                <div>
                  <strong>Current status</strong>
                  <span>{statusLabels[status] || status}</span>
                </div>
                <div>
                  <strong>Created</strong>
                  <span>{new Date(application.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <strong>Generated documents</strong>
                  <span>{documents.length}</span>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
