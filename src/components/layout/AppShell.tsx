'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import ProfileCompletionReminder from './ProfileCompletionReminder';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullPage = pathname === '/' ||
                    pathname.startsWith('/onboarding') ||
                    pathname.startsWith('/login') || 
                    pathname.startsWith('/register') || 
                    pathname.startsWith('/forgot-password');

  if (isFullPage) {
    return (
      <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-x-hidden">
        {children}
      </main>
    );
  }

  return (
    <div className="protected-shell">
      <Sidebar />
      <main className="protected-shell__main">
        <div className="protected-shell__reminder">
          <ProfileCompletionReminder />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="protected-shell__content"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
