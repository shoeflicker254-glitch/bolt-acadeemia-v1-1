import React from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const TawkChat: React.FC = () => {
  // Tawk.to script is now loaded directly in index.html
  // This component serves as a placeholder for future chat customizations
  return null;
};

export default TawkChat;