'use server';

import { createClient } from '@/lib/supabase/server';

const APPLICATION_STATUSES = [
  'saved',
  'applied',
  'phone_screen',
  'interview',
  'offer',
  'accepted',
  'rejected',
] as const;

type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

type DashboardApplication = {
  id: string;
  status: ApplicationStatus | string | null;
  match_score: number | null;
  created_at: string | null;
  applied_date: string | null;
  follow_up_date: string | null;
  job_data: {
    title?: string;
    company?: string;
    location?: string;
  } | null;
};

function toDateKey(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function buildActivityData(applications: DashboardApplication[]) {
  const dayCount = 14;
  const createdDates = applications
    .map((application) => application.created_at)
    .filter((createdAt): createdAt is string => Boolean(createdAt))
    .map((createdAt) => new Date(createdAt))
    .filter((date) => !Number.isNaN(date.getTime()));

  const today = new Date();
  const latestActivityDate = createdDates.length
    ? new Date(Math.max(...createdDates.map((date) => date.getTime())))
    : today;
  const anchorDate = latestActivityDate > today ? today : latestActivityDate;
  const startDate = addDays(anchorDate, -(dayCount - 1));

  const countsByDate = applications.reduce<Record<string, number>>((counts, application) => {
    const dateKey = toDateKey(application.created_at);

    if (dateKey) {
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    }

    return counts;
  }, {});

  return Array.from({ length: dayCount }, (_, index) => {
    const date = addDays(startDate, index);
    const dateKey = date.toISOString().slice(0, 10);

    return {
      date: dateKey,
      count: countsByDate[dateKey] || 0,
    };
  });
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: applications, error } = await supabase
    .from('applications')
    .select('id, status, match_score, created_at, applied_date, follow_up_date, job_data')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }

  const userApplications = (applications || []) as DashboardApplication[];
  const total = userApplications.length;
  const interviews = userApplications.filter(a => a.status === 'interview' || a.status === 'phone_screen').length;
  const offers = userApplications.filter(a => a.status === 'offer' || a.status === 'accepted').length;
  const avgMatchScore = total > 0 
    ? Math.round(userApplications.reduce((acc, a) => acc + (a.match_score || 0), 0) / total)
    : 0;

  const statusCounts = APPLICATION_STATUSES.reduce<Record<ApplicationStatus, number>>((counts, status) => {
    counts[status] = 0;
    return counts;
  }, {} as Record<ApplicationStatus, number>);

  userApplications.forEach((application) => {
    const status = application.status;

    if (status && status in statusCounts) {
      statusCounts[status as ApplicationStatus] += 1;
    }
  });

  const matchScoreData = [
    { label: 'Strong', range: '80-100', count: userApplications.filter(a => (a.match_score || 0) >= 80).length },
    { label: 'Good', range: '60-79', count: userApplications.filter(a => (a.match_score || 0) >= 60 && (a.match_score || 0) < 80).length },
    { label: 'Needs work', range: '0-59', count: userApplications.filter(a => (a.match_score || 0) < 60).length },
  ];

  const nextFollowUps = userApplications
    .filter((application) => Boolean(application.follow_up_date))
    .sort((left, right) => {
      const leftTime = new Date(left.follow_up_date || '').getTime();
      const rightTime = new Date(right.follow_up_date || '').getTime();

      return leftTime - rightTime;
    })
    .slice(0, 3);

  const recentApplications = userApplications.slice(0, 5).map((application) => ({
    id: application.id,
    title: application.job_data?.title || 'Untitled role',
    company: application.job_data?.company || 'Unknown company',
    status: application.status || 'saved',
    matchScore: application.match_score || 0,
    createdAt: application.created_at,
    appliedDate: application.applied_date,
    followUpDate: application.follow_up_date,
  }));

  const followUps = nextFollowUps.map((application) => ({
    id: application.id,
    title: application.job_data?.title || 'Untitled role',
    company: application.job_data?.company || 'Unknown company',
    followUpDate: application.follow_up_date,
  }));

  const applied = userApplications.filter((application) => {
    return application.status !== 'saved';
  }).length;

  const active = userApplications.filter((application) => {
    return application.status !== 'accepted' && application.status !== 'rejected';
  }).length;

  const activityData = buildActivityData(userApplications);

  const activityWindowLabel = activityData.length > 0
    ? `${activityData[0].date} to ${activityData[activityData.length - 1].date}`
    : '';

  return {
    total,
    applied,
    active,
    interviews,
    offers,
    avgMatchScore,
    statusCounts,
    matchScoreData,
    activityData,
    activityWindowLabel,
    recentApplications,
    followUps,
  };
}
