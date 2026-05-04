import React from 'react';
import { getApplicationById } from '@/lib/jobs/actions';
import JobDetailView from '@/components/jobs/JobDetailView';
import { notFound } from 'next/navigation';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const application = await getApplicationById(params.id);

  if (!application) {
    notFound();
  }

  return <JobDetailView application={application} />;
}
