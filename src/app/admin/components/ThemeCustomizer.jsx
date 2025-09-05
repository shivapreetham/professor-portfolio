import React, { useState, useRef } from 'react';
import { Palette, Eye, Code, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

const ThemeCustomizer = ({ userInfo }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme: userInfo?.theme || 'light',
    primaryColor: userInfo?.primaryColor || 'blue',
    customCSS: userInfo?.customCSS || ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const timeoutRef = useRef(null);

  const themes = [
    { value: 'light', label: 'Light', preview: 'bg-white text-black' },
    { value: 'dark', label: 'Dark', preview: 'bg-gray-900 text-white' },
    { value: 'cupcake', label: 'Cupcake', preview: 'bg-pink-100 text-pink-900' },
    { value: 'bumblebee', label: 'Bumblebee', preview: 'bg-yellow-100 text-yellow-900' },
    { value: 'emerald', label: 'Emerald', preview: 'bg-green-100 text-green-900' },
    { value: 'corporate', label: 'Corporate', preview: 'bg-blue-50 text-blue-900' },
    { value: 'synthwave', label: 'Synthwave', preview: 'bg-purple-900 text-purple-100' },
    { value: 'retro', label: 'Retro', preview: 'bg-orange-100 text-orange-900' },
    { value: 'cyberpunk', label: 'Cyberpunk', preview: 'bg-yellow-400 text-black' },
    { value: 'valentine', label: 'Valentine', preview: 'bg-rose-100 text-rose-900' },
    { value: 'halloween', label: 'Halloween', preview: 'bg-orange-900 text-orange-100' },
    { value: 'garden', label: 'Garden', preview: 'bg-green-50 text-green-900' },
    { value: 'forest', label: 'Forest', preview: 'bg-green-900 text-green-100' },
    { value: 'aqua', label: 'Aqua', preview: 'bg-cyan-100 text-cyan-900' },
    { value: 'lofi', label: 'Lo-Fi', preview: 'bg-gray-100 text-gray-900' },
    { value: 'pastel', label: 'Pastel', preview: 'bg-purple-50 text-purple-900' },
    { value: 'fantasy', label: 'Fantasy', preview: 'bg-pink-50 text-pink-900' },
    { value: 'wireframe', label: 'Wireframe', preview: 'bg-white text-black border' },
    { value: 'black', label: 'Black', preview: 'bg-black text-white' },
    { value: 'luxury', label: 'Luxury', preview: 'bg-yellow-900 text-yellow-100' },
    { value: 'dracula', label: 'Dracula', preview: 'bg-purple-900 text-purple-100' }
  ];

  const primaryColors = [
    { value: 'blue', label: 'Blue', preview: 'bg-blue-500' },
    { value: 'red', label: 'Red', preview: 'bg-red-500' },
    { value: 'green', label: 'Green', preview: 'bg-green-500' },
    { value: 'purple', label: 'Purple', preview: 'bg-purple-500' },
    { value: 'pink', label: 'Pink', preview: 'bg-pink-500' },
    { value: 'orange', label: 'Orange', preview: 'bg-orange-500' },
    { value: 'teal', label: 'Teal', preview: 'bg-teal-500' },
    { value: 'indigo', label: 'Indigo', preview: 'bg-indigo-500' },
    { value: 'yellow', label: 'Yellow', preview: 'bg-yellow-500' },
    { value: 'cyan', label: 'Cyan', preview: 'bg-cyan-500' }
  ];

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    // Auto-save after 2 seconds of no changes
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveSettings({ [field]: value });
    }, 2000);
  };

  const saveSettings = async (updatedFields = settings) => {
    if (!user?.id) return;
    
    setIsUpdating(true);
    try {
      const updates = typeof updatedFields === 'object' && updatedFields !== settings 
        ? updatedFields 
        : settings;
      
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
      
      toast.success('Theme settings saved successfully!');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      toast.error('Failed to save theme settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const previewUrl = user?.id 
    ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/preview/${user.id}`
    : '';

  return (
    <div className="card w-full max-w-4xl mx-auto bg-base-300 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base mb-6 text-base-content/80 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Portfolio Theme & Customization
        </h2>

        <div className="space-y-8">
          {/* Theme Selection */}
          <div>
            <label className="label">
              <span className="label-text text-sm font-medium">Portfolio Theme</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {themes.map(theme => (
                <label
                  key={theme.value}
                  className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                    settings.theme === theme.value 
                      ? 'border-primary bg-primary/10' 
                      : 'border-base-300 hover:border-base-content/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={settings.theme === theme.value}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="hidden"
                  />
                  <div className={`w-full h-8 rounded mb-2 ${theme.preview}`}></div>
                  <div className="text-xs text-center font-medium">{theme.label}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Primary Color Selection */}
          <div>
            <label className="label">
              <span className="label-text text-sm font-medium">Primary Color</span>
            </label>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {primaryColors.map(color => (
                <label
                  key={color.value}
                  className={`cursor-pointer border-2 rounded-lg p-2 transition-all ${
                    settings.primaryColor === color.value 
                      ? 'border-primary scale-110' 
                      : 'border-base-300 hover:border-base-content/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="primaryColor"
                    value={color.value}
                    checked={settings.primaryColor === color.value}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="hidden"
                  />
                  <div className={`w-8 h-8 rounded ${color.preview} mx-auto`}></div>
                  <div className="text-xs text-center mt-1 font-medium">{color.label}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom CSS */}
          <div>
            <label className="label flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="label-text text-sm font-medium">Custom CSS (Advanced)</span>
            </label>
            <textarea
              placeholder="Add your custom CSS styles here..."
              className="textarea textarea-bordered w-full h-32 text-sm font-mono bg-base-100 text-base-content/80"
              value={settings.customCSS}
              onChange={(e) => handleSettingChange('customCSS', e.target.value)}
            />
            <div className="text-xs text-base-content/60 mt-1">
              Pro tip: Use CSS variables like --primary, --secondary, etc. for better theme integration
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
              Save Settings
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

export default ThemeCustomizer;