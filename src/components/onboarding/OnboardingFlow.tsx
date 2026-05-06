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
import {
  onboardingEducationSchema,
  onboardingExperienceSchema,
  onboardingPersonalSchema,
  onboardingSkillsSchema,
  onboardingSummarySchema,
  validateWithSchema,
} from '@/lib/validation';

type StepId = 'personal' | 'summary' | 'skills' | 'background' | 'finish';
type OnboardingFieldError = Partial<Record<string, string[]>>;

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
  const [fieldErrors, setFieldErrors] = useState<OnboardingFieldError>({});
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
    setFieldErrors({});
    startTransition(async () => {
      try {
        const completion = await task();
        handleCompletion(completion.profile_completion_percentage, nextStep);
      } catch (error: any) {
        setMessage(error.message || 'Could not save this step.');
      }
    });
  };

  const setValidationErrors = (errors: OnboardingFieldError, formErrors: string[] = []) => {
    setFieldErrors(errors);
    setMessage(formErrors[0] ?? '');
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const firstFieldError = (field: string) => fieldErrors[field]?.[0];

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
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                const validation = validateWithSchema(onboardingPersonalSchema, personal);
                if (!validation.success) {
                  setValidationErrors(validation.fieldErrors, validation.formErrors);
                  return;
                }
                runStep(() => saveOnboardingPersonal(validation.data), 'summary');
              }}
            >
              <StepHeading icon={UserRound} title="Your contact baseline" />
              <Field label="Full name" error={firstFieldError('full_name')} errorId="onboarding-full-name-error">
                <input
                  value={personal.full_name}
                  onChange={(event) => {
                    setPersonal({ ...personal, full_name: event.target.value });
                    clearFieldError('full_name');
                  }}
                  aria-invalid={Boolean(firstFieldError('full_name'))}
                  aria-describedby={firstFieldError('full_name') ? 'onboarding-full-name-error' : undefined}
                />
              </Field>
              <Field label="Email">
                <input disabled value={initialProfile.email || ''} />
              </Field>
              <div className="onboarding-grid">
                <Field label="Phone" error={firstFieldError('phone')} errorId="onboarding-phone-error">
                  <input
                    value={personal.phone}
                    onChange={(event) => {
                      setPersonal({ ...personal, phone: event.target.value });
                      clearFieldError('phone');
                    }}
                    aria-invalid={Boolean(firstFieldError('phone'))}
                    aria-describedby={firstFieldError('phone') ? 'onboarding-phone-error' : undefined}
                  />
                </Field>
                <Field label="Location" error={firstFieldError('location')} errorId="onboarding-location-error">
                  <input
                    value={personal.location}
                    onChange={(event) => {
                      setPersonal({ ...personal, location: event.target.value });
                      clearFieldError('location');
                    }}
                    aria-invalid={Boolean(firstFieldError('location'))}
                    aria-describedby={firstFieldError('location') ? 'onboarding-location-error' : undefined}
                  />
                </Field>
              </div>
              <StepActions pending={isPending} />
            </form>
          )}

          {activeStep === 'summary' && (
            <form
              className="onboarding-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                const validation = validateWithSchema(onboardingSummarySchema, { summary });
                if (!validation.success) {
                  setValidationErrors(validation.fieldErrors, validation.formErrors);
                  return;
                }
                runStep(() => saveOnboardingSummary(validation.data.summary), 'skills');
              }}
            >
              <StepHeading icon={PenLine} title="A sharp professional summary" />
              <Field label="Professional summary" error={firstFieldError('summary')} errorId="onboarding-summary-error">
                <textarea
                  rows={8}
                  value={summary}
                  onChange={(event) => {
                    setSummary(event.target.value);
                    clearFieldError('summary');
                  }}
                  aria-invalid={Boolean(firstFieldError('summary'))}
                  aria-describedby={firstFieldError('summary') ? 'onboarding-summary-error' : undefined}
                />
              </Field>
              <StepActions pending={isPending} />
            </form>
          )}

          {activeStep === 'skills' && (
            <form
              className="onboarding-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                const validation = validateWithSchema(onboardingSkillsSchema, { skills });
                if (!validation.success) {
                  setValidationErrors(validation.fieldErrors, validation.formErrors);
                  return;
                }
                runStep(() => saveOnboardingSkills(validation.data.skills), 'background');
              }}
            >
              <StepHeading icon={Sparkles} title="Three skills recruiters should see first" />
              <div className="onboarding-skill-grid">
                {skills.map((skill, index) => (
                  <Field
                    key={index}
                    label={`Skill ${index + 1}`}
                    error={index === 0 ? firstFieldError('skills') : undefined}
                    errorId={index === 0 ? 'onboarding-skills-error' : undefined}
                  >
                    <input
                      value={skill}
                      onChange={(event) => {
                        const next = [...skills];
                        next[index] = event.target.value;
                        setSkills(next);
                        clearFieldError('skills');
                      }}
                      aria-invalid={Boolean(firstFieldError('skills'))}
                      aria-describedby={index === 0 && firstFieldError('skills') ? 'onboarding-skills-error' : undefined}
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
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                if (backgroundType === 'experience') {
                  const validation = validateWithSchema(onboardingExperienceSchema, experience);
                  if (!validation.success) {
                    setValidationErrors(validation.fieldErrors, validation.formErrors);
                    return;
                  }
                  runStep(() => saveOnboardingExperience(validation.data), 'finish');
                } else {
                  const validation = validateWithSchema(onboardingEducationSchema, education);
                  if (!validation.success) {
                    setValidationErrors(validation.fieldErrors, validation.formErrors);
                    return;
                  }
                  runStep(() => saveOnboardingEducation(validation.data), 'finish');
                }
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
                    <Field label="Company" error={firstFieldError('company')} errorId="onboarding-company-error">
                      <input
                        value={experience.company}
                        onChange={(event) => {
                          setExperience({ ...experience, company: event.target.value });
                          clearFieldError('company');
                        }}
                        aria-invalid={Boolean(firstFieldError('company'))}
                        aria-describedby={firstFieldError('company') ? 'onboarding-company-error' : undefined}
                      />
                    </Field>
                    <Field label="Role title" error={firstFieldError('title')} errorId="onboarding-role-title-error">
                      <input
                        value={experience.title}
                        onChange={(event) => {
                          setExperience({ ...experience, title: event.target.value });
                          clearFieldError('title');
                        }}
                        aria-invalid={Boolean(firstFieldError('title'))}
                        aria-describedby={firstFieldError('title') ? 'onboarding-role-title-error' : undefined}
                      />
                    </Field>
                  </div>
                  <Field label="Start date" error={firstFieldError('start_date')} errorId="onboarding-experience-start-error">
                    <input
                      type="date"
                      value={experience.start_date}
                      onChange={(event) => {
                        setExperience({ ...experience, start_date: event.target.value });
                        clearFieldError('start_date');
                      }}
                      aria-invalid={Boolean(firstFieldError('start_date'))}
                      aria-describedby={firstFieldError('start_date') ? 'onboarding-experience-start-error' : undefined}
                    />
                  </Field>
                  <Field label="Brief impact">
                    <textarea rows={4} value={experience.description} onChange={(event) => setExperience({ ...experience, description: event.target.value })} />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="Institution" error={firstFieldError('institution')} errorId="onboarding-institution-error">
                    <input
                      value={education.institution}
                      onChange={(event) => {
                        setEducation({ ...education, institution: event.target.value });
                        clearFieldError('institution');
                      }}
                      aria-invalid={Boolean(firstFieldError('institution'))}
                      aria-describedby={firstFieldError('institution') ? 'onboarding-institution-error' : undefined}
                    />
                  </Field>
                  <div className="onboarding-grid">
                    <Field label="Degree" error={firstFieldError('degree')} errorId="onboarding-degree-error">
                      <input
                        value={education.degree}
                        onChange={(event) => {
                          setEducation({ ...education, degree: event.target.value });
                          clearFieldError('degree');
                        }}
                        aria-invalid={Boolean(firstFieldError('degree'))}
                        aria-describedby={firstFieldError('degree') ? 'onboarding-degree-error' : undefined}
                      />
                    </Field>
                    <Field label="Field" error={firstFieldError('field')} errorId="onboarding-field-error">
                      <input
                        value={education.field}
                        onChange={(event) => {
                          setEducation({ ...education, field: event.target.value });
                          clearFieldError('field');
                        }}
                        aria-invalid={Boolean(firstFieldError('field'))}
                        aria-describedby={firstFieldError('field') ? 'onboarding-field-error' : undefined}
                      />
                    </Field>
                  </div>
                  <Field label="Start date" error={firstFieldError('start_date')} errorId="onboarding-education-start-error">
                    <input
                      type="date"
                      value={education.start_date}
                      onChange={(event) => {
                        setEducation({ ...education, start_date: event.target.value });
                        clearFieldError('start_date');
                      }}
                      aria-invalid={Boolean(firstFieldError('start_date'))}
                      aria-describedby={firstFieldError('start_date') ? 'onboarding-education-start-error' : undefined}
                    />
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

function Field({
  label,
  children,
  error,
  errorId,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  errorId?: string;
}) {
  return (
    <label className="onboarding-field">
      <span>{label}</span>
      {children}
      {error && <small id={errorId} className="onboarding-field-error">{error}</small>}
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
