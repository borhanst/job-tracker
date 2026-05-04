'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { addEducation, updateEducation, deleteEducation } from '@/lib/profile/actions';

interface EducationListProps {
  educations: any[];
}

export default function EducationList({ educations }: EducationListProps) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData({});
    setIsEditing(null);
    setIsAdding(false);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (isEditing) {
        await updateEducation(isEditing, formData);
      } else {
        await addEducation(formData);
      }
      resetForm();
    } catch (error) {
      alert('Failed to save education');
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="glass-card p-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Education</h2>
        {!isAdding && !isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Add Education
          </button>
        )}
      </div>

      {(isAdding || isEditing) ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Institution / University</label>
              <input type="text" name="institution" required value={formData.institution || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <input type="text" name="degree" required placeholder="e.g. Bachelor of Science" value={formData.degree || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Field of Study</label>
              <input type="text" name="field" required placeholder="e.g. Computer Science" value={formData.field || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input type="date" name="start_date" required value={formData.start_date || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date (or expected)</label>
              <input type="date" name="end_date" value={formData.end_date || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
              <input type="text" name="gpa" value={formData.gpa || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary px-8 py-2 rounded-xl flex items-center gap-2">
              {isSaving && <Loader2 size={16} className="animate-spin" />} Save
            </button>
          </div>
        </form>
      ) : educations.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 mb-4">No education history added yet.</p>
          <button onClick={() => setIsAdding(true)} className="text-blue-600 font-bold hover:underline">Add your education</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {educations.map((edu) => (
            <div key={edu.id} className="group relative p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm">
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleEdit(edu)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(edu.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 size={16} /></button>
              </div>
              <h3 className="text-lg font-bold">{edu.institution}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-bold">{edu.degree} in {edu.field}</p>
              <p className="text-sm text-slate-500">
                {new Date(edu.start_date).toLocaleDateString(undefined, { year: 'numeric' })} - 
                {edu.end_date ? ` ${new Date(edu.end_date).toLocaleDateString(undefined, { year: 'numeric' })}` : ' Present'}
              </p>
              {edu.gpa && <p className="text-sm text-slate-600 mt-2">GPA: <span className="font-medium">{edu.gpa}</span></p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
