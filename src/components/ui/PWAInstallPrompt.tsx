import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import Button from './Button';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (running in standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom install prompt
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app was successfully installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    // For iOS, show install prompt after a delay if not already installed
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to the install prompt: ${outcome}`);
      
      // Clear the deferredPrompt so it can only be used once
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed, dismissed this session, or not supported
  if (isStandalone || 
      sessionStorage.getItem('pwa-install-dismissed') || 
      (!deferredPrompt && !isIOS) || 
      !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-primary-50 rounded-lg mr-3">
              {isIOS ? <Smartphone size={20} className="text-primary-600" /> : <Download size={20} className="text-primary-600" />}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Install Acadeemia</h3>
              <p className="text-sm text-gray-600">Get quick access to our app</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              To install this app on your iPhone/iPad:
            </p>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Tap the Share button <span className="inline-block w-4 h-4 bg-blue-500 rounded text-white text-xs text-center leading-4">↗</span></li>
              <li>2. Scroll down and tap "Add to Home Screen"</li>
              <li>3. Tap "Add" to confirm</li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={handleDismiss}
            >
              Got it
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              Install our app for a better experience with offline access and quick launch.
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleInstallClick}
                icon={<Download size={16} />}
                className="flex-1"
              >
                Install
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="flex-1"
              >
                Not now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;