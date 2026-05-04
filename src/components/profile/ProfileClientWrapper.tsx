'use client';

import React, { useState } from 'react';
import ProfileTabs from './ProfileTabs';
import PersonalInfo from './PersonalInfo';
import SummaryInfo from './SummaryInfo';
import ExperienceList from './ExperienceList';
import EducationList from './EducationList';
import ProfileSectionList from './ProfileSectionList';

interface ProfileClientWrapperProps {
  initialProfile: any;
}

export default function ProfileClientWrapper({ initialProfile }: ProfileClientWrapperProps) {
  const [activeSection, setActiveSection] = useState('personal');

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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <ProfileTabs activeSection={activeSection} setActiveSection={setActiveSection} />
        </div>
      </div>
      <div className="lg:col-span-3">
        {renderSection()}
      </div>
    </div>
  );
}
