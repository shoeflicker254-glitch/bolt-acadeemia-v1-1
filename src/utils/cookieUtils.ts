// Cookie utility functions for managing user preferences

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const stored = localStorage.getItem('cookieConsent');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading cookie preferences:', error);
    return null;
  }
};

export const setCookiePreferences = (preferences: CookiePreferences): void => {
  try {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving cookie preferences:', error);
  }
};

export const hasUserMadeCookieChoice = (): boolean => {
  return localStorage.getItem('cookieConsent') !== null;
};

// Cookie management functions
export const setCookie = (name: string, value: string, days: number = 365): void => {
  const preferences = getCookiePreferences();
  
  // Only set non-necessary cookies if user has consented
  if (name.startsWith('_ga') || name.startsWith('analytics')) {
    if (!preferences?.analytics) return;
  }
  
  if (name.startsWith('marketing') || name.startsWith('ads')) {
    if (!preferences?.marketing) return;
  }
  
  if (name.startsWith('functional') || name.startsWith('chat')) {
    if (!preferences?.functional) return;
  }
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Initialize analytics based on user preferences
export const initializeAnalytics = (): void => {
  const preferences = getCookiePreferences();
  
  if (preferences?.analytics) {
    // Initialize Google Analytics or other analytics tools
    console.log('Initializing analytics...');
    
    // Example Google Analytics initialization
    // gtag('config', 'GA_MEASUREMENT_ID', {
    //   cookie_flags: 'SameSite=None;Secure'
    // });
  }
};

// Initialize marketing tools based on user preferences
export const initializeMarketing = (): void => {
  const preferences = getCookiePreferences();
  
  if (preferences?.marketing) {
    // Initialize marketing/advertising tools
    console.log('Initializing marketing tools...');
    
    // Example: Facebook Pixel, Google Ads, etc.
  }
};

// Initialize functional tools based on user preferences
export const initializeFunctional = (): void => {
  const preferences = getCookiePreferences();
  
  if (preferences?.functional) {
    // Initialize functional tools like chat widgets
    console.log('Initializing functional tools...');
    
    // Example: Chat widgets, video players, etc.
  }
};

// Clean up cookies when user changes preferences
export const cleanupCookies = (newPreferences: CookiePreferences): void => {
  // Remove analytics cookies if disabled
  if (!newPreferences.analytics) {
    deleteCookie('_ga');
    deleteCookie('_gid');
    deleteCookie('_gat');
    // Add other analytics cookies as needed
  }
  
  // Remove marketing cookies if disabled
  if (!newPreferences.marketing) {
    deleteCookie('_fbp');
    deleteCookie('_fbc');
    // Add other marketing cookies as needed
  }
  
  // Remove functional cookies if disabled
  if (!newPreferences.functional) {
    deleteCookie('chat_session');
    // Add other functional cookies as needed
  }
};