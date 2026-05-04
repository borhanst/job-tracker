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
    <div className="flex flex-col gap-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
              isActive 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            <Icon size={20} />
            <span className="font-medium">{section.name}</span>
          </button>
        );
      })}
    </div>
  );
}
