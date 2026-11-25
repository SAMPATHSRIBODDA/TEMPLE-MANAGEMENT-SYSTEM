import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function LockScreen() {
  const { user, unlockScreen, logout } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { // Mock PIN
      unlockScreen();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
        
        <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow">
             <UserAvatar name={user?.name || 'Staff'} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
        <p className="text-sm text-gray-500 mb-8">Session Locked</p>

        <form onSubmit={handleUnlock} className="space-y-6">
          <div className="relative max-w-[200px] mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="password"
              autoFocus
              className={`pl-10 w-full text-center text-2xl tracking-widest rounded-lg border-2 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200'} px-4 py-3 focus:border-orange-500 focus:ring-0 outline-none transition-all`}
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
            />
          </div>
          
          {error && <p className="text-red-500 text-sm animate-pulse">Incorrect PIN</p>}

          <button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow text-white bg-gray-900 hover:bg-gray-800 focus:outline-none transition-all"
          >
            <Unlock className="h-5 w-5 mr-2" /> Unlock
          </button>
        </form>

        <button 
          onClick={logout}
          className="mt-6 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Sign in as different user
        </button>
      </div>
    </div>
  );
}

const UserAvatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  return <span className="text-xl font-bold text-gray-700">{initials}</span>;
};
