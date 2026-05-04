'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience } from '@/lib/profile/actions';

interface ExperienceListProps {
  experiences: any[];
}

export default function ExperienceList({ experiences }: ExperienceListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({});
    setIsEditing(null);
    setIsAdding(false);
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
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (isEditing) {
        await updateWorkExperience(isEditing, formData);
      } else {
        await addWorkExperience(formData);
      }
      resetForm();
    } catch (error) {
      alert('Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="glass-card p-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        {!isAdding && !isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Add Experience
          </button>
        )}
      </div>

      {(isAdding || isEditing) ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input type="text" name="company" required value={formData.company || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <input type="text" name="title" required value={formData.title || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" name="start_date" required value={formData.start_date || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input type="date" name="end_date" disabled={formData.is_current} value={formData.end_date || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg disabled:opacity-50" />
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" name="is_current" id="is_current" checked={formData.is_current || false} onChange={handleChange} className="rounded" />
                <label htmlFor="is_current" className="text-sm">I currently work here</label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" rows={4} value={formData.description || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg resize-y" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary px-8 py-2 rounded-xl flex items-center gap-2">
              {isSaving && <Loader2 size={16} className="animate-spin" />} Save
            </button>
          </div>
        </form>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 mb-4">No work experience added yet.</p>
          <button onClick={() => setIsAdding(true)} className="text-blue-600 font-bold hover:underline">Add your first role</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="group relative p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleEdit(exp)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(exp.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 size={16} /></button>
              </div>
              <h3 className="text-lg font-bold">{exp.title}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold">{exp.company}</p>
              <p className="text-sm text-slate-500 mb-4">
                {new Date(exp.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} - 
                {exp.is_current ? ' Present' : exp.end_date ? ` ${new Date(exp.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}` : ''}
              </p>
              {exp.description && <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
