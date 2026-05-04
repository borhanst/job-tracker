'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutList, 
  Columns3, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Building2, 
  MapPin, 
  ArrowUpRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statuses = [
  'saved', 'applied', 'phone_screen', 'interview', 'offer', 'accepted', 'rejected'
];

const statusColors: Record<string, string> = {
  saved: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  applied: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  phone_screen: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  interview: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  offer: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  accepted: 'bg-emerald-600 text-white',
  rejected: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

interface ApplicationsViewProps {
  initialApplications: any[];
}

export default function ApplicationsView({ initialApplications }: ApplicationsViewProps) {
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApps = initialApplications.filter(app => {
    const matchesSearch = app.job_data.title.toLowerCase().includes(search.toLowerCase()) || 
                         app.job_data.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
          <button
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutList size={18} />
            List
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'kanban' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns3 size={18} />
            Kanban
          </button>
        </div>

        <div className="flex flex-1 md:max-w-md items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by company or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            {statuses.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
          </select>
          <Link
            href="/jobs/add"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all shrink-0"
          >
            <Plus size={20} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card overflow-hidden"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500">Job</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500">Match</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500">Added</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {app.job_data.title}
                          </span>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Building2 size={14} /> {app.job_data.company}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${statusColors[app.status]}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" 
                              style={{ width: `${app.match_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{app.match_score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/applications/${app.id}`}
                          className="p-2 text-slate-400 hover:text-blue-600 rounded-lg inline-block"
                        >
                          <ArrowUpRight size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
          >
            {statuses.map(status => {
              const statusApps = filteredApps.filter(app => app.status === status);
              return (
                <div key={status} className="flex-shrink-0 w-[300px] flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusColors[status].split(' ')[0]}`} />
                      {status.replace('_', ' ')}
                    </h3>
                    <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {statusApps.length}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-3 min-h-[500px]">
                    {statusApps.map(app => (
                      <Link 
                        key={app.id} 
                        href={`/applications/${app.id}`}
                        className="glass-card p-4 hover:border-blue-500 dark:hover:border-blue-600 transition-all group"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-sm leading-tight group-hover:text-blue-600 transition-colors">
                              {app.job_data.title}
                            </span>
                            <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                              {app.match_score}%
                            </span>
                          </div>
                          <div className="flex flex-col gap-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Building2 size={12} /> {app.job_data.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} /> {app.job_data.location}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {statusApps.length === 0 && (
                      <div className="flex-1 border-2 border-dashed border-slate-200 dark:border-slate-900 rounded-2xl" />
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
