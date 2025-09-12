'use client';

import React, { useState } from 'react';
import { 
  BarChart, 
  Palette, 
  Layout, 
  FileText, 
  Settings, 
  User, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ThemeCustomizer from './ThemeCustomizer';
import ContentCustomizer from './ContentCustomizer';
import StatsPanel from './StatsPanel';

const EnhancedSideNav = ({ userInfo }) => {
  const [activePanel, setActivePanel] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navigationItems = [
    {
      id: 'stats',
      label: 'Analytics',
      icon: BarChart,
      component: StatsPanel,
      description: 'View portfolio statistics and insights'
    },
    {
      id: 'theme',
      label: 'Theme',
      icon: Palette,
      component: ThemeCustomizer,
      description: 'Customize colors and themes'
    },
    {
      id: 'content',
      label: 'Layout',
      icon: Layout,
      component: ContentCustomizer,
      description: 'Manage sections and content layout'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      component: () => <div className="p-4 text-center text-base-content/70">Profile settings coming soon...</div>,
      description: 'Edit profile information'
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: FileText,
      component: () => <div className="p-4 text-center text-base-content/70">SEO settings coming soon...</div>,
      description: 'Optimize for search engines'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      component: () => <div className="p-4 text-center text-base-content/70">General settings coming soon...</div>,
      description: 'Account and privacy settings'
    }
  ];

  const handleNavClick = (itemId) => {
    if (activePanel === itemId && !isCollapsed) {
      // If clicking the same item and panel is open, close it
      setActivePanel(null);
      setIsCollapsed(true);
    } else {
      // Open the panel and expand sidebar
      setActivePanel(itemId);
      setIsCollapsed(false);
    }
  };

  const closePanel = () => {
    setActivePanel(null);
    setIsCollapsed(true);
  };

  const toggleCollapse = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    } else {
      setActivePanel(null);
      setIsCollapsed(true);
    }
  };

  const ActiveComponent = activePanel ? navigationItems.find(item => item.id === activePanel)?.component : null;

  return (
    <>
      {/* Navigation Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-base-200 shadow-xl z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-80'}
        border-r border-base-300
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-base-content">Quick Tools</h2>
          )}
          <button
            onClick={toggleCollapse}
            className="btn btn-ghost btn-circle btn-sm ml-auto"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="p-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-content shadow-md' 
                    : 'hover:bg-base-300 text-base-content hover:shadow-sm'
                  }
                  ${isCollapsed ? 'justify-center' : 'justify-start'}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                )}
                {!isCollapsed && isActive && (
                  <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Panel Content */}
        {!isCollapsed && activePanel && ActiveComponent && (
          <div className="flex-1 overflow-y-auto p-4 border-t border-base-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base-content">
                {navigationItems.find(item => item.id === activePanel)?.label}
              </h3>
              <button
                onClick={closePanel}
                className="btn btn-ghost btn-circle btn-sm"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <ActiveComponent userInfo={userInfo} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-200">
          {!isCollapsed ? (
            <div className="text-xs text-base-content/60 text-center">
              Quick access to portfolio tools
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-1 bg-base-content/20 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={closePanel}
        />
      )}
    </>
  );
};

export default EnhancedSideNav;