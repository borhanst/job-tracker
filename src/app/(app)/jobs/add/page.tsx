import React from 'react';
import AddJobWizard from '@/components/jobs/AddJobWizard';
import { PlusCircle } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';

type AddJobPageProps = {
  searchParams: Promise<{
    handoff?: string | string[];
  }>;
};

export default async function AddJobPage({ searchParams }: AddJobPageProps) {
  const { handoff } = await searchParams;
  const handoffId = Array.isArray(handoff) ? handoff[0] : handoff;

  return (
    <ProtectedPage>
      <ProtectedPageHeader
        eyebrow="New opportunity"
        title="Add New Application"
        description="Bring in a listing, let AI extract the role details, then save the application with a first-pass match score."
        icon={PlusCircle}
      />
      <AddJobWizard initialHandoffId={handoffId} />
    </ProtectedPage>
  );
}
