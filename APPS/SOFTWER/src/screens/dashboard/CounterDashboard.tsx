import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, Users, Ticket, Calendar, Utensils, 
  Clock, Printer, Wifi, WifiOff 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';

export default function CounterDashboard() {
  const { shift, counterNumber } = useAuthStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dynamicSections, setDynamicSections] = useState<string[]>([]);
  const { stats, isLoading, initializeRealtime, cleanupRealtime } = useDashboardStore();

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/ticket-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const sections = Array.from(new Set(data.data.map((t:any) => t.sectionName)));
          setDynamicSections(sections as string[]);
        }
      })
      .catch(console.error);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    initializeRealtime();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupRealtime();
    };
  }, []);

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const statCards = [
    { label: "Today's Revenue",   value: isLoading ? '...' : fmt(stats.todaysRevenue),                         icon: IndianRupee, color: "bg-green-100 text-green-700" },
    { label: "Today's Visitors",  value: isLoading ? '...' : stats.todaysVisitors.toLocaleString('en-IN'),    icon: Users,       color: "bg-blue-100 text-blue-700" },
    ...dynamicSections.map((sec) => ({
      label: sec,
      value: isLoading ? '...' : ((stats.dynamicSectionsData && stats.dynamicSectionsData[sec]) ? stats.dynamicSectionsData[sec].count.toLocaleString('en-IN') : '0'),
      icon: Ticket,
      color: "bg-indigo-100 text-indigo-700"
    }))
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Counter Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Live statistics for {counterNumber}</p>
        </div>
        
        {/* System Status Badges */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="flex flex-1 md:flex-none justify-center items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{shift} Shift</span>
          </div>
          <div className="flex flex-1 md:flex-none justify-center items-center px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <Printer className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Printer Ready</span>
          </div>
          <div className={`flex flex-1 md:flex-none justify-center items-center px-3 py-1.5 border rounded-lg shadow-sm ${isOnline ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50'}`}>
            {isOnline ? (
               <Wifi className="h-4 w-4 text-green-500 mr-2" />
            ) : (
               <WifiOff className="h-4 w-4 text-red-500 mr-2 animate-pulse" />
            )}
            <span className={`text-sm font-medium ${isOnline ? 'text-gray-700 dark:text-gray-300' : 'text-red-700 dark:text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center hover:shadow-md transition-shadow duration-200"
            >
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${stat.color} dark:bg-opacity-20`}>
                <Icon className="h-7 w-7" />
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Quick Actions */}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-12 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {dynamicSections.map((section, i) => {
          let path = `/pos/${encodeURIComponent(section)}`;
          if (section === 'Entry Tickets') path = '/entry';
          if (section === 'Darshan') path = '/darshan';
          if (section === 'Laddu Sales') path = '/laddu';

          return (
            <Link 
              key={i} 
              to={path}
              className="flex items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-500 dark:hover:border-orange-500 hover:shadow text-gray-700 dark:text-gray-300 font-medium transition-all text-sm text-center"
            >
              {section}
            </Link>
          );
        })}
        <button className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium transition-all text-sm text-center">
          Reprint Last Ticket
        </button>
      </div>
    </div>
  );
}
