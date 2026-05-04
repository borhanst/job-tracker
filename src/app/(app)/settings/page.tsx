import React from 'react';
import { getUserSettings } from '@/lib/settings/actions';
import SettingsForm from '@/components/settings/SettingsForm';
import { Settings } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';

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
    <ProtectedPage maxWidth="narrow">
      <ProtectedPageHeader
        eyebrow="System"
        title="Settings"
        description="Configure your AI provider and encrypted API keys for extraction, CV generation, and cover letters."
        icon={Settings}
      />
      <SettingsForm initialSettings={settings} />
    </ProtectedPage>
  );
}
