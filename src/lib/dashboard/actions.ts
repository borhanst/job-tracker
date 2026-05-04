'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: applications, error } = await supabase
    .from('applications')
    .select('status, match_score, created_at')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }

  const total = applications.length;
  const interviews = applications.filter(a => a.status === 'interview' || a.status === 'phone_screen').length;
  const offers = applications.filter(a => a.status === 'offer' || a.status === 'accepted').length;
  const avgMatchScore = total > 0 
    ? Math.round(applications.reduce((acc, a) => acc + (a.match_score || 0), 0) / total) 
    : 0;

  // Group by status for charts
  const statusCounts = applications.reduce((acc: any, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  // Group by date for activity chart (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const activityData = last7Days.map(date => ({
    date,
    count: applications.filter(a => a.created_at.startsWith(date)).length
  }));

  return {
    total,
    interviews,
    offers,
    avgMatchScore,
    statusCounts,
    activityData,
    recentApplications: applications.slice(0, 5) // Simple recent list
  };
}
