import React, { useState } from 'react';
import { Palette, Layout, FileText, Settings } from 'lucide-react';
import ThemeCustomizer from './ThemeCustomizer';
import ContentCustomizer from './ContentCustomizer';

const CustomizationSidebar = ({ userInfo }) => {
  const [activeSection, setActiveSection] = useState('content');

  const sections = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'theme', label: 'Theme', icon: Palette }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'content':
        return <ContentCustomizer userInfo={userInfo} compact={true} />;
      case 'layout':
        return (
          <div className="space-y-4">
            <div className="text-sm text-base-content/70">
              Layout options coming soon...
            </div>
          </div>
        );
      case 'theme':
        return <ThemeCustomizer userInfo={userInfo} compact={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Navigation */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-3">
          <div className="flex flex-col gap-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-300 text-base-content'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Section Content */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <div className="flex items-center gap-2 mb-4">
            {(() => {
              const activeTab = sections.find(s => s.id === activeSection);
              const Icon = activeTab?.icon;
              return (
                <>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{activeTab?.label}</span>
                </>
              );
            })()}
          </div>
          
          <div className="space-y-3">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationSidebar;