'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Loader2,
  PenLine,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { skipOnboarding } from '@/lib/profile/actions';
import {
  saveOnboardingEducation,
  saveOnboardingExperience,
  saveOnboardingPersonal,
  saveOnboardingSkills,
  saveOnboardingSummary,
} from '@/lib/onboarding/actions';

type StepId = 'personal' | 'summary' | 'skills' | 'background' | 'finish';

type OnboardingFlowProps = {
  initialProfile: any;
};

const steps: { id: StepId; label: string; icon: React.ElementType }[] = [
  { id: 'personal', label: 'Identity', icon: UserRound },
  { id: 'summary', label: 'Summary', icon: PenLine },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'background', label: 'Background', icon: BriefcaseBusiness },
];

function hasValue(value: string | null | undefined) {
  return Boolean(value && value.trim().length > 0);
}

function firstIncompleteStep(profile: any): StepId {
  if (!hasValue(profile.full_name) || !hasValue(profile.phone) || !hasValue(profile.location)) return 'personal';
  if (!hasValue(profile.summary)) return 'summary';
  if ((profile.skills?.length || 0) < 3) return 'skills';
  if ((profile.workExperience?.length || 0) === 0 && (profile.education?.length || 0) === 0) return 'background';
  return 'finish';
}

export default function OnboardingFlow({ initialProfile }: OnboardingFlowProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<StepId>(() => firstIncompleteStep(initialProfile));
  const [percentage, setPercentage] = useState(initialProfile.profile_completion_percentage || 0);
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const [personal, setPersonal] = useState({
    full_name: initialProfile.full_name || '',
    phone: initialProfile.phone || '',
    location: initialProfile.location || '',
  });
  const [summary, setSummary] = useState(initialProfile.summary || '');
  const [skills, setSkills] = useState<string[]>(() => {
    const existing = (initialProfile.skills || []).map((skill: any) => skill.name).filter(Boolean);
    return [...existing, '', '', ''].slice(0, Math.max(3, existing.length));
  });
  const [backgroundType, setBackgroundType] = useState<'experience' | 'education'>('experience');
  const [experience, setExperience] = useState({
    company: '',
    title: '',
    start_date: '',
    description: '',
  });
  const [education, setEducation] = useState({
    institution: '',
    degree: '',
    field: '',
    start_date: '',
  });

  const activeIndex = useMemo(() => {
    const index = steps.findIndex((step) => step.id === activeStep);
    return index === -1 ? steps.length : index;
  }, [activeStep]);

  const handleCompletion = (nextPercentage: number, nextStep: StepId) => {
    setPercentage(nextPercentage);
    setMessage('');
    setActiveStep(nextStep);
    router.refresh();
  };

  const runStep = (task: () => Promise<{ profile_completion_percentage: number }>, nextStep: StepId) => {
    setMessage('');
    startTransition(async () => {
      try {
        const completion = await task();
        handleCompletion(completion.profile_completion_percentage, nextStep);
      } catch (error: any) {
        setMessage(error.message || 'Could not save this step.');
      }
    });
  };

  const continueToDashboard = () => {
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <main className="onboarding-shell">
      <header className="onboarding-topbar">
        <div className="onboarding-brand">
          <Logo size={36} />
          <span>Applynexis</span>
        </div>
        <form action={skipOnboarding}>
          <button className="onboarding-skip" type="submit">Skip for now</button>
        </form>
      </header>

      <section className="onboarding-stage">
        <aside className="onboarding-rail">
          <div>
            <p className="onboarding-kicker">Master Profile</p>
            <h1>Build the source profile for every tailored application.</h1>
          </div>

          <div className="onboarding-meter" aria-label={`Profile ${percentage}% complete`}>
            <div className="onboarding-meter__label">
              <span>{percentage}%</span>
              <small>complete</small>
            </div>
            <div className="onboarding-meter__track">
              <div style={{ width: `${percentage}%` }} />
            </div>
          </div>

          <ol className="onboarding-steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === step.id;
              const isDone = index < activeIndex || activeStep === 'finish';

              return (
                <li key={step.id} className={isActive ? 'is-active' : isDone ? 'is-done' : ''}>
                  <span>{isDone ? <Check size={17} /> : <Icon size={17} />}</span>
                  {step.label}
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="onboarding-panel">
          {message && <p className="onboarding-error">{message}</p>}

          {activeStep === 'personal' && (
            <form
              className="onboarding-form"
              onSubmit={(event) => {
                event.preventDefault();
                runStep(() => saveOnboardingPersonal(personal), 'summary');
              }}
            >
              <StepHeading icon={UserRound} title="Your contact baseline" />
              <Field label="Full name">
                <input required value={personal.full_name} onChange={(event) => setPersonal({ ...personal, full_name: event.target.value })} />
              </Field>
              <Field label="Email">
                <input disabled value={initialProfile.email || ''} />
              </Field>
              <div className="onboarding-grid">
                <Field label="Phone">
                  <input required value={personal.phone} onChange={(event) => setPersonal({ ...personal, phone: event.target.value })} />
                </Field>
                <Field label="Location">
                  <input required value={personal.location} onChange={(event) => setPersonal({ ...personal, location: event.target.value })} />
                </Field>
              </div>
              <StepActions pending={isPending} />
            </form>
          )}

          {activeStep === 'summary' && (
            <form
              className="onboarding-form"
              onSubmit={(event) => {
                event.preventDefault();
                runStep(() => saveOnboardingSummary(summary), 'skills');
              }}
            >
              <StepHeading icon={PenLine} title="A sharp professional summary" />
              <Field label="Professional summary">
                <textarea required rows={8} value={summary} onChange={(event) => setSummary(event.target.value)} />
              </Field>
              <StepActions pending={isPending} />
            </form>
          )}

          {activeStep === 'skills' && (
            <form
              className="onboarding-form"
              onSubmit={(event) => {
                event.preventDefault();
                runStep(() => saveOnboardingSkills(skills), 'background');
              }}
            >
              <StepHeading icon={Sparkles} title="Three skills recruiters should see first" />
              <div className="onboarding-skill-grid">
                {skills.map((skill, index) => (
                  <Field key={index} label={`Skill ${index + 1}`}>
                    <input
                      required={index < 3}
                      value={skill}
                      onChange={(event) => {
                        const next = [...skills];
                        next[index] = event.target.value;
                        setSkills(next);
                      }}
                    />
                  </Field>
                ))}
              </div>
              <button type="button" className="onboarding-secondary" onClick={() => setSkills([...skills, ''])}>
                Add another skill
              </button>
              <StepActions pending={isPending} />
            </form>
          )}

          {activeStep === 'background' && (
            <form
              className="onboarding-form"
              onSubmit={(event) => {
                event.preventDefault();
                runStep(
                  () => backgroundType === 'experience'
                    ? saveOnboardingExperience(experience)
                    : saveOnboardingEducation(education),
                  'finish',
                );
              }}
            >
              <StepHeading icon={ShieldCheck} title="One proof point for your background" />
              <div className="onboarding-toggle" role="tablist" aria-label="Background type">
                <button type="button" className={backgroundType === 'experience' ? 'is-active' : ''} onClick={() => setBackgroundType('experience')}>
                  <BriefcaseBusiness size={18} /> Work
                </button>
                <button type="button" className={backgroundType === 'education' ? 'is-active' : ''} onClick={() => setBackgroundType('education')}>
                  <GraduationCap size={18} /> Education
                </button>
              </div>

              {backgroundType === 'experience' ? (
                <>
                  <div className="onboarding-grid">
                    <Field label="Company">
                      <input required value={experience.company} onChange={(event) => setExperience({ ...experience, company: event.target.value })} />
                    </Field>
                    <Field label="Role title">
                      <input required value={experience.title} onChange={(event) => setExperience({ ...experience, title: event.target.value })} />
                    </Field>
                  </div>
                  <Field label="Start date">
                    <input required type="date" value={experience.start_date} onChange={(event) => setExperience({ ...experience, start_date: event.target.value })} />
                  </Field>
                  <Field label="Brief impact">
                    <textarea rows={4} value={experience.description} onChange={(event) => setExperience({ ...experience, description: event.target.value })} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Institution">
                    <input required value={education.institution} onChange={(event) => setEducation({ ...education, institution: event.target.value })} />
                  </Field>
                  <div className="onboarding-grid">
                    <Field label="Degree">
                      <input required value={education.degree} onChange={(event) => setEducation({ ...education, degree: event.target.value })} />
                    </Field>
                    <Field label="Field">
                      <input required value={education.field} onChange={(event) => setEducation({ ...education, field: event.target.value })} />
                    </Field>
                  </div>
                  <Field label="Start date">
                    <input required type="date" value={education.start_date} onChange={(event) => setEducation({ ...education, start_date: event.target.value })} />
                  </Field>
                </>
              )}
              <StepActions pending={isPending} />
            </form>
          )}

          {activeStep === 'finish' && (
            <div className="onboarding-finish">
              <span className="onboarding-finish__mark"><Check size={28} /></span>
              <h2>Your Master Profile baseline is ready.</h2>
              <p>Applynexis can now use your profile for stronger Match Scores and tailored documents.</p>
              <button type="button" className="btn-primary onboarding-submit" onClick={continueToDashboard}>
                Continue to dashboard <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StepHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="onboarding-heading">
      <span><Icon size={22} /></span>
      <h2>{title}</h2>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="onboarding-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function StepActions({ pending }: { pending: boolean }) {
  return (
    <div className="onboarding-actions">
      <button type="submit" disabled={pending} className="btn-primary onboarding-submit">
        {pending ? <Loader2 size={18} className="animate-spin" /> : <>Save and continue <ArrowRight size={18} /></>}
      </button>
    </div>
  );
}
