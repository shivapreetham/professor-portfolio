// components/FormContent.jsx
import React from 'react';
import BasicDetails from './BasicDetails';
import ProjectSection from '@/app/admin/components/addSections/Project/ProjectSection';
import { useUser } from '../Provider';
import ResearchPaperSection from '@/app/admin/components/addSections/ResearchPapers/researchPaperSection';
import {ConferenceSection} from '@/app/admin/components/addSections/conferances/conferanceSection';
import { BlogSection } from './addSections/blogs/blogSection';
import { AchievementsSection } from './addSections/achievements/achievementSection';
const FormContent = () => {
  const userData = useUser();
  const userInfo = userData?.user;
  if (!userInfo) {
    return (
      <div className="card w-full max-w-3xl mx-auto bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-base mb-4 text-base-content/80">
            Personal Information
          </h2>
          <p>Loading user information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 overflow-auto">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <BasicDetails userInfo={userInfo} />
        </section>
        <div className="divider"></div>
        <ProjectSection />
        <div className="divider"></div>
        <ResearchPaperSection />
        <div className="divider"></div>
        <ConferenceSection />
        <div className="divider"></div>
        <BlogSection />
        <div className="divider"></div>
        <AchievementsSection />
        <div className="divider"></div>

      </div>
    </div>
  );
};

export default FormContent;