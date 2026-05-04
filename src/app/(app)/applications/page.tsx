import React from 'react';
import { getApplications } from '@/lib/jobs/actions';
import ApplicationsView from '@/components/jobs/ApplicationsView';
import { Briefcase } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';

export default async function ApplicationsPage() {
  const applications = await getApplications();

  return (
    <ProtectedPage maxWidth="wide">
      <ProtectedPageHeader
        eyebrow="Pipeline"
        title="Job Applications"
        description="Scan your active roles, filter by status, and keep each opportunity moving with the right follow-up."
        icon={Briefcase}
      />
      <ApplicationsView initialApplications={applications} />
    </ProtectedPage>
  );
}
