import React from 'react';
import { getApplications } from '@/lib/jobs/actions';
import ApplicationsView from '@/components/jobs/ApplicationsView';

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Job Applications</h1>
        <p className="text-slate-500">
          Track and manage your ongoing job applications.
        </p>
      </div>

      <div className="mt-4">
        <ApplicationsView initialApplications={applications} />
      </div>
    </div>
  );
}
