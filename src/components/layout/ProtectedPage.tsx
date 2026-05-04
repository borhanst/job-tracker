import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ProtectedPageProps {
  children: React.ReactNode;
  maxWidth?: 'default' | 'narrow' | 'wide';
}

interface ProtectedPageHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const maxWidthClass = {
  default: 'protected-page--default',
  narrow: 'protected-page--narrow',
  wide: 'protected-page--wide',
};

export function ProtectedPage({ children, maxWidth = 'default' }: ProtectedPageProps) {
  return (
    <div className={`protected-page ${maxWidthClass[maxWidth]}`}>
      {children}
    </div>
  );
}

export function ProtectedPageHeader({
  title,
  description,
  eyebrow = 'Workspace',
  icon: Icon,
  actions,
  children,
}: ProtectedPageHeaderProps) {
  return (
    <header className="protected-page-header">
      <div className="protected-page-header__content">
        <div className="protected-page-header__title-row">
          {Icon && (
            <div className="protected-page-header__icon" aria-hidden="true">
              <Icon size={22} />
            </div>
          )}
          <div>
            <p className="protected-page-header__eyebrow">{eyebrow}</p>
            <h1 className="protected-page-header__title">{title}</h1>
          </div>
        </div>
        <p className="protected-page-header__description">{description}</p>
        {children && <div className="protected-page-header__meta">{children}</div>}
      </div>
      {actions && <div className="protected-page-header__actions">{actions}</div>}
    </header>
  );
}
