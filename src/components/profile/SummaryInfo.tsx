'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { updateProfile } from '@/lib/profile/actions';

interface SummaryInfoProps {
  profile: any;
}

export default function SummaryInfo({ profile }: SummaryInfoProps) {
  const [summary, setSummary] = useState(profile?.summary || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({ summary });
      setMessage({ type: 'success', text: 'Professional summary saved successfully.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass-card p-10">
      <h2 className="text-2xl font-bold mb-2">Professional Summary</h2>
      <p className="text-slate-500 mb-6">
        This is your core professional bio. AI will use this as a baseline to generate tailored summaries for specific job applications.
      </p>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-red-50 text-red-600 dark:bg-red-950/30'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <textarea
            rows={8}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="I am a highly motivated software engineer with 5+ years of experience in..."
            className="w-full p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-y text-sm leading-relaxed"
          />
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary px-10 py-4 rounded-2xl"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            Save Summary
          </button>
        </div>
      </form>
    </div>
  );
}
