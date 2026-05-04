import React from 'react';
import AddJobWizard from '@/components/jobs/AddJobWizard';
import { PlusCircle } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';

export default function AddJobPage() {
  return (
    <ProtectedPage>
      <ProtectedPageHeader
        eyebrow="New opportunity"
        title="Add New Application"
        description="Bring in a listing, let AI extract the role details, then save the application with a first-pass match score."
        icon={PlusCircle}
      />
      <AddJobWizard />
    </ProtectedPage>
  );
}
