import React from 'react';
import { getFullProfile } from '@/lib/profile/actions';
import ProfileClientWrapper from '@/components/profile/ProfileClientWrapper';

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
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-slate-500">
          Complete your profile to help AI generate highly tailored CVs and cover letters for your job applications.
        </p>
      </div>

      <ProfileClientWrapper initialProfile={profileData} />
    </div>
  );
}
