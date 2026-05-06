'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { addEducation, updateEducation, deleteEducation } from '@/lib/profile/actions';
import { profileEducationSchema, validateWithSchema } from '@/lib/validation';

interface EducationListProps {
  educations: any[];
}

export default function EducationList({ educations }: EducationListProps) {
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

  const handleEdit = (edu: any) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      start_date: edu.start_date,
      end_date: edu.end_date || '',
      gpa: edu.gpa || '',
    });
    setIsEditing(edu.id);
  };

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
    setMessage('');
    setFieldErrors({});

    const validation = validateWithSchema(profileEducationSchema, formData);
    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setMessage(validation.formErrors[0] ?? 'Check the highlighted fields.');
      return;
    }

    setIsSaving(true);
    
    try {
      if (isEditing) {
        await updateEducation(isEditing, validation.data);
      } else {
        await addEducation(validation.data);
      }
      resetForm();
    } catch (error: any) {
      setMessage(error.message || 'Failed to save education');
    } finally {
      setIsSaving(false);
    }
  };
  const firstError = (field: string) => fieldErrors[field]?.[0];
  const inputClass = (_field: string) => 'profile-input';

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      try {
        await deleteEducation(id);
      } catch (error) {
        alert('Failed to delete education');
      }
    }
  };

  return (
    <div className="profile-panel">
      <div className="profile-panel__bar">
        <div>
          <span>Credentials</span>
          <h2>Education</h2>
        </div>
        {!isAdding && !isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="profile-add-button"
          >
            <Plus size={18} />
            Add Education
          </button>
        )}
      </div>

      {(isAdding || isEditing) ? (
        <form onSubmit={handleSubmit} className="profile-edit-form" noValidate>
          {message && <p className="profile-field-error">{message}</p>}
          <div className="profile-field-grid">
            <div className="profile-field profile-field--wide">
              <label>Institution / University</label>
              <input type="text" name="institution" value={formData.institution || ''} onChange={handleChange} className={inputClass('institution')} aria-invalid={Boolean(firstError('institution'))} />
              {firstError('institution') && <p className="profile-field-error">{firstError('institution')}</p>}
            </div>
            <div className="profile-field">
              <label>Degree</label>
              <input type="text" name="degree" placeholder="e.g. Bachelor of Science" value={formData.degree || ''} onChange={handleChange} className={inputClass('degree')} aria-invalid={Boolean(firstError('degree'))} />
              {firstError('degree') && <p className="profile-field-error">{firstError('degree')}</p>}
            </div>
            <div className="profile-field">
              <label>Field of Study</label>
              <input type="text" name="field" placeholder="e.g. Computer Science" value={formData.field || ''} onChange={handleChange} className={inputClass('field')} aria-invalid={Boolean(firstError('field'))} />
              {firstError('field') && <p className="profile-field-error">{firstError('field')}</p>}
            </div>
            <div className="profile-field">
              <label>Start Date</label>
              <input type="date" name="start_date" value={formData.start_date || ''} onChange={handleChange} className={inputClass('start_date')} aria-invalid={Boolean(firstError('start_date'))} />
              {firstError('start_date') && <p className="profile-field-error">{firstError('start_date')}</p>}
            </div>
            <div className="profile-field">
              <label>End Date (or expected)</label>
              <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} className={inputClass('end_date')} aria-invalid={Boolean(firstError('end_date'))} />
              {firstError('end_date') && <p className="profile-field-error">{firstError('end_date')}</p>}
            </div>
            <div className="profile-field">
              <label>GPA (Optional)</label>
              <input type="text" name="gpa" value={formData.gpa || ''} onChange={handleChange} className="profile-input" />
            </div>
          </div>
          <div className="profile-actions">
            <button type="button" onClick={resetForm} className="profile-cancel">Cancel</button>
            <button type="submit" disabled={isSaving} className="profile-save">
              {isSaving && <Loader2 size={16} className="animate-spin" />} Save
            </button>
          </div>
        </form>
      ) : educations.length === 0 ? (
        <div className="profile-empty">
          <p>No education history added yet.</p>
          <button onClick={() => setIsAdding(true)}>Add your education</button>
        </div>
      ) : (
        <div className="profile-card-list">
          {educations.map((edu) => (
            <div key={edu.id} className="profile-timeline-card">
              <div className="profile-card-actions">
                <button onClick={() => handleEdit(edu)}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(edu.id)}><Trash2 size={16} /></button>
              </div>
              <h3>{edu.institution}</h3>
              <strong>{edu.degree} in {edu.field}</strong>
              <p className="profile-card-date">
                {new Date(edu.start_date).toLocaleDateString(undefined, { year: 'numeric' })} - 
                {edu.end_date ? ` ${new Date(edu.end_date).toLocaleDateString(undefined, { year: 'numeric' })}` : ' Present'}
              </p>
              {edu.gpa && <p className="profile-card-body">GPA: <span>{edu.gpa}</span></p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
