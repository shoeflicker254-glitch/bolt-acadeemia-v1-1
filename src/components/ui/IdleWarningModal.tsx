import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, X } from 'lucide-react';
import Button from './Button';

interface IdleWarningModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onLogout: () => void;
  warningTime: number; // in seconds
}

const IdleWarningModal: React.FC<IdleWarningModalProps> = ({
  isOpen,
  onContinue,
  onLogout,
  warningTime
}) => {
  const [timeLeft, setTimeLeft] = useState(warningTime);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(warningTime);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, warningTime, onLogout]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg mr-3">
                <AlertTriangle size={24} className="text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Session Timeout Warning</h2>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <div className="mb-4">
              <Clock size={48} className="mx-auto text-orange-500 mb-3" />
              <p className="text-gray-700 mb-2">
                Your session will expire due to inactivity.
              </p>
              <p className="text-sm text-gray-600">
                You will be automatically logged out in:
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg mb-4">
              <div className="text-3xl font-bold text-orange-600">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-orange-700">minutes remaining</div>
            </div>

            <p className="text-sm text-gray-600">
              Click "Continue Session" to stay logged in, or you'll be automatically logged out for security.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              fullWidth
              onClick={onContinue}
              className="flex-1"
            >
              Continue Session
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={onLogout}
              className="flex-1"
            >
              Logout Now
            </Button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Security Notice:</strong> Automatic logout helps protect your account when you're away from your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleWarningModal;