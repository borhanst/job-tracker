'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ClipboardPaste,
  Link as LinkIcon, 
  FileText, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Building2,
  MapPin,
  CircleDollarSign,
  Briefcase,
  Gauge,
  Save
} from 'lucide-react';
import { createApplication } from '@/lib/jobs/actions';
import {
  applicationCreateSchema,
  extractRequestSchema,
  scrapeRequestSchema,
  validateWithSchema,
} from '@/lib/validation';

type AddJobWizardProps = {
  initialHandoffId?: string;
};

export default function AddJobWizard({ initialHandoffId }: AddJobWizardProps) {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handoffNotice, setHandoffNotice] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  
  const [extractedData, setExtractedData] = useState<any>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const router = useRouter();
  const loadedHandoffRef = useRef<string | null>(null);
  const firstError = (field: string) => fieldErrors[field]?.[0];
  const clearFieldError = (field: string) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  useEffect(() => {
    if (!initialHandoffId || loadedHandoffRef.current === initialHandoffId) return;

    loadedHandoffRef.current = initialHandoffId;
    setIsLoading(true);
    setError(null);
    setHandoffNotice(null);
    setFieldErrors({});

    fetch(`/api/jd-handoffs/${encodeURIComponent(initialHandoffId)}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'JD Handoff could not be loaded');
        }

        setUrl(data.handoff.url);
        setRawText(data.handoff.rawText);
        setStep(2);
        setHandoffNotice('Browser JD Capture loaded. Review the selected sections before AI Extraction.');
      })
      .catch((err: any) => {
        setStep(1);
        setError(`${err.message}. Recapture the job description or paste it manually.`);
      })
      .finally(() => {
        setIsLoading(false);
        router.replace('/jobs/add', { scroll: false });
      });
  }, [initialHandoffId, router]);

  const handleScrape = async () => {
    const validation = validateWithSchema(scrapeRequestSchema, { url });
    setError(null);
    setFieldErrors({});

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.formErrors[0] ?? validation.fieldErrors.url?.[0] ?? 'Check the job URL.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });
      const data = await res.json();
      
      if (!data.success) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data.error);
      }
      
      setRawText(data.rawText);
      setStep(2); // Move to review/paste step if scrape worked
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtract = async () => {
    const validation = validateWithSchema(extractRequestSchema, { rawText });
    setError(null);
    setFieldErrors({});

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.formErrors[0] ?? validation.fieldErrors.rawText?.[0] ?? 'Check the job description text.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });
      const data = await res.json();
      
      if (!data.success) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        throw new Error(data.error);
      }
      
      setExtractedData(data.jobData);
      setMatchScore(data.matchScore);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const validation = validateWithSchema(applicationCreateSchema, {
      url,
      raw_text: rawText,
      job_data: extractedData,
      match_score: matchScore || 0,
    });
    setError(null);
    setFieldErrors({});

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setError(validation.formErrors[0] ?? Object.values(validation.fieldErrors)[0]?.[0] ?? 'Check the application details.');
      return;
    }

    setIsLoading(true);
    try {
      await createApplication(validation.data);
      router.push('/applications');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="job-intake">
      <div className="job-intake__rail" aria-label="Add job progress">
        {[
          { label: 'Source', description: 'URL or manual text', icon: LinkIcon },
          { label: 'Review', description: `${rawText.trim().length.toLocaleString()} characters`, icon: FileText },
          { label: 'Extract', description: matchScore === null ? 'AI parse pending' : `${matchScore}% match`, icon: Sparkles },
        ].map((s, i) => {
          const stepNumber = i + 1;
          const isCurrent = step === stepNumber;
          const isDone = step > stepNumber;
          const Icon = s.icon;

          return (
            <div key={s.label} className={`job-intake-step ${isCurrent ? 'is-current' : ''} ${isDone ? 'is-done' : ''}`}>
              <span className="job-intake-step__icon">
                {isDone ? <Check size={18} /> : <Icon size={18} />}
              </span>
              <span>
                <strong>{s.label}</strong>
                <em>{s.description}</em>
              </span>
            </div>
          );
        })}
      </div>

      <div className="job-intake__stage">
      {step === 1 && (
        <div className="job-capture-card">
          <div className="job-capture-card__header">
            <span><Sparkles size={16} /> Intake source</span>
            <h2>Bring in a listing</h2>
            <p>Start from a public job URL, or jump straight to a manual description paste when the site blocks scraping.</p>
          </div>
          
          <div className="job-source-grid">
            <div className="job-source-panel is-primary">
              <div className="job-source-panel__label">
                <LinkIcon size={18} />
                <span>Scrape from URL</span>
              </div>
              <label className="job-url-field">
                <input
                  type="url"
                  placeholder="https://company.lever.co/job/123..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    clearFieldError('url');
                  }}
                  aria-invalid={Boolean(firstError('url'))}
                />
              </label>
              {firstError('url') && <p className="job-field-error">{firstError('url')}</p>}

                <button
                  onClick={handleScrape}
                  disabled={isLoading}
                className="job-action-button is-primary"
                >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={18} />}
                Scrape listing
                </button>
              </div>

            <div className="job-source-panel">
              <div className="job-source-panel__label">
                <ClipboardPaste size={18} />
                <span>Manual fallback</span>
              </div>
              <p>Paste the JD yourself when the page is behind auth, a job board overlay, or an extension capture.</p>
            <button
              onClick={() => setStep(2)}
                className="job-action-button is-secondary"
            >
              <FileText size={20} />
                Paste job text
            </button>
            </div>
          </div>
          
          {error && (
            <div className="job-intake-error">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {isLoading && initialHandoffId && (
            <div className="job-intake-notice">
              <Loader2 size={18} className="animate-spin" />
              <p>Loading Browser JD Capture...</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Review/Paste Text */}
      {step === 2 && (
        <div className="job-review-card">
          <div className="job-review-card__header">
            <div>
              <span><FileText size={16} /> Source text</span>
              <h2>Review the job description</h2>
              <p>Keep responsibilities, requirements, benefits, and company context. Remove navigation clutter before extraction.</p>
            </div>
            <strong>{rawText.trim().length.toLocaleString()} chars</strong>
          </div>
          {handoffNotice && (
            <div className="job-intake-notice is-review">
              <Check size={18} />
              <p>{handoffNotice}</p>
            </div>
          )}
          
          <textarea
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              clearFieldError('rawText');
            }}
            rows={12}
            className="job-description-editor"
            placeholder="Paste the job description here..."
            aria-invalid={Boolean(firstError('rawText'))}
          />
          {firstError('rawText') && <p className="job-field-error">{firstError('rawText')}</p>}

          <div className="job-review-actions">
            <button
              onClick={() => setStep(1)}
              className="job-action-button is-ghost"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              onClick={handleExtract}
              disabled={isLoading}
              className="job-action-button is-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  AI is Extracting...
                </>
              ) : (
                <>
                  Extract with AI
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review Extraction & Match Score */}
      {step === 3 && extractedData && (
        <div className="job-result-grid">
          <div className="job-result-card">
                <div className="job-result-card__header">
                  <div>
                <span><Sparkles size={16} /> Extracted role</span>
                    <h2>{extractedData.title}</h2>
                    <div className="job-result-meta">
                      <span>
                        <Building2 size={18} />
                        {extractedData.company}
                      </span>
                      <span>
                        <MapPin size={18} />
                        {extractedData.location}
                      </span>
                      <span>
                        <Briefcase size={18} />
                        {extractedData.type}
                      </span>
                    </div>
                  </div>
                  {extractedData.salary && (
                <div className="job-salary-badge">
                      <CircleDollarSign size={20} />
                      {extractedData.salary}
                    </div>
                  )}
                </div>

            <div className="job-result-section">
              <h3>Required skills</h3>
              <div className="job-skill-list">
                      {extractedData.requiredSkills.map((s: string) => (
                  <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>

            <div className="job-result-section">
              <h3>Responsibilities</h3>
              <ul className="job-responsibility-list">
                      {extractedData.responsibilities.slice(0, 5).map((r: string, i: number) => (
                  <li key={i}>
                    <span />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

          <aside className="job-match-card">
            <div className="job-match-card__header">
              <Gauge size={18} />
              <span>AI match score</span>
            </div>
            <div className="job-match-ring">
                  <svg className="w-32 h-32">
                    <circle
                  className="job-match-ring__track"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                  className="job-match-ring__value"
                      strokeWidth="8"
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * (matchScore || 0)) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                  </svg>
              <span>{matchScore}%</span>
                </div>
            <p>
                  {matchScore && matchScore > 80 ? 'Excellent match! You should definitely apply.' : 
                   matchScore && matchScore > 60 ? 'Good match. Consider tailoring your CV.' : 
                   'Low match. Significant skill gaps identified.'}
                </p>
            {error && (
              <div className="job-intake-error is-compact">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            )}
                <button
                  onClick={handleSave}
                  disabled={isLoading}
              className="job-action-button is-primary"
                >
              {isLoading ? <Loader2 size={22} className="animate-spin" /> : <Save size={18} />}
              Save application
                </button>
          </aside>
        </div>
      )}
      </div>
    </section>
  );
}
