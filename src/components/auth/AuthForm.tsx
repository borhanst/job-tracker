'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  FileText,
  Globe,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  UserRound,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { loginSchema, registerSchema, validateWithSchema } from '@/lib/validation';

interface AuthFormProps {
  type: 'login' | 'register';
}

type AuthField = 'fullName' | 'email' | 'password';

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<AuthField, string[]>>>({});
  const router = useRouter();
  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (type === 'register') {
      const validation = validateWithSchema(registerSchema, { fullName, email, password });

      if (!validation.success) {
        setFieldErrors(validation.fieldErrors);
        setError(validation.formErrors[0] ?? null);
        return;
      }

      setIsLoading(true);

      try {
        const account = validation.data;
        const { data, error } = await supabase.auth.signUp({
          email: account.email,
          password: account.password,
          options: {
            data: {
              full_name: account.fullName,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          router.push('/onboarding');
          router.refresh();
        } else {
          setError('Check your email for the confirmation link, then continue setup from the link.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    } else {
      const validation = validateWithSchema(loginSchema, { email, password });

      if (!validation.success) {
        setFieldErrors(validation.fieldErrors);
        setError(validation.formErrors[0] ?? null);
        return;
      }

      setIsLoading(true);

      try {
        const account = validation.data;
        const { error } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password,
        });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const isRegister = type === 'register';
  const title = isRegister ? 'Build your command center' : 'Welcome back to mission control';
  const eyebrow = isRegister ? 'New workspace' : 'Secure access';
  const description = isRegister
    ? 'Create a focused workspace for tracking roles, tailoring materials, and moving applications forward.'
    : 'Return to your application pipeline, profile library, and AI-assisted job search workflow.';
  const actionLabel = isRegister ? 'Create workspace' : 'Sign in';
  const altHref = isRegister ? '/login' : '/register';
  const altPrompt = isRegister ? 'Already have an account?' : 'New to Applynexis?';
  const altLabel = isRegister ? 'Sign in' : 'Create one';
  const clearFieldError = (field: AuthField) => {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };
  const firstFieldError = (field: AuthField) => fieldErrors[field]?.[0];

  return (
    <section className="auth-shell">
      <div className="auth-backdrop" aria-hidden="true" />

      <div className="auth-stage">
        <div className="auth-panel auth-panel--form">
          <Link href="/" className="auth-brand" aria-label="Go to Applynexis home">
            <Logo size={42} />
            <span>Applynexis</span>
          </Link>

          <div className="auth-heading">
            <p>{eyebrow}</p>
            <h1>{title}</h1>
            <span>{description}</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="auth-google"
          >
            <Globe size={18} />
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or use email</span>
          </div>

          <form onSubmit={handleEmailAuth} className="auth-form" noValidate>
            {isRegister && (
              <label className="auth-field">
                <span>Full name</span>
                <div>
                  <UserRound size={18} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      clearFieldError('fullName');
                    }}
                    placeholder="Jordan Parker"
                    autoComplete="name"
                    aria-invalid={Boolean(firstFieldError('fullName'))}
                    aria-describedby={firstFieldError('fullName') ? 'auth-full-name-error' : undefined}
                  />
                </div>
                {firstFieldError('fullName') && (
                  <small id="auth-full-name-error" className="auth-field-error">
                    {firstFieldError('fullName')}
                  </small>
                )}
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div>
                <Mail size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError('email');
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(firstFieldError('email'))}
                  aria-describedby={firstFieldError('email') ? 'auth-email-error' : undefined}
                />
              </div>
              {firstFieldError('email') && (
                <small id="auth-email-error" className="auth-field-error">
                  {firstFieldError('email')}
                </small>
              )}
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-password-control">
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError('password');
                  }}
                  placeholder="Enter your password"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  aria-invalid={Boolean(firstFieldError('password'))}
                  aria-describedby={firstFieldError('password') ? 'auth-password-error' : undefined}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {firstFieldError('password') && (
                <small id="auth-password-error" className="auth-field-error">
                  {firstFieldError('password')}
                </small>
              )}
            </label>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit"
            >
              {isLoading ? (
                <Loader2 size={20} className="auth-spin" />
              ) : (
                <>
                  <span>{actionLabel}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="auth-switch">
            {altPrompt}{' '}
            <Link href={altHref}>
              {altLabel}
            </Link>
          </p>
        </div>

        <aside className="auth-panel auth-panel--visual" aria-label="Application tracking preview">
          <div className="auth-visual-topline">
            <span>Pipeline health</span>
            <strong>{isRegister ? 'Ready' : 'Live'}</strong>
          </div>

          <div className="auth-score">
            <div>
              <p>{isRegister ? '0' : '18'}</p>
              <span>{isRegister ? 'roles to add' : 'active roles'}</span>
            </div>
            <Sparkles size={28} />
          </div>

          <div className="auth-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="auth-preview-list">
            <div className="auth-preview-item is-highlighted">
              <BriefcaseBusiness size={18} />
              <div>
                <strong>Product Designer</strong>
                <span>Interview prep queued</span>
              </div>
              <CheckCircle2 size={18} />
            </div>
            <div className="auth-preview-item">
              <FileText size={18} />
              <div>
                <strong>Tailored CV</strong>
                <span>Matched to job description</span>
              </div>
              <CircleDot size={18} />
            </div>
            <div className="auth-preview-item">
              <Mail size={18} />
              <div>
                <strong>Follow-up note</strong>
                <span>Draft ready for review</span>
              </div>
              <CircleDot size={18} />
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
