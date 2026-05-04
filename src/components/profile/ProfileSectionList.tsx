'use client';

import React, { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { addProfileItem, deleteProfileItem } from '@/lib/profile/actions';

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

  const resetForm = () => {
    setFormData({});
    setIsAdding(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await addProfileItem(table, formData);
      resetForm();
    } catch (error) {
      alert(`Failed to save ${title.toLowerCase()}`);
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="glass-card p-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Add {title}
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {fields.map(field => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                {field.type === 'select' ? (
                  <select name={field.name} required value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                    <option value="" disabled>Select {field.label}</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                  </select>
                ) : (
                  <input type={field.type} name={field.name} required placeholder={field.placeholder} value={formData[field.name] || ''} onChange={handleChange} className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg" />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-primary px-8 py-2 rounded-xl flex items-center gap-2">
              {isSaving && <Loader2 size={16} className="animate-spin" />} Save
            </button>
          </div>
        </form>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 mb-4">No {title.toLowerCase()} added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="group relative p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all flex justify-between items-center shadow-sm">
              <div>{renderItem(item)}</div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
