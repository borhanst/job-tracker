'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  CircleDollarSign, 
  Calendar, 
  Link as LinkIcon,
  ChevronLeft,
  FileText,
  Sparkles,
  MessageSquare,
  History,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { updateApplicationStatus } from '@/lib/jobs/actions';
import CVBuilder from '@/components/cv/CVBuilder';
import CoverLetterBuilder from '@/components/cv/CoverLetterBuilder';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';

const statuses = [
  'saved', 'applied', 'phone_screen', 'interview', 'offer', 'accepted', 'rejected'
];

interface JobDetailViewProps {
  application: any;
}

export default function JobDetailView({ application }: JobDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [status, setStatus] = useState(application.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus(application.id, newStatus);
      setStatus(newStatus);
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const { job_data } = application;

  return (
    <ProtectedPage maxWidth="wide">
      <div className="protected-page__back">
        <Link 
          href="/applications" 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-fit"
        >
          <ChevronLeft size={20} />
          Back to Applications
        </Link>
      </div>

      <ProtectedPageHeader
        eyebrow="Application detail"
        title={job_data.title}
        description={`${job_data.company} ${job_data.location ? `in ${job_data.location}` : ''}`}
        icon={Briefcase}
        actions={
          <>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
            >
              {statuses.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
            </select>
            <button className="bg-red-50 text-red-600 p-2.5 rounded-xl hover:bg-red-100 transition-all">
              <Trash2 size={20} />
            </button>
          </>
        }
      >
        <div className="flex flex-wrap gap-4 text-slate-500 font-medium">
          <span className="flex items-center gap-1.5"><Building2 size={18} /> {job_data.company}</span>
          <span className="flex items-center gap-1.5"><MapPin size={18} /> {job_data.location}</span>
          <span className="flex items-center gap-1.5"><Briefcase size={18} /> {job_data.type}</span>
        </div>
      </ProtectedPageHeader>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'cvs', label: 'Generated CVs', icon: Sparkles },
            { id: 'cover-letters', label: 'Cover Letters', icon: MessageSquare },
            { id: 'notes', label: 'Notes & Activity', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all text-left ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' 
                  : 'text-slate-500 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="glass p-8 rounded-3xl border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Job Details</h3>
                  <div className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-black border border-indigo-100 dark:border-indigo-900/50">
                    {application.match_score}% Match
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Salary Range</h4>
                      <p className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <CircleDollarSign size={18} className="text-emerald-500" />
                        {job_data.salary || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {job_data.requiredSkills.map((s: string) => (
                          <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Experience Level</h4>
                      <p className="font-bold text-slate-900 dark:text-white">{job_data.experience}</p>
                    </div>
                    {job_data.deadline && (
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Deadline</h4>
                        <p className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <Calendar size={18} className="text-amber-500" />
                          {job_data.deadline}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Key Responsibilities</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job_data.responsibilities.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                          <CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {application.url && (
                  <a 
                    href={application.url} 
                    target="_blank" 
                    className="mt-8 flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all group"
                  >
                    View Original Job Posting
                    <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === 'cvs' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <CVBuilder 
                applicationId={application.id} 
                initialData={application.generated_documents?.find((d: any) => d.type === 'cv') ? {
                  application: application,
                  profile: application.profile, // Need to ensure profile is passed or fetched
                  tailoredData: application.generated_documents.find((d: any) => d.type === 'cv').content
                } : null}
              />
            </div>
          )}

          {activeTab === 'cover-letters' && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <CoverLetterBuilder 
                applicationId={application.id} 
                initialText={application.generated_documents?.find((d: any) => d.type === 'cover_letter')?.content.text}
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
