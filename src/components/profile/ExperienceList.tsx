'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience } from '@/lib/profile/actions';
import { profileExperienceSchema, validateWithSchema } from '@/lib/validation';

interface ExperienceListProps {
  experiences: any[];
}

export default function ExperienceList({ experiences }: ExperienceListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const resetForm = () => {
    setFormData({});
    setIsEditing(null);
    setIsAdding(false);
    setMessage('');
    setFieldErrors({});
  };

  const handleEdit = (exp: any) => {
    setFormData({
      company: exp.company,
      title: exp.title,
      start_date: exp.start_date,
      end_date: exp.end_date || '',
      is_current: exp.is_current,
      description: exp.description || '',
    });
    setIsEditing(exp.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[e.target.name];
      return next;
    });
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setFieldErrors({});

    const validation = validateWithSchema(profileExperienceSchema, {
      ...formData,
      is_current: Boolean(formData.is_current),
    });

    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setMessage(validation.formErrors[0] ?? 'Check the highlighted fields.');
      return;
    }

    setIsSaving(true);
    
    try {
      if (isEditing) {
        await updateWorkExperience(isEditing, validation.data);
      } else {
        await addWorkExperience(validation.data);
      }
      resetForm();
    } catch (error: any) {
      setMessage(error.message || 'Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };
  const firstError = (field: string) => fieldErrors[field]?.[0];
  const inputClass = (_field: string) => 'profile-input';

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteWorkExperience(id);
      } catch (error) {
        alert('Failed to delete experience');
      }
    }
  };

  return (
    <div className="profile-panel">
      <div className="profile-panel__bar">
        <div>
          <span>Timeline</span>
          <h2>Work experience</h2>
        </div>
        {!isAdding && !isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="profile-add-button"
          >
            <Plus size={18} />
            Add Experience
          </button>
        )}
      </div>

      {(isAdding || isEditing) ? (
        <form onSubmit={handleSubmit} className="profile-edit-form" noValidate>
          {message && <p className="profile-field-error">{message}</p>}
          <div className="profile-field-grid">
            <div className="profile-field">
              <label>Company</label>
              <input type="text" name="company" value={formData.company || ''} onChange={handleChange} className={inputClass('company')} aria-invalid={Boolean(firstError('company'))} />
              {firstError('company') && <p className="profile-field-error">{firstError('company')}</p>}
            </div>
            <div className="profile-field">
              <label>Job Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className={inputClass('title')} aria-invalid={Boolean(firstError('title'))} />
              {firstError('title') && <p className="profile-field-error">{firstError('title')}</p>}
            </div>
            <div className="profile-field">
              <label>Start Date</label>
              <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleChange} className={inputClass('start_date')} aria-invalid={Boolean(firstError('start_date'))} />
              {firstError('start_date') && <p className="profile-field-error">{firstError('start_date')}</p>}
            </div>
            <div className="profile-field">
              <label>End Date</label>
              <input type="date" name="end_date" disabled={formData.is_current} value={formData.end_date || ''} onChange={handleChange} className={inputClass('end_date')} aria-invalid={Boolean(firstError('end_date'))} />
              {firstError('end_date') && <p className="profile-field-error">{firstError('end_date')}</p>}
              <div className="profile-check-row">
                <input type="checkbox" name="is_current" id="is_current" checked={formData.is_current || false} onChange={handleChange} className="rounded" />
                <label htmlFor="is_current">I currently work here</label>
              </div>
            </div>
          </div>
          <div className="profile-field">
            <label>Description</label>
            <textarea name="description" rows={4} value={formData.description || ''} onChange={handleChange} className="profile-textarea" />
          </div>
          <div className="profile-actions">
            <button type="button" onClick={resetForm} className="profile-cancel">Cancel</button>
            <button type="submit" disabled={isSaving} className="profile-save">
              {isSaving && <Loader2 size={16} className="animate-spin" />} Save
            </button>
          </div>
        </form>
      ) : experiences.length === 0 ? (
        <div className="profile-empty">
          <p>No work experience added yet.</p>
          <button onClick={() => setIsAdding(true)}>Add your first role</button>
        </div>
      ) : (
        <div className="profile-card-list">
          {experiences.map((exp) => (
            <div key={exp.id} className="profile-timeline-card">
              <div className="profile-card-actions">
                <button onClick={() => handleEdit(exp)}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(exp.id)}><Trash2 size={16} /></button>
              </div>
              <h3>{exp.title}</h3>
              <strong>{exp.company}</strong>
              <p className="profile-card-date">
                {new Date(exp.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                {exp.is_current ? ' Present' : exp.end_date ? ` ${new Date(exp.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}` : ''}
              </p>
              {exp.description && <p className="profile-card-body">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
