'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Briefcase, 
  PhoneCall, 
  Trophy, 
  Target,
  ArrowUpRight,
  Clock,
  ListChecks,
  Plus
} from 'lucide-react';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  saved: '#64748B',
  applied: '#2563EB',
  phone_screen: '#4F46E5',
  interview: '#7C3AED',
  offer: '#10B981',
  accepted: '#059669',
  rejected: '#F43F5E',
};

const STATUS_LABELS: Record<string, string> = {
  saved: 'Saved',
  applied: 'Applied',
  phone_screen: 'Phone screen',
  interview: 'Interview',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

type ActivityDatum = {
  date: string;
  count: number;
};

type StatusCounts = Record<string, number>;

type RecentApplication = {
  id: string;
  title: string;
  company: string;
  status: string;
  matchScore: number;
  createdAt: string | null;
  appliedDate: string | null;
  followUpDate: string | null;
};

type FollowUp = {
  id: string;
  title: string;
  company: string;
  followUpDate: string | null;
};

type DashboardStats = {
  total: number;
  applied: number;
  active: number;
  interviews: number;
  offers: number;
  avgMatchScore: number;
  statusCounts: StatusCounts;
  matchScoreData: Array<{ label: string; range: string; count: number }>;
  activityData: ActivityDatum[];
  activityWindowLabel: string;
  recentApplications: RecentApplication[];
  followUps: FollowUp[];
};

interface DashboardViewProps {
  stats: DashboardStats;
}

export default function DashboardView({ stats }: DashboardViewProps) {
  const statusData = Object.entries(stats.statusCounts)
    .map(([status, value]) => ({
      status,
      name: STATUS_LABELS[status] || status.replace('_', ' '),
      value,
    }))
    .filter((entry) => entry.value > 0);
  const hasActivity = stats.activityData.some((entry) => entry.count > 0);
  const hasStatusData = statusData.length > 0;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-stat-grid">
        {[
          { label: 'Total Applications', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Active Pipeline', value: stats.active, icon: ListChecks, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Interviews', value: stats.interviews, icon: PhoneCall, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Offers', value: stats.offers, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card dashboard-stat-card">
            <div>
              <p className="dashboard-stat-card__label">{stat.label}</p>
              <p className="dashboard-stat-card__value">{stat.value}</p>
            </div>
            <div className={`dashboard-stat-card__icon ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-chart-grid">
        <section className="glass-card dashboard-panel dashboard-panel--wide">
          <div className="dashboard-panel__header">
            <div>
              <h3>Application Activity</h3>
              <p>{stats.activityWindowLabel}</p>
            </div>
            <span>{stats.applied} sent</span>
          </div>
          <div className="dashboard-chart">
            {hasActivity ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(val) => formatDate(val)}
                  />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    labelFormatter={(val) => formatDate(String(val), 'long')}
                    contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 18px 40px -28px rgb(15 23 42 / 0.65)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" name="Applications added" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart title="No applications yet" />
            )}
          </div>
        </section>

        <section className="glass-card dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h3>Status Breakdown</h3>
              <p>Current pipeline shape</p>
            </div>
          </div>
          <div className="dashboard-chart dashboard-chart--compact">
            {hasStatusData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#2563EB'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart title="No status data" />
            )}
          </div>
          <div className="dashboard-legend">
            {statusData.map((entry) => (
              <div key={entry.status} className="dashboard-legend__item">
                <span style={{ backgroundColor: STATUS_COLORS[entry.status] || '#2563EB' }} />
                <strong>{entry.name}</strong>
                <em>{entry.value}</em>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-detail-grid">
        <section className="glass-card dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h3>Recent Applications</h3>
              <p>Latest saved roles</p>
            </div>
            <Link href="/applications" className="dashboard-panel__link">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="dashboard-list">
            {stats.recentApplications.length > 0 ? (
              stats.recentApplications.map((application) => (
                <Link key={application.id} href={`/applications/${application.id}`} className="dashboard-list__item">
                  <div>
                    <strong>{application.title}</strong>
                    <span>{application.company}</span>
                  </div>
                  <div className="dashboard-list__meta">
                    <span>{application.matchScore}%</span>
                    <em>{STATUS_LABELS[application.status] || application.status}</em>
                  </div>
                </Link>
              ))
            ) : (
              <div className="dashboard-empty-list">
                <Briefcase size={22} />
                <p>No applications have been saved yet.</p>
              </div>
            )}
          </div>
        </section>

        <section className="glass-card dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h3>Follow Ups</h3>
              <p>Next dated reminders</p>
            </div>
            <Clock size={18} />
          </div>
          <div className="dashboard-list">
            {stats.followUps.length > 0 ? (
              stats.followUps.map((followUp) => (
                <Link key={followUp.id} href={`/applications/${followUp.id}`} className="dashboard-list__item">
                  <div>
                    <strong>{followUp.title}</strong>
                    <span>{followUp.company}</span>
                  </div>
                  <div className="dashboard-list__meta">
                    <span>{formatDate(followUp.followUpDate || '')}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="dashboard-empty-list">
                <Clock size={22} />
                <p>No follow-up dates are set.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="glass-card dashboard-panel">
        <div className="dashboard-panel__header">
          <div>
            <h3>Quick Actions</h3>
            <p>Keep the tracker moving</p>
          </div>
        </div>
        <div className="dashboard-actions">
          <Link href="/jobs/add" className="dashboard-action dashboard-action--primary">
            <Plus size={20} />
            <div>
              <strong>Add New Job</strong>
              <span>Track a new application with AI.</span>
            </div>
          </Link>
          <Link href="/profile" className="dashboard-action">
            <Target size={20} />
            <div>
              <strong>Update Profile</strong>
              <span>Improve match scores with better context.</span>
            </div>
          </Link>
          <Link href="/settings" className="dashboard-action">
            <ListChecks size={20} />
            <div>
              <strong>AI Settings</strong>
              <span>Switch models or update provider keys.</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

function EmptyChart({ title }: { title: string }) {
  return (
    <div className="dashboard-empty-chart">
      <Briefcase size={24} />
      <p>{title}</p>
    </div>
  );
}

function formatDate(value: string, dateStyle: 'short' | 'long' = 'short') {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, dateStyle === 'long'
    ? { month: 'long', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric' });
}
