import { getDashboardStats } from '@/lib/dashboard/actions';
import DashboardView from '@/components/dashboard/DashboardView';
import { redirect } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  if (stats === null) {
    // If getDashboardStats returns null, it usually means no user is found
    // or there was a critical database error.
    redirect('/login');
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-full text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 className="text-xl font-semibold">Unable to Load Dashboard</h2>
        <p className="text-slate-500 max-w-md">
          We encountered an error while fetching your dashboard data. 
          Please make sure your database tables are correctly initialized.
        </p>
      </div>
    );
  }

  return (
    <ProtectedPage maxWidth="wide">
      <ProtectedPageHeader
        eyebrow="Command center"
        title="Dashboard"
        description="Welcome back. Track the shape of your job hunt, spot momentum, and jump into the next best action."
        icon={LayoutDashboard}
      />
      <DashboardView stats={stats} />
    </ProtectedPage>
  );
}
