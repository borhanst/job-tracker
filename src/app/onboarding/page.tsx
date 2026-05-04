import { redirect } from 'next/navigation';
import { getFullProfile } from '@/lib/profile/actions';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default async function OnboardingPage() {
  const profile = await getFullProfile();

  if (!profile) {
    redirect('/login');
  }

  return <OnboardingFlow initialProfile={profile} />;
}
