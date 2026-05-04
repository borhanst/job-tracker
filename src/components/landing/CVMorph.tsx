'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export default function CVMorph() {
  const [isTailored, setIsTailored] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTailored(prev => !prev);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const masterData = [
    { title: "Software Engineer", desc: "Built web apps with React. Worked in a team environment." },
    { title: "Project Manager", desc: "Coordinated tasks and deadlines for various teams." }
  ];

  const tailoredData = [
    { title: "Senior AI Engineer", desc: "Architected AI-driven React interfaces with 99.9% uptime." },
    { title: "AI Product Lead", desc: "Managed end-to-end AI lifecycles and strategic roadmaps." }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm mb-4 uppercase tracking-widest">
              <Sparkles size={18} />
              <span>Tailored by Intelligence</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Your CV, optimized for <br />
              <span className="text-gradient">every application.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
              Applynexis analyzes your master profile and the job description to highlight exactly what recruiters are looking for. Stand out with zero effort.
            </p>
            <div className="space-y-4">
              {['10x higher match rate', 'AI-driven keyword optimization', 'Beautiful PDF templates'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 shadow-2xl shadow-blue-500/10 min-h-[400px]">
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                    <FileText size={20} />
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{isTailored ? 'Tailored CV Version' : 'Master Source Profile'}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isTailored ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {isTailored ? '98% MATCH' : 'SCANNING...'}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isTailored ? 'tailored' : 'master'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {(isTailored ? tailoredData : masterData).map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
