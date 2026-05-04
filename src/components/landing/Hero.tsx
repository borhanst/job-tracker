'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-8 border border-blue-200 dark:border-blue-800"
          >
            <CheckCircle size={16} />
            <span>AI-POWERED CAREER ACCELERATOR</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight"
          >
            Track. Manage. <br />
            <span className="text-gradient">Land Your Dream Job.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            The all-in-one platform for modern job seekers. Automate tracking, generate AI-optimized CVs, and get hired faster with Applynexis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/register" className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20">
              Get Started for Free <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center">
              Sign In
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-400/10 blur-[100px] rounded-full -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-400/10 blur-[100px] rounded-full -translate-y-1/2" />
    </section>
  );
}
