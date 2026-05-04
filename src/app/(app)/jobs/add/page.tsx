import React from 'react';
import AddJobWizard from '@/components/jobs/AddJobWizard';

export default function AddJobPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Add New Application</h1>
        <p className="text-slate-500">
          Scrape or paste a job description and let AI analyze the requirements for you.
        </p>
      </div>

      <div className="mt-8">
        <AddJobWizard />
      </div>
    </div>
  );
}
