import React, { useState, useEffect } from 'react';
import { X, Settings, Check, Cookie } from 'lucide-react';
import Button from './Button';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for new visitors only
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences but don't show any UI
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
        applyCookieSettings(savedPreferences);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const applyCookieSettings = (prefs: CookiePreferences) => {
    // Apply analytics cookies
    if (prefs.analytics) {
      // Enable Google Analytics or other analytics tools
      console.log('Analytics cookies enabled');
      // Example: gtag('config', 'GA_MEASUREMENT_ID');
    }

    // Apply marketing cookies
    if (prefs.marketing) {
      // Enable marketing/advertising cookies
      console.log('Marketing cookies enabled');
    }

    // Apply functional cookies
    if (prefs.functional) {
      // Enable functional cookies (chat widgets, etc.)
      console.log('Functional cookies enabled');
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    applyCookieSettings(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    applyCookieSettings(necessaryOnly);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    applyCookieSettings(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Don't render anything if user has already made a choice
  const hasUserConsented = localStorage.getItem('cookieConsent');
  if (hasUserConsented && !showBanner) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner - Only shown for new visitors */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 z-50 max-w-sm bg-white rounded-lg shadow-xl border border-gray-200 animate-fade-in">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Cookie size={24} className="text-primary-600 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-gray-900">Cookie Settings</h3>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              We use cookies to enhance your experience, analyze site traffic, and personalize content. 
              Choose your preferences below.
            </p>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleAcceptAll}
              >
                Accept All Cookies
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleAcceptNecessary}
              >
                Accept Necessary Only
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon={<Settings size={16} />}
                onClick={() => setShowSettings(true)}
              >
                Customize Settings
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-3">
              By continuing to use our site, you agree to our{' '}
              <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Manage your cookie preferences. You can enable or disable different types of cookies below.
              </p>
              
              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Necessary Cookies</h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Always Active</span>
                      <div className="w-12 h-6 bg-primary-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies are essential for the website to function properly. They enable basic features 
                    like page navigation, access to secure areas, and form submissions.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                    <button
                      onClick={() => handlePreferenceChange('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics ? 'bg-primary-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously. This helps us improve our services.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Marketing Cookies</h3>
                    <button
                      onClick={() => handlePreferenceChange('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing ? 'bg-primary-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies are used to deliver advertisements more relevant to you and your interests. 
                    They may also be used to limit the number of times you see an advertisement.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                    <button
                      onClick={() => handlePreferenceChange('functional')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.functional ? 'bg-primary-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies enable enhanced functionality and personalization, such as live chat, 
                    videos, and social media features. They may be set by us or third-party providers.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button
                  variant="primary"
                  fullWidth
                  icon={<Check size={16} />}
                  onClick={handleSavePreferences}
                >
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleAcceptAll}
                >
                  Accept All
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={handleAcceptNecessary}
                >
                  Necessary Only
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">More Information</h4>
                <p className="text-sm text-gray-600">
                  For more details about how we use cookies and process your data, please read our{' '}
                  <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                    Terms of Service
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;