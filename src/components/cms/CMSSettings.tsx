import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, RefreshCw, Globe, Mail, Phone, 
  MapPin, Palette, Shield, BarChart, MessageSquare,
  Eye, EyeOff, X, Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface CMSSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_description?: string;
  setting_category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CMSSettings: React.FC = () => {
  const [settings, setSettings] = useState<CMSSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, any>>({});

  const categories = [
    { id: 'general', label: 'General', icon: <Globe size={20} /> },
    { id: 'contact', label: 'Contact Info', icon: <Mail size={20} /> },
    { id: 'social', label: 'Social Media', icon: <MessageSquare size={20} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={20} /> },
    { id: 'features', label: 'Features', icon: <Settings size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart size={20} /> },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('is_active', true)
        .order('setting_key', { ascending: true });

      if (error) throw error;
      console.log('Fetched CMS settings:', data);
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching CMS settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setUnsavedChanges({
      ...unsavedChanges,
      [key]: value
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(unsavedChanges)) {
        const { error } = await supabase
          .from('cms_settings')
          .update({ 
            setting_value: value,
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', key);

        if (error) throw error;
      }

      // Update local state
      setSettings(settings.map(setting => ({
        ...setting,
        setting_value: unsavedChanges[setting.setting_key] !== undefined 
          ? unsavedChanges[setting.setting_key] 
          : setting.setting_value
      })));

      setUnsavedChanges({});
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getSettingValue = (key: string) => {
    return unsavedChanges[key] !== undefined 
      ? unsavedChanges[key] 
      : settings.find(s => s.setting_key === key)?.setting_value || '';
  };

  const filteredSettings = settings.filter(setting => setting.setting_category === activeCategory);

  const renderSettingInput = (setting: CMSSetting) => {
    const currentValue = getSettingValue(setting.setting_key);
    
    switch (setting.setting_key) {
      case 'analytics_enabled':
      case 'chat_enabled':
      case 'pwa_enabled':
        return (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleSettingChange(setting.setting_key, !currentValue)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                currentValue ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  currentValue ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-600">
              {currentValue ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        );
      
      case 'theme_primary_color':
      case 'theme_secondary_color':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="#697BBC"
            />
          </div>
        );
      
      default:
        return (
          <input
            type={setting.setting_key.includes('email') ? 'email' : 
                  setting.setting_key.includes('phone') ? 'tel' : 
                  setting.setting_key.includes('url') ? 'url' : 'text'}
            value={currentValue}
            onChange={(e) => handleSettingChange(setting.setting_key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={setting.setting_description}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS Settings</h1>
          <p className="text-gray-600">Configure website settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" icon={<RefreshCw size={18} />} onClick={fetchSettings}>
            Refresh
          </Button>
          {Object.keys(unsavedChanges).length > 0 && (
            <Button 
              variant="primary" 
              icon={<Save size={18} />} 
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? 'Saving...' : `Save Changes (${Object.keys(unsavedChanges).length})`}
            </Button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {Object.keys(unsavedChanges).length > 0 && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye size={20} className="text-orange-600 mr-2" />
              <span className="text-orange-800 font-medium">
                You have {Object.keys(unsavedChanges).length} unsaved changes
              </span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => setUnsavedChanges({})}>
                Discard
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveSettings}>
                Save All
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                activeCategory === category.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSettings.map((setting) => (
          <Card key={setting.id} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                {setting.setting_description && (
                  <p className="text-sm text-gray-500 mb-2">{setting.setting_description}</p>
                )}
                {renderSettingInput(setting)}
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Key: {setting.setting_key}
                </span>
                {unsavedChanges[setting.setting_key] !== undefined && (
                  <span className="text-xs text-orange-600 font-medium">
                    Modified
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSettings.length === 0 && (
        <Card className="p-12 text-center">
          <Settings size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No settings found</h3>
          <p className="text-gray-600">
            No settings available for the {activeCategory} category.
          </p>
        </Card>
      )}

      {/* Settings Preview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <pre className="text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(
              filteredSettings.reduce((acc, setting) => ({
                ...acc,
                [setting.setting_key]: getSettingValue(setting.setting_key)
              }), {}),
              null,
              2
            )}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default CMSSettings;