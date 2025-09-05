import React, { useState, useRef } from 'react';
import { Layout, Type, Eye, Save, GripVertical, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

const ContentCustomizer = ({ userInfo }) => {
  const { user } = useAuth();
  
  const [settings, setSettings] = useState({
    heroTitle: userInfo?.heroTitle || userInfo?.name || '',
    heroSubtitle: userInfo?.heroSubtitle || userInfo?.bio || '',
    sectionsOrder: JSON.parse(userInfo?.sectionsOrder || '["projects", "achievements", "conferences", "blogPosts", "awards"]'),
    sectionVisibility: JSON.parse(userInfo?.sectionVisibility || '{"projects": true, "achievements": true, "conferences": true, "blogPosts": true, "awards": true}')
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const timeoutRef = useRef(null);
  const draggedItem = useRef(null);
  const draggedOverItem = useRef(null);

  const sectionLabels = {
    projects: 'Research Projects',
    achievements: 'Achievements',
    conferences: 'Conferences',
    blogPosts: 'Blog Posts',
    awards: 'Awards',
    researchPapers: 'Research Papers',
    teachingExperience: 'Teaching Experience',
    collaborations: 'Collaborations'
  };

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    // Auto-save after 2 seconds of no changes
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveSettings({ [field]: typeof value === 'object' ? JSON.stringify(value) : value });
    }, 2000);
  };

  const saveSettings = async (updatedFields = settings) => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      const updates = typeof updatedFields === 'object' && updatedFields !== settings 
        ? updatedFields 
        : {
            heroTitle: settings.heroTitle,
            heroSubtitle: settings.heroSubtitle,
            sectionsOrder: JSON.stringify(settings.sectionsOrder),
            sectionVisibility: JSON.stringify(settings.sectionVisibility)
          };
      
      // Save each field separately
      for (const [fieldName, value] of Object.entries(updates)) {
        const response = await fetch('/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            fieldName,
            value
          })
        });
        
        if (!response.ok) {
          throw new Error(`Failed to update ${fieldName}`);
        }
      }
      
      toast.success('Content settings saved successfully!');
    } catch (error) {
      console.error('Error saving content settings:', error);
      toast.error('Failed to save content settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDragStart = (e, index) => {
    draggedItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    draggedOverItem.current = index;
  };

  const handleDragEnd = () => {
    const draggedItemContent = settings.sectionsOrder[draggedItem.current];
    const newOrder = [...settings.sectionsOrder];
    
    // Remove dragged item
    newOrder.splice(draggedItem.current, 1);
    
    // Insert at new position
    newOrder.splice(draggedOverItem.current, 0, draggedItemContent);
    
    handleSettingChange('sectionsOrder', newOrder);
    
    draggedItem.current = null;
    draggedOverItem.current = null;
  };

  const toggleSectionVisibility = (sectionKey) => {
    const newVisibility = {
      ...settings.sectionVisibility,
      [sectionKey]: !settings.sectionVisibility[sectionKey]
    };
    handleSettingChange('sectionVisibility', newVisibility);
  };

  const previewUrl = user?.id 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/preview/${user.id}`
    : '';

  return (
    <div className="card w-full max-w-4xl mx-auto bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base mb-6 text-base-content/80 flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Content & Layout Customization
        </h2>

        <div className="space-y-8">
          {/* Hero Section Customization */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Hero Section
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-sm font-medium">Hero Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Your Name or Title"
                  className="input input-bordered w-full bg-base-100 text-base-content/80"
                  value={settings.heroTitle}
                  onChange={(e) => handleSettingChange('heroTitle', e.target.value)}
                />
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text text-sm font-medium">Hero Subtitle</span>
                </label>
                <textarea
                  placeholder="Your bio or description"
                  className="textarea textarea-bordered w-full h-24 bg-base-100 text-base-content/80"
                  value={settings.heroSubtitle}
                  onChange={(e) => handleSettingChange('heroSubtitle', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section Order and Visibility */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Section Order & Visibility
            </h3>
            
            <div className="space-y-3">
              {settings.sectionsOrder.map((sectionKey, index) => (
                <div
                  key={sectionKey}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 bg-base-100 rounded-lg border-2 transition-all cursor-move hover:shadow-md ${
                    settings.sectionVisibility[sectionKey] 
                      ? 'border-primary/20' 
                      : 'border-base-300 opacity-60'
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-base-content/40" />
                  
                  <div className="flex-1">
                    <span className="font-medium text-sm">
                      {sectionLabels[sectionKey] || sectionKey}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => toggleSectionVisibility(sectionKey)}
                    className={`btn btn-sm ${
                      settings.sectionVisibility[sectionKey] 
                        ? 'btn-success' 
                        : 'btn-outline'
                    }`}
                  >
                    {settings.sectionVisibility[sectionKey] ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Hidden
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-xs text-base-content/60 mt-2">
              Drag and drop to reorder sections. Click the visibility button to show/hide sections.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => saveSettings()}
              disabled={isUpdating}
              className="btn btn-primary flex-1"
            >
              {isUpdating && <span className="loading loading-spinner loading-sm"></span>}
              <Save className="w-4 h-4" />
              Save Content Settings
            </button>
            
            {previewUrl && (
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="btn btn-outline"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCustomizer;