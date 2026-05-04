import React from 'react';
import { getApplicationById } from '@/lib/jobs/actions';
import JobDetailView from '@/components/jobs/JobDetailView';
import { notFound } from 'next/navigation';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (!application) {
    notFound();
  }

  return <JobDetailView application={application} />;
}
