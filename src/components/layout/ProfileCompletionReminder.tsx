'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type CompletionState = {
  profile_completion_percentage: number;
  profile_completed: boolean;
};

export default function ProfileCompletionReminder() {
  const pathname = usePathname();
  const [completion, setCompletion] = useState<CompletionState | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCompletion() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('profile_completion_percentage, profile_completed')
        .eq('user_id', user.id)
        .single();

      if (!isMounted || error || !data) return;
      setCompletion(data as CompletionState);
    }

    setDismissed(false);
    loadCompletion();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (!completion || completion.profile_completed || dismissed) return null;

  return (
    <div className="profile-reminder" role="status">
      <div className="profile-reminder__meter" aria-hidden="true">
        <span>{completion.profile_completion_percentage}%</span>
        <div>
          <i style={{ width: `${completion.profile_completion_percentage}%` }} />
        </div>
      </div>
      <div className="profile-reminder__copy">
        <strong>Complete your Master Profile</strong>
        <p>Better profile data improves Match Scores and tailored documents.</p>
      </div>
      <div className="profile-reminder__actions">
        <Link href="/onboarding">
          Continue setup <ArrowRight size={16} />
        </Link>
        <button type="button" aria-label="Dismiss profile reminder" onClick={() => setDismissed(true)}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
