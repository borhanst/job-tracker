'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { addProfileItem, deleteProfileItem } from '@/lib/profile/actions';
import { profileItemSchemas, validateWithSchema, type ProfileItemTable } from '@/lib/validation';

interface ProfileSectionListProps {
  title: string;
  items: any[];
  table: string;
  fields: { name: string; label: string; type: string; placeholder?: string; options?: string[] }[];
  renderItem: (item: any) => React.ReactNode;
}

export default function ProfileSectionList({ title, items, table, fields, renderItem }: ProfileSectionListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const resetForm = () => {
    setFormData({});
    setIsAdding(false);
    setMessage('');
    setFieldErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    if (!Object.prototype.hasOwnProperty.call(profileItemSchemas, table)) {
      setMessage('Unsupported profile section.');
      return;
    }

    const validation = validateWithSchema(profileItemSchemas[table as ProfileItemTable], formData);
    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setMessage(validation.formErrors[0] ?? 'Check the highlighted fields.');
      return;
    }

    setIsSaving(true);
    
    try {
      await addProfileItem(table, validation.data);
      resetForm();
    } catch (error: any) {
      setMessage(error.message || `Failed to save ${title.toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };
  const firstError = (field: string) => fieldErrors[field]?.[0];
  const inputClass = (_field: string) => 'profile-input';

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)) {
      try {
        await deleteProfileItem(table, id);
      } catch (error) {
        alert(`Failed to delete ${title.toLowerCase()}`);
      }
    }
  };

  return (
    <div className="profile-panel">
      <div className="profile-panel__bar">
        <div>
          <span>Profile signal</span>
          <h2>{title}</h2>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="profile-add-button"
          >
            <Plus size={18} />
            Add {title}
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="profile-edit-form" noValidate>
          {message && <p className="profile-field-error">{message}</p>}
          <div className="profile-field-grid">
            {fields.map(field => (
              <div key={field.name} className={`profile-field ${field.type === 'textarea' ? 'profile-field--wide' : ''}`}>
                <label>{field.label}</label>
                {field.type === 'select' ? (
                  <select name={field.name} value={formData[field.name] || ''} onChange={handleChange} className={inputClass(field.name)} aria-invalid={Boolean(firstError(field.name))}>
                    <option value="" disabled>Select {field.label}</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                  </select>
                ) : (
                  <input type={field.type} name={field.name} placeholder={field.placeholder} value={formData[field.name] || ''} onChange={handleChange} className={inputClass(field.name)} aria-invalid={Boolean(firstError(field.name))} />
                )}
                {firstError(field.name) && <p className="profile-field-error">{firstError(field.name)}</p>}
              </div>
            ))}
          </div>
          <div className="profile-actions">
            <button type="button" onClick={resetForm} className="profile-cancel">Cancel</button>
            <button type="submit" disabled={isSaving} className="profile-save">
              {isSaving && <Loader2 size={16} className="animate-spin" />} Save
            </button>
          </div>
        </form>
      ) : items.length === 0 ? (
        <div className="profile-empty">
          <p>No {title.toLowerCase()} added yet.</p>
        </div>
      ) : (
        <div className="profile-chip-grid">
          {items.map((item) => (
            <div key={item.id} className="profile-signal-card">
              <div>{renderItem(item)}</div>
              <button onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
