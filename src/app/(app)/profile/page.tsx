import React from 'react';
import { getFullProfile } from '@/lib/profile/actions';
import ProfileClientWrapper from '@/components/profile/ProfileClientWrapper';
import { UserCircle } from 'lucide-react';
import { ProtectedPage, ProtectedPageHeader } from '@/components/layout/ProtectedPage';

export default async function ProfilePage() {
  const profileData = await getFullProfile();

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Failed to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <ProtectedPage>
      <ProtectedPageHeader
        eyebrow="Career signal"
        title="Your Profile"
        description="Keep the source of truth sharp so every match score, tailored CV, and cover letter has better raw material."
        icon={UserCircle}
      />
      <ProfileClientWrapper initialProfile={profileData} />
    </ProtectedPage>
  );
}
