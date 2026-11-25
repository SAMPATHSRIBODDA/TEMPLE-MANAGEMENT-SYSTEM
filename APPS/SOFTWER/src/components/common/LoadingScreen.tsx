import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="relative">
        <div className="h-20 w-20 border-4 border-orange-200 rounded-full"></div>
        <div className="h-20 w-20 border-4 border-orange-600 rounded-full border-t-transparent animate-spin absolute inset-0"></div>
      </div>
      <p className="mt-6 text-lg font-bold text-gray-800 animate-pulse">{message}</p>
    </div>
  );
}
