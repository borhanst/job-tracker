'use client';

import React, { useState } from 'react';
import ProfileTabs from './ProfileTabs';
import PersonalInfo from './PersonalInfo';
import SummaryInfo from './SummaryInfo';
import ExperienceList from './ExperienceList';
import EducationList from './EducationList';
import ProfileSectionList from './ProfileSectionList';
import { BriefcaseBusiness, GraduationCap, Layers3, Sparkles, UserRoundCheck } from 'lucide-react';

interface ProfileClientWrapperProps {
  initialProfile: any;
}

export default function ProfileClientWrapper({ initialProfile }: ProfileClientWrapperProps) {
  const [activeSection, setActiveSection] = useState('personal');
  const completion = initialProfile.profile_completion_percentage || 0;
  const totalSignal =
    (initialProfile.workExperience?.length || 0) +
    (initialProfile.education?.length || 0) +
    (initialProfile.skills?.length || 0) +
    (initialProfile.projects?.length || 0) +
    (initialProfile.certifications?.length || 0) +
    (initialProfile.languages?.length || 0);

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfo profile={initialProfile} />;
      case 'summary':
        return <SummaryInfo profile={initialProfile} />;
      case 'experience':
        return <ExperienceList experiences={initialProfile.workExperience} />;
      case 'education':
        return <EducationList educations={initialProfile.education} />;
      case 'skills':
        return (
          <ProfileSectionList
            title="Skills"
            table="skills"
            items={initialProfile.skills}
            fields={[
              { name: 'name', label: 'Skill Name', type: 'text', placeholder: 'e.g. React.js' },
              { name: 'proficiency', label: 'Proficiency', type: 'select', options: ['beginner', 'intermediate', 'expert'] }
            ]}
            renderItem={(item) => (
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-blue-600 capitalize">{item.proficiency}</p>
              </div>
            )}
          />
        );
      case 'projects':
        return (
          <ProfileSectionList
            title="Projects"
            table="projects"
            items={initialProfile.projects}
            fields={[
              { name: 'name', label: 'Project Name', type: 'text' },
              { name: 'url', label: 'Project URL', type: 'url' },
              { name: 'description', label: 'Description', type: 'text' }
            ]}
            renderItem={(item) => (
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            )}
          />
        );
      case 'certifications':
        return (
          <ProfileSectionList
            title="Certifications"
            table="certifications"
            items={initialProfile.certifications}
            fields={[
              { name: 'name', label: 'Certification Name', type: 'text' },
              { name: 'issuer', label: 'Issuing Organization', type: 'text' },
              { name: 'issued_date', label: 'Issue Date', type: 'date' }
            ]}
            renderItem={(item) => (
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-slate-500">{item.issuer}</p>
              </div>
            )}
          />
        );
      case 'languages':
        return (
          <ProfileSectionList
            title="Languages"
            table="languages"
            items={initialProfile.languages}
            fields={[
              { name: 'name', label: 'Language', type: 'text' },
              { name: 'proficiency', label: 'Proficiency', type: 'select', options: ['basic', 'conversational', 'fluent', 'native'] }
            ]}
            renderItem={(item) => (
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-blue-600 capitalize">{item.proficiency}</p>
              </div>
            )}
          />
        );
      default:
        return <PersonalInfo profile={initialProfile} />;
    }
  };

  return (
    <section className="profile-workbench">
      <div className="profile-studio">
        <div className="profile-studio__identity">
          <div className="profile-avatar">
            {(initialProfile.full_name || initialProfile.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <span><Sparkles size={15} /> Profile source</span>
            <h2>{initialProfile.full_name || 'Your career profile'}</h2>
            <p>{initialProfile.summary || 'Build the baseline profile your tailored CVs and cover letters will use.'}</p>
          </div>
        </div>

        <div className="profile-studio__metrics" aria-label="Profile metrics">
          <div>
            <UserRoundCheck size={18} />
            <strong>{completion}%</strong>
            <span>complete</span>
          </div>
          <div>
            <BriefcaseBusiness size={18} />
            <strong>{initialProfile.workExperience?.length || 0}</strong>
            <span>roles</span>
          </div>
          <div>
            <GraduationCap size={18} />
            <strong>{initialProfile.education?.length || 0}</strong>
            <span>education</span>
          </div>
          <div>
            <Layers3 size={18} />
            <strong>{totalSignal}</strong>
            <span>signals</span>
          </div>
        </div>
      </div>

      <div className="profile-layout">
        <aside className="profile-layout__nav">
          <ProfileTabs activeSection={activeSection} setActiveSection={setActiveSection} />
        </aside>
        <div className="profile-layout__content">
          {renderSection()}
        </div>
      </div>
    </section>
  );
}
