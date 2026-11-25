import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left Pane - Branding / Imagery */}
      <div className="hidden lg:flex w-1/2 bg-orange-600 flex-col items-center justify-center p-12 text-white shadow-inner relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transform translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Temple Management System</h1>
          <p className="text-xl text-orange-100 max-w-md mx-auto">
            Secure, fast, and offline-ready counter operations for dedicated staff.
          </p>
        </div>
      </div>

      {/* Right Pane - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01] duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
