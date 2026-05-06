'use client';

import React from 'react';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Code, 
  FolderGit2, 
  Award, 
  Languages 
} from 'lucide-react';

const sections = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'experience', name: 'Work Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'skills', name: 'Skills', icon: Code },
  { id: 'projects', name: 'Projects', icon: FolderGit2 },
  { id: 'certifications', name: 'Certifications', icon: Award },
  { id: 'languages', name: 'Languages', icon: Languages },
];

interface ProfileTabsProps {
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export default function ProfileTabs({ activeSection, setActiveSection }: ProfileTabsProps) {
  return (
    <nav className="profile-tabs" aria-label="Profile sections">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`profile-tab ${isActive ? 'is-active' : ''}`}
            type="button"
            aria-current={isActive ? 'page' : undefined}
          >
            <span><Icon size={19} /></span>
            <strong>{section.name}</strong>
          </button>
        );
      })}
    </nav>
  );
}
