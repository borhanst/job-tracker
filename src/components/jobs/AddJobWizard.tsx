'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Link as LinkIcon, 
  FileText, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  Building2,
  MapPin,
  CircleDollarSign,
  Briefcase
} from 'lucide-react';
import { createApplication } from '@/lib/jobs/actions';

export default function AddJobWizard() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [extractedData, setExtractedData] = useState<any>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const router = useRouter();

  const handleScrape = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      setRawText(data.rawText);
      setStep(2); // Move to review/paste step if scrape worked
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtract = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      setExtractedData(data.jobData);
      setMatchScore(data.matchScore);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await createApplication({
        url,
        raw_text: rawText,
        job_data: extractedData,
        match_score: matchScore || 0,
      });
      router.push('/applications');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12">
        {[
          { label: 'Input Source', icon: LinkIcon },
          { label: 'Review Text', icon: FileText },
          { label: 'AI Extraction', icon: Sparkles },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step > i + 1 ? 'bg-emerald-500 border-emerald-500 text-white' : 
                step === i + 1 ? 'border-blue-600 text-blue-600 ring-4 ring-blue-500/10' : 
                'border-slate-200 text-slate-400'
              }`}>
                {step > i + 1 ? <Check size={20} /> : <s.icon size={20} />}
              </div>
              <span className={`text-xs font-semibold ${step >= i + 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-4 ${step > i + 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: URL Input */}
      {step === 1 && (
        <div className="glass-card p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-2xl font-bold mb-2">How do you want to add the job?</h2>
          <p className="text-slate-500 mb-8">Enter the job listing URL and we'll try to scrape the details for you.</p>
          
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://company.lever.co/job/123..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
                <button
                  onClick={handleScrape}
                  disabled={!url || isLoading}
                  className="btn-primary px-8 rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Scrape'}
                </button>
              </div>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-slate-500 font-medium">Or paste manually</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all font-semibold flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              Paste Job Description Text
            </button>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Review/Paste Text */}
      {step === 2 && (
        <div className="glass-card p-10 animate-in fade-in slide-in-from-right-4 duration-300">
          <h2 className="text-2xl font-bold mb-2">Review Job Description</h2>
          <p className="text-slate-500 mb-6">Make sure the text below contains the job requirements and company info.</p>
          
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={12}
            className="w-full p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all mb-8 resize-y text-sm leading-relaxed"
            placeholder="Paste the job description here..."
          />

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 text-slate-500 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Back
            </button>
            <button
              onClick={handleExtract}
              disabled={!rawText || isLoading}
              className="btn-primary px-10 py-4 rounded-2xl shadow-lg shadow-blue-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  AI is Extracting...
                </>
              ) : (
                <>
                  Extract with AI
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review Extraction & Match Score */}
      {step === 3 && extractedData && (
        <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Data */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="glass-card p-10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{extractedData.title}</h2>
                    <div className="flex flex-wrap gap-4 text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Building2 size={18} />
                        {extractedData.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={18} />
                        {extractedData.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={18} />
                        {extractedData.type}
                      </span>
                    </div>
                  </div>
                  {extractedData.salary && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border border-blue-100 dark:border-blue-900/50">
                      <CircleDollarSign size={20} />
                      {extractedData.salary}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {extractedData.requiredSkills.map((s: string) => (
                        <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Responsibilities</h3>
                    <ul className="space-y-2">
                      {extractedData.responsibilities.slice(0, 5).map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar: Match Score */}
            <div className="lg:col-span-1">
              <div className="glass-card p-10 sticky top-8 text-center">
                <h3 className="text-lg font-bold mb-6">AI Match Score</h3>
                <div className="relative inline-flex items-center justify-center mb-6">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-slate-200 dark:text-slate-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-blue-600 transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * (matchScore || 0)) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="58"
                      cx="64"
                      cy="64"
                    />
                  </svg>
                  <span className="absolute text-4xl font-black text-blue-600">{matchScore}%</span>
                </div>
                <p className="text-sm text-slate-500 mb-8">
                  {matchScore && matchScore > 80 ? 'Excellent match! You should definitely apply.' : 
                   matchScore && matchScore > 60 ? 'Good match. Consider tailoring your CV.' : 
                   'Low match. Significant skill gaps identified.'}
                </p>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="btn-primary w-full p-5 rounded-2xl shadow-xl shadow-blue-500/20"
                >
                  {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Save Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
