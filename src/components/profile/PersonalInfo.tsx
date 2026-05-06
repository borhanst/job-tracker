'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateProfile } from '@/lib/profile/actions';
import { profilePersonalSchema, validateWithSchema } from '@/lib/validation';

interface PersonalInfoProps {
  profile: any;
}

export default function PersonalInfo({ profile }: PersonalInfoProps) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    linkedin_url: profile?.linkedin_url || '',
    github_url: profile?.github_url || '',
    portfolio_url: profile?.portfolio_url || '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[e.target.name];
      return next;
    });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setFieldErrors({});

    const validation = validateWithSchema(profilePersonalSchema, formData);
    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setMessage({ type: 'error', text: validation.formErrors[0] ?? 'Check the highlighted fields.' });
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile(validation.data);
      setMessage({ type: 'success', text: 'Personal information saved successfully.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save.' });
    } finally {
      setIsSaving(false);
    }
  };
  const firstError = (field: string) => fieldErrors[field]?.[0];
  const inputClass = (_field: string) => 'profile-input';

  return (
    <div className="profile-panel">
      <div className="profile-panel__header">
        <span>Identity</span>
        <h2>Personal information</h2>
      </div>
      
      {message.text && (
        <div className={`profile-message is-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form" noValidate>
        <div className="profile-field-grid">
          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={inputClass('full_name')}
              aria-invalid={Boolean(firstError('full_name'))}
            />
            {firstError('full_name') && <p className="profile-field-error">{firstError('full_name')}</p>}
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="profile-input"
            />
            <p>Email cannot be changed here.</p>
          </div>
          <div className="profile-field">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass('phone')}
              aria-invalid={Boolean(firstError('phone'))}
            />
            {firstError('phone') && <p className="profile-field-error">{firstError('phone')}</p>}
          </div>
          <div className="profile-field">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country or Remote"
              className={inputClass('location')}
              aria-invalid={Boolean(firstError('location'))}
            />
            {firstError('location') && <p className="profile-field-error">{firstError('location')}</p>}
          </div>
        </div>

        <h3 className="profile-subhead">Links</h3>
        <div className="profile-field-grid">
          <div className="profile-field">
            <label>LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className={inputClass('linkedin_url')}
              aria-invalid={Boolean(firstError('linkedin_url'))}
            />
            {firstError('linkedin_url') && <p className="profile-field-error">{firstError('linkedin_url')}</p>}
          </div>
          <div className="profile-field">
            <label>GitHub URL</label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className={inputClass('github_url')}
              aria-invalid={Boolean(firstError('github_url'))}
            />
            {firstError('github_url') && <p className="profile-field-error">{firstError('github_url')}</p>}
          </div>
          <div className="profile-field profile-field--wide">
            <label>Portfolio URL</label>
            <input
              type="url"
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
              className={inputClass('portfolio_url')}
              aria-invalid={Boolean(firstError('portfolio_url'))}
            />
            {firstError('portfolio_url') && <p className="profile-field-error">{firstError('portfolio_url')}</p>}
          </div>
        </div>

        <div className="profile-actions">
          <button
            type="submit"
            disabled={isSaving}
            className="profile-save"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
