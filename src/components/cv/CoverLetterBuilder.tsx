'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface CoverLetterBuilderProps {
  applicationId: string;
  initialText?: string;
}

export default function CoverLetterBuilder({ applicationId, initialText }: CoverLetterBuilderProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [text, setText] = useState(initialText || '');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });
      const result = await res.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setText(result.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {!text ? (
        <div className="glass p-12 rounded-3xl border-slate-200 dark:border-slate-800 text-center">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={40} />
          </div>
          <h3 className="text-2xl font-black mb-2">Write a Winning Cover Letter</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Our AI will write a professional, personalized cover letter that connects your background to the company's needs.
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
                Writing Letter...
              </>
            ) : (
              <>
                Generate Cover Letter
                <Sparkles size={20} />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Tailored Cover Letter</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Regenerate
              </button>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border-slate-200 dark:border-slate-800 min-h-[500px]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-full min-h-[500px] bg-transparent border-none focus:ring-0 resize-none font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
