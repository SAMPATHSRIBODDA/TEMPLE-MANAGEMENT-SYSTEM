import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          navigate('/entry');
          break;
        case 'F2':
          e.preventDefault();
          navigate('/darshan');
          break;
        case 'F3':
          e.preventDefault();
          navigate('/laddu');
          break;
        case 'F4':
          e.preventDefault();
          navigate('/scanner');
          break;
        case 'F9':
          e.preventDefault();
          navigate('/sync');
          break;
        case 'Escape':
          // Can be used to close modals globally if implemented
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
}
