import React from 'react';
import { getUserSettings } from '@/lib/settings/actions';
import SettingsForm from '@/components/settings/SettingsForm';

export default async function SettingsPage() {
  const settings = await getUserSettings();

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Failed to load settings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-500">
          Configure your AI provider and API keys for job extraction and CV generation.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
