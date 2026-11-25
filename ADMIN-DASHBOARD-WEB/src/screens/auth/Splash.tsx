import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Building2, Loader2 } from 'lucide-react';

export const Splash = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md mb-6 animate-pulse">
        <Building2 size={32} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">TempleOS</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Initializing secure environment...</p>
      <Loader2 className="animate-spin text-primary" size={24} />
    </div>
  );
};
