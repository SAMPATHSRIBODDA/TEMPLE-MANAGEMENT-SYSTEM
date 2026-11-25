import React, { useState } from 'react';
import { Users, ShieldCheck, Clock } from 'lucide-react';
import StaffDirectory from './StaffDirectory';
import RolesPermissions from './RolesPermissions';
import StaffAttendance from './StaffAttendance';

import { useSearchParams } from 'react-router-dom';

type Tab = 'directory' | 'permissions' | 'attendance';

export default function StaffDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'directory';
  const setActiveTab = (tab: Tab) => setSearchParams({ tab });

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Management</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage personnel, roles, and shift operations.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl mb-6 w-fit border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'directory'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Staff Directory
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'permissions'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          Roles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'attendance'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Attendance & Shifts
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'directory' && <StaffDirectory />}
        {activeTab === 'permissions' && <RolesPermissions />}
        {activeTab === 'attendance' && <StaffAttendance />}
      </div>
    </div>
  );
}
