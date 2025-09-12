'use client';

import React, { useState } from 'react';
import { Palette, Layout, FileText, X, Menu } from 'lucide-react';
import ThemeCustomizer from './ThemeCustomizer';
import ContentCustomizer from './ContentCustomizer';

const CollapsibleSideNav = ({ userInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('content');

  const sections = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'theme', label: 'Theme', icon: Palette }
  ];

  const toggleSideNav = () => setIsOpen(!isOpen);
  const closeSideNav = () => setIsOpen(false);

  // Handle keyboard events
  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      closeSideNav();
    }
  };

  // Add event listener for escape key
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
    <>
      {/* Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleSideNav}
          className="btn btn-primary btn-circle shadow-lg hover:scale-105 transition-transform"
          aria-label={isOpen ? "Close customization panel" : "Open customization panel"}
        >
          <Menu className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-base-300 text-base-content px-2 py-1 rounded text-xs whitespace-nowrap">
              Customization
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSideNav}
        />
      )}

      {/* Side Navigation */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-base-100 shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:w-96
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">Customization</h2>
          <button
            onClick={closeSideNav}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Close customization panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-full overflow-y-auto pb-20">
          <div className="space-y-4">
            {/* Section Navigation */}
            <div className="card bg-base-200 shadow-md">
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
            <div className="card bg-base-200 shadow-md">
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
        </div>
      </div>
    </>
  );
};

export default CollapsibleSideNav;