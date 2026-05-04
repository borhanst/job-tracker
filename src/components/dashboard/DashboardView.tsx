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
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

const COLORS = ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#3B82F6'];

interface DashboardViewProps {
  stats: any;
}

export default function DashboardView({ stats }: DashboardViewProps) {
  const pieData = Object.entries(stats.statusCounts).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Applications', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Interviews', value: stats.interviews, icon: PhoneCall, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Offers', value: stats.offers, icon: Trophy, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Avg Match Score', value: `${stats.avgMatchScore}%`, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-bold mb-8">Recent Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-1 glass-card p-8">
          <h3 className="text-xl font-bold mb-8">Status Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent List Placeholder */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">Quick Links</h3>
          <Link href="/applications" className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
            View All <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/jobs/add" className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl text-white group hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20">
            <p className="font-bold text-xl mb-1">Add New Job</p>
            <p className="text-blue-50 text-sm opacity-90">Start tracking a new application with AI.</p>
          </Link>
          <Link href="/profile" className="p-8 bg-slate-900 rounded-3xl text-white group hover:scale-[1.02] transition-all">
            <p className="font-bold text-xl mb-1">Update Profile</p>
            <p className="text-slate-400 text-sm opacity-90">Improve your match scores by adding details.</p>
          </Link>
          <Link href="/settings" className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl group hover:scale-[1.02] transition-all">
            <p className="font-bold text-xl mb-1">AI Settings</p>
            <p className="text-slate-500 text-sm opacity-90">Switch models or update your API keys.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
