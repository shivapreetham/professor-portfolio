'use client';

import { useState } from 'react';
import { Layers3, Brush, BarChart, Settings, Palette, Layout, FileText, User } from "lucide-react";
import ResizableAnalyticsPanel from './ResizableAnalyticsPanel';
import ThemeCustomizer from './ThemeCustomizer';
import ContentCustomizer from './ContentCustomizer';
import { useUser } from '../Provider';

function SideNav() {
  const userData = useUser();
  const userInfo = userData?.user;
  const [activePanel, setActivePanel] = useState(null);

  const menuList = [
    { 
      id: 'analytics', 
      name: "Analytics", 
      icon: BarChart,
      component: 'analytics'
    },
    { 
      id: 'theme', 
      name: "Theme", 
      icon: Palette,
      component: 'theme'
    },
    { 
      id: 'layout', 
      name: "Layout", 
      icon: Layout,
      component: 'layout'
    },
    { 
      id: 'profile', 
      name: "Profile", 
      icon: User,
      component: 'profile'
    }
  ];

  const handleMenuClick = (menu) => {
    if (activePanel === menu.id) {
      setActivePanel(null);
    } else {
      setActivePanel(menu.id);
    }
  };

  const closePanel = () => {
    setActivePanel(null);
  };

  return (
    <>
      <div className="fixed left-0 top-0 p-4 bg-base-200/90 backdrop-blur-sm h-screen flex flex-col justify-between z-30 shadow-lg">
        <div>
          {menuList.map((menu) => (
            <div
              key={menu.id}
              onClick={() => handleMenuClick(menu)}
              className={`p-3 py-4 rounded-lg flex items-center justify-center mb-3 cursor-pointer transition-all duration-200 tooltip tooltip-right ${
                activePanel === menu.id 
                  ? 'bg-primary text-primary-content shadow-md scale-105' 
                  : 'bg-base-300 hover:bg-primary hover:text-primary-content hover:shadow-md hover:scale-105'
              }`}
              data-tip={menu.name}
            >
              <menu.icon className="text-center" size={20} />
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="w-8 h-1 bg-base-content/20 rounded-full mx-auto"></div>
        </div>
      </div>

      {/* Analytics Panel */}
      <ResizableAnalyticsPanel 
        userInfo={userInfo}
        isOpen={activePanel === 'analytics'}
        onClose={closePanel}
      />

      {/* Theme Panel - Slide out from left */}
      {activePanel === 'theme' && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={closePanel} />
          <div className="fixed left-20 top-0 w-80 h-full bg-base-100 shadow-xl z-50 overflow-y-auto">
            <div className="p-4 border-b border-base-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Theme Customization</h3>
                <button onClick={closePanel} className="btn btn-ghost btn-sm btn-circle">×</button>
              </div>
            </div>
            <div className="p-4">
              <ThemeCustomizer userInfo={userInfo} />
            </div>
          </div>
        </>
      )}

      {/* Layout Panel - Slide out from left */}
      {activePanel === 'layout' && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={closePanel} />
          <div className="fixed left-20 top-0 w-80 h-full bg-base-100 shadow-xl z-50 overflow-y-auto">
            <div className="p-4 border-b border-base-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Content Layout</h3>
                <button onClick={closePanel} className="btn btn-ghost btn-sm btn-circle">×</button>
              </div>
            </div>
            <div className="p-4">
              <ContentCustomizer userInfo={userInfo} />
            </div>
          </div>
        </>
      )}

      {/* Other panels - Coming soon */}
      {(activePanel === 'pages' || activePanel === 'profile' || activePanel === 'seo' || activePanel === 'settings') && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={closePanel} />
          <div className="fixed left-20 top-0 w-80 h-full bg-base-100 shadow-xl z-50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
              <p className="text-base-content/70 mb-4">This feature is under development</p>
              <button onClick={closePanel} className="btn btn-primary btn-sm">Close</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default SideNav;