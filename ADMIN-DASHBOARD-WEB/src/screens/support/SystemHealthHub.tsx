import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Server, Smartphone, Users, Building2, AlertTriangle, ShieldCheck, Ticket, HeadphonesIcon, MonitorPlay, BellRing, Terminal } from 'lucide-react';
import { healthMetrics, systemLogs, securityEvents } from '../../data/mockData';

export const SystemHealthHub = () => {
  const [activeTab, setActiveTab] = useState<'errors' | 'security'>('errors');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">System Monitoring & Support</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Network Operations Center (NOC) and Support Hub.</p>
      </div>

      {/* Health KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm col-span-1 lg:col-span-2 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Traffic</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{healthMetrics.activeUsers.toLocaleString()}</h2>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Users</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <Building2 size={14} /> {healthMetrics.onlineTemples} Temples Online
            </div>
          </div>
          <div className="h-16 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthMetrics.activeTraffic}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} fill="url(#colorTraffic)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-primary" />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">API Health</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{healthMetrics.apiUptime}%</h3>
          <div className="flex items-center gap-1.5 text-success">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider">Operational</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Server size={16} className="text-primary" />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Desktop Software</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{healthMetrics.softwareUptime}%</h3>
          <div className="flex items-center gap-1.5 text-success">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider">Operational</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={16} className="text-primary" />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Mobile Apps</p>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{healthMetrics.appUptime}%</h3>
          <div className="flex items-center gap-1.5 text-success">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider">Operational</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Terminal */}
        <div className="lg:col-span-2 bg-[#0F172A] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-gray-800 h-[400px]">
          <div className="flex items-center justify-between bg-[#1E293B] px-4 h-12 border-b border-gray-800">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-danger/80"></div>
              <div className="w-3 h-3 rounded-full bg-warning/80"></div>
              <div className="w-3 h-3 rounded-full bg-success/80"></div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('errors')}
                className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-colors cursor-pointer ${activeTab === 'errors' ? 'bg-gray-800 text-white' : 'text-gray-400 dark:text-gray-500 hover:text-white'}`}
              >
                system.log
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-colors cursor-pointer ${activeTab === 'security' ? 'bg-gray-800 text-white' : 'text-gray-400 dark:text-gray-500 hover:text-white'}`}
              >
                auth_audit.log
              </button>
            </div>
            <Terminal size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs custom-scrollbar">
            {activeTab === 'errors' ? (
              <div className="space-y-2">
                {systemLogs.map(log => (
                  <div key={log.id} className="flex gap-3 hover:bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl/5 p-1 rounded transition-colors">
                    <span className="text-gray-500 dark:text-gray-400 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className={`shrink-0 font-bold ${log.level === 'ERROR' ? 'text-danger' : log.level === 'WARN' ? 'text-warning' : 'text-primary'}`}>[{log.level}]</span>
                    <span className="text-emerald-400 shrink-0">[{log.source}]</span>
                    <span className="text-gray-300">{log.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {securityEvents.map(event => (
                  <div key={event.id} className="flex gap-3 hover:bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl/5 p-1 rounded transition-colors">
                    <span className="text-gray-500 dark:text-gray-400 shrink-0">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    <span className={`shrink-0 font-bold ${event.action.includes('Failed') ? 'text-danger' : 'text-success'}`}>[{event.action}]</span>
                    <span className="text-purple-400 shrink-0">{event.user}</span>
                    <span className="text-gray-300">via {event.device} ({event.ip}) {event.target && `-> ${event.target}`}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Support Actions */}
        <div className="flex flex-col gap-4">
          <button className="flex items-center gap-4 p-5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer text-left">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Ticket size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">Raise Ticket</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Escalate issues to engineering</p>
            </div>
          </button>
          
          <button className="flex items-center gap-4 p-5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer text-left">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success group-hover:scale-110 transition-transform">
              <HeadphonesIcon size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Customer Support</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Join active temple support chats</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer text-left">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
              <MonitorPlay size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Remote Assistance</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Initiate secure screen-sharing</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm hover:border-primary/50 hover:shadow-md transition-all group cursor-pointer text-left">
            <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center text-danger group-hover:scale-110 transition-transform">
              <BellRing size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Maintenance Alert</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Broadcast downtime notifications</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
