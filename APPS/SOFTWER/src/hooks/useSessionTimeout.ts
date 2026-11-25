import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

// Default timeout: 15 minutes (in milliseconds)
const TIMEOUT_MS = 15 * 60 * 1000;

export const useSessionTimeout = (timeout = TIMEOUT_MS) => {
  const { isAuthenticated, isLocked, lockScreen } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || isLocked) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log('Session timed out due to inactivity.');
        lockScreen();
      }, timeout);
    };

    // Listen to user activity events
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, isLocked, lockScreen, timeout]);
};
