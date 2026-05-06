'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateProfile } from '@/lib/profile/actions';
import { profileSummarySchema, validateWithSchema } from '@/lib/validation';

interface SummaryInfoProps {
  profile: any;
}

export default function SummaryInfo({ profile }: SummaryInfoProps) {
  const [summary, setSummary] = useState(profile?.summary || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setFieldErrors({});

    const validation = validateWithSchema(profileSummarySchema, { summary });
    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setMessage({ type: 'error', text: validation.formErrors[0] ?? 'Check the highlighted fields.' });
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile(validation.data);
      setMessage({ type: 'success', text: 'Professional summary saved successfully.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-panel">
      <div className="profile-panel__header">
        <span>Narrative</span>
        <h2>Professional summary</h2>
        <p>
          This is your core professional bio. AI will use this as a baseline to generate tailored summaries for specific job applications.
        </p>
      </div>
      
      {message.text && (
        <div className={`profile-message is-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form" noValidate>
        <div className="profile-field">
          <textarea
            rows={8}
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value);
              setFieldErrors({});
            }}
            placeholder="I am a highly motivated software engineer with 5+ years of experience in..."
            className="profile-textarea"
            aria-invalid={Boolean(fieldErrors.summary?.[0])}
          />
          {fieldErrors.summary?.[0] && <p className="profile-field-error">{fieldErrors.summary[0]}</p>}
        </div>

        <div className="profile-actions">
          <button
            type="submit"
            disabled={isSaving}
            className="profile-save"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            Save Summary
          </button>
        </div>
      </form>
    </div>
  );
}
