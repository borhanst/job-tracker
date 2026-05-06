'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Columns3,
  Gauge,
  LayoutList,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TimerReset,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { APPLICATION_STATUSES } from '@/lib/validation';

const statuses = [...APPLICATION_STATUSES];

type ApplicationsViewMode = 'list' | 'kanban';

const APPLICATIONS_VIEW_STORAGE_KEY = 'job-tracker:applications-view';

const statusMeta: Record<string, { label: string; tone: string; marker: string }> = {
  saved: { label: 'Saved', tone: 'is-slate', marker: '#64748b' },
  applied: { label: 'Applied', tone: 'is-blue', marker: '#2563eb' },
  phone_screen: { label: 'Phone Screen', tone: 'is-indigo', marker: '#4f46e5' },
  interview: { label: 'Interview', tone: 'is-violet', marker: '#7c3aed' },
  offer: { label: 'Offer', tone: 'is-emerald', marker: '#059669' },
  accepted: { label: 'Accepted', tone: 'is-green', marker: '#16a34a' },
  rejected: { label: 'Rejected', tone: 'is-red', marker: '#dc2626' },
};

interface ApplicationsViewProps {
  initialApplications: any[];
}

export default function ApplicationsView({ initialApplications }: ApplicationsViewProps) {
  const [view, setView] = useState<ApplicationsViewMode>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const savedView = window.localStorage.getItem(APPLICATIONS_VIEW_STORAGE_KEY);

    if (savedView === 'list' || savedView === 'kanban') {
      setView(savedView);
    }
  }, []);

  const handleViewChange = (nextView: ApplicationsViewMode) => {
    setView(nextView);
    window.localStorage.setItem(APPLICATIONS_VIEW_STORAGE_KEY, nextView);
  };

  const filteredApps = initialApplications.filter(app => {
    const title = app.job_data?.title || '';
    const company = app.job_data?.company || '';
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase()) ||
                         company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = initialApplications.filter((app) => !['accepted', 'rejected'].includes(app.status)).length;
  const interviewCount = initialApplications.filter((app) => ['phone_screen', 'interview', 'offer'].includes(app.status)).length;
  const averageMatch = initialApplications.length
    ? Math.round(initialApplications.reduce((sum, app) => sum + (app.match_score || 0), 0) / initialApplications.length)
    : 0;
  const latestApplication = [...initialApplications].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  )[0];

  return (
    <section className="applications-workspace">
      <div className="applications-command">
        <div className="applications-command__copy">
          <span><Sparkles size={16} /> Pipeline desk</span>
          <h2>{filteredApps.length} tracked {filteredApps.length === 1 ? 'role' : 'roles'}</h2>
          <p>
            Sort the search, inspect match quality, and move each opportunity to the next useful action.
          </p>
        </div>

        <div className="applications-command__actions">
          <div className="applications-view-toggle" aria-label="Applications view mode">
            <button
              type="button"
              onClick={() => handleViewChange('list')}
              className={view === 'list' ? 'is-active' : ''}
              aria-pressed={view === 'list'}
            >
              <LayoutList size={18} />
              List
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('kanban')}
              className={view === 'kanban' ? 'is-active' : ''}
              aria-pressed={view === 'kanban'}
            >
              <Columns3 size={18} />
              Board
            </button>
          </div>

          <Link href="/jobs/add" className="applications-add">
            <Plus size={18} />
            Add role
          </Link>
        </div>
      </div>

      <div className="applications-metrics" aria-label="Application pipeline metrics">
        <MetricCard icon={BriefcaseBusiness} label="Total roles" value={initialApplications.length} detail="All tracked applications" tone="blue" />
        <MetricCard icon={TimerReset} label="Active" value={activeCount} detail="Not accepted or rejected" tone="amber" />
        <MetricCard icon={Target} label="In motion" value={interviewCount} detail="Screen, interview, or offer" tone="emerald" />
        <MetricCard icon={Gauge} label="Avg match" value={`${averageMatch}%`} detail={latestApplication ? `Latest: ${latestApplication.job_data?.company || 'new role'}` : 'No roles yet'} tone="violet" />
      </div>

      <div className="applications-toolbar">
        <label className="applications-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search role or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <label className="applications-filter">
          <SlidersHorizontal size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>{statusMeta[status].label}</option>
            ))}
          </select>
        </label>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="applications-list"
          >
            {filteredApps.length === 0 ? (
              <EmptyState />
            ) : (
              filteredApps.map((app) => <ApplicationRow key={app.id} app={app} />)
            )}
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="applications-board"
          >
            {statuses.map(status => {
              const statusApps = filteredApps.filter(app => app.status === status);
              const meta = statusMeta[status];

              return (
                <div key={status} className="applications-column">
                  <div className="applications-column__header">
                    <span style={{ backgroundColor: meta.marker }} />
                    <strong>{meta.label}</strong>
                    <em>{statusApps.length}</em>
                  </div>
                  
                  <div className="applications-column__body">
                    {statusApps.map(app => (
                      <ApplicationCard key={app.id} app={app} compact />
                    ))}
                    {statusApps.length === 0 && (
                      <div className="applications-column__empty">No roles here</div>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  detail: string;
  tone: string;
}) {
  return (
    <div className={`applications-metric is-${tone}`}>
      <span><Icon size={18} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <em>{detail}</em>
      </div>
    </div>
  );
}

function ApplicationRow({ app }: { app: any }) {
  return (
    <ApplicationCard app={app} />
  );
}

function ApplicationCard({ app, compact = false }: { app: any; compact?: boolean }) {
  const meta = statusMeta[app.status] || statusMeta.saved;
  const match = Math.max(0, Math.min(100, app.match_score || 0));
  const job = app.job_data || {};

  return (
    <Link href={`/applications/${app.id}`} className={`application-card ${compact ? 'is-compact' : ''}`}>
      <div className="application-card__stripe" style={{ backgroundColor: meta.marker }} />
      <div className="application-card__main">
        <div className="application-card__title-row">
          <div>
            <h3>{job.title || 'Untitled role'}</h3>
            <p><Building2 size={14} /> {job.company || 'Unknown company'}</p>
          </div>
          <span className={`application-status ${meta.tone}`}>{meta.label}</span>
        </div>

        <div className="application-card__meta">
          <span><MapPin size={14} /> {job.location || 'Location not set'}</span>
          <span><BriefcaseBusiness size={14} /> {job.type || 'Role type unknown'}</span>
          <span><CalendarClock size={14} /> {formatDate(app.created_at)}</span>
        </div>
      </div>

      <div className="application-card__score" aria-label={`${match}% match score`}>
        <div>
          <span style={{ width: `${match}%` }} />
        </div>
        <strong>{match}%</strong>
        {!compact && <em>match</em>}
      </div>

      {!compact && (
        <span className="application-card__open">
          Open <ArrowRight size={16} />
        </span>
      )}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="applications-empty">
      <span><Search size={24} /></span>
      <h3>No applications match this view</h3>
      <p>Adjust the search or status filter, or add a new role to restart the pipeline.</p>
      <Link href="/jobs/add">
        <Plus size={18} />
        Add role
      </Link>
    </div>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Date unknown';
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
