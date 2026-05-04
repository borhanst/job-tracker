'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Sparkles, 
  Download, 
  FileText, 
  Layout, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="h-[600px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">Loading PDF Preview...</div> }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface CVBuilderProps {
  applicationId: string;
  initialData?: any;
}

export default function CVBuilder({ applicationId, initialData }: CVBuilderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any>(initialData || null);
  const [template, setTemplate] = useState<'modern' | 'classic'>('modern');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });
      const result = await res.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const TemplateComponent = template === 'modern' ? ModernTemplate : ClassicTemplate;

  return (
    <div className="flex flex-col gap-6">
      {!data ? (
        <div className="glass p-12 rounded-3xl border-slate-200 dark:border-slate-800 text-center">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles size={40} />
          </div>
          <h3 className="text-2xl font-black mb-2">Generate Your Tailored CV</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Our AI will analyze your profile and the job description to create a high-impact CV that highlights your best matches.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 justify-center">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-500/40 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Tailoring Content...
              </>
            ) : (
              <>
                Generate Now with AI
                <Sparkles size={20} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass p-6 rounded-2xl">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Choose Template</h4>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setTemplate('modern')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    template === 'modern' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  <Layout size={20} />
                  <span className="font-bold">Modern Indigo</span>
                </button>
                <button
                  onClick={() => setTemplate('classic')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    template === 'classic' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  <FileText size={20} />
                  <span className="font-bold">Classic Professional</span>
                </button>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Actions</h4>
              <PDFDownloadLink
                document={<TemplateComponent data={data} />}
                fileName={`CV_${data.application.job_data.company}_${data.profile.full_name.replace(' ', '_')}.pdf`}
                className="w-full bg-slate-900 hover:bg-black text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {({ loading }) => (
                  <>
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                    Download PDF
                  </>
                )}
              </PDFDownloadLink>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-3 p-4 border border-indigo-200 text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                Regenerate Content
              </button>
            </div>
            
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 size={18} />
              AI tailored your CV based on {data.application.job_data.title} requirements.
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="glass p-2 rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl h-[800px]">
              <PDFViewer className="w-full h-full border-none rounded-xl">
                <TemplateComponent data={data} />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
