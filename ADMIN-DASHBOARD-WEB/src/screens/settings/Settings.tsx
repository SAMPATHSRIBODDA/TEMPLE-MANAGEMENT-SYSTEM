import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Shield, Clock, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { loginHistory, activeDevices, securityLogs } from '../../data/mockData';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const user = useAuthStore(state => state.user);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'devices', label: 'Sessions & Devices', icon: Smartphone },
    { id: 'history', label: 'Login History', icon: Clock },
    { id: 'logs', label: 'Security Logs', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">Account Settings</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your profile and security preferences.</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-gray-100 shadow-sm border border-white/40 dark:border-gray-700/50/50'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-200/50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 p-8 rounded-2xl shadow-sm">
        {activeTab === 'profile' && (
          <div className="max-w-2xl animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Profile Information</h3>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-50 shadow-sm">
                {user?.avatar || 'AD'}
              </div>
              <div>
                <button className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer">
                  Change Avatar
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="input-label">Full Name</label>
                <input type="text" defaultValue={user?.name} className="input-field" />
              </div>
              <div className="space-y-1">
                <label className="input-label">Email Address</label>
                <input type="email" defaultValue={user?.email} className="input-field" />
              </div>
              <div className="space-y-1">
                <label className="input-label">Role</label>
                <input type="text" defaultValue={user?.role} disabled className="input-field bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-500 dark:text-gray-400 cursor-not-allowed" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 mt-10 border-t border-white/20 dark:border-gray-800/50 pt-8">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <input type="password" placeholder="Current Password" className="input-field" />
              <input type="password" placeholder="New Password" className="input-field" />
              <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer">
                Update Password
              </button>
            </div>
          </div>
        )}

        {activeTab === 'devices' && (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Active Sessions</h3>
            <div className="space-y-4">
              {activeDevices.map(device => (
                <div key={device.id} className="flex items-center justify-between p-4 rounded-xl border border-white/40 dark:border-gray-700/50 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 text-gray-600 dark:text-gray-400 rounded-lg">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{device.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{device.browser} on {device.os} • {device.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {device.isCurrent ? (
                      <span className="text-xs font-medium text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">Current Session</span>
                    ) : (
                      <button className="text-xs font-medium text-danger hover:text-danger/80 transition-colors cursor-pointer">Revoke Access</button>
                    )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Active: {device.lastActive}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Login History</h3>
            <div className="overflow-x-auto border border-white/40 dark:border-gray-700/50 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                    <th className="px-6 py-3">Date & Time</th>
                    <th className="px-6 py-3">Device / Browser</th>
                    <th className="px-6 py-3">Location & IP</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loginHistory.map((log) => (
                    <tr key={log.id} className="hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors text-sm">
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{new Date(log.time).toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{log.device} • {log.browser}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {log.location}
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{log.ip}</div>
                      </td>
                      <td className="px-6 py-4">
                        {log.status === 'Success' ? (
                          <span className="inline-flex items-center text-success text-xs font-medium"><CheckCircle size={14} className="mr-1.5" /> Success</span>
                        ) : (
                          <span className="inline-flex items-center text-danger text-xs font-medium"><XCircle size={14} className="mr-1.5" /> Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Security Audit Logs</h3>
            <div className="space-y-4">
              {securityLogs.map((log) => (
                <div key={log.id} className="flex gap-4 p-4 rounded-xl border border-white/40 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md/30">
                  <div className="mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-white/40 dark:border-gray-700/50 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <Shield size={14} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{log.action}</h4>
                      <time className="text-xs font-medium text-gray-400 dark:text-gray-500">{new Date(log.time).toLocaleDateString()}</time>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
