import { useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerOptions {
  timeout: number; // in milliseconds
  onIdle: () => void;
  events?: string[];
  element?: Document | Element;
}

export const useIdleTimer = ({
  timeout,
  onIdle,
  events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'],
  element = document
}: UseIdleTimerOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const onIdleRef = useRef(onIdle);

  // Update the ref when onIdle changes
  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onIdleRef.current();
    }, timeout);
  }, [timeout]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Start the timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      element.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        element.removeEventListener(event, handleActivity, true);
      });
    };
  }, [events, element, handleActivity, resetTimer]);

  return {
    reset: resetTimer
  };
};