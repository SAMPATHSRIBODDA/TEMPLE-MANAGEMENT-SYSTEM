import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, Users, Ticket, Calendar, Utensils, Heart, 
  Clock, AlertCircle, Printer, Wifi, WifiOff, Activity, Bell, RefreshCw
} from 'lucide-react';
import { useDashboardStore } from '../../store/dashboardStore';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend 
} from 'recharts';

// --- Mock Data for Charts ---
const revenueData = [
  { time: '06:00', amount: 15000 },
  { time: '09:00', amount: 45000 },
  { time: '12:00', amount: 80000 },
  { time: '15:00', amount: 120000 },
  { time: '18:00', amount: 195000 },
  { time: '21:00', amount: 245000 },
];

const ticketData = [
  { name: 'Mon', Entry: 4000, Darshan: 2400 },
  { name: 'Tue', Entry: 3000, Darshan: 1398 },
  { name: 'Wed', Entry: 2000, Darshan: 9800 },
  { name: 'Thu', Entry: 2780, Darshan: 3908 },
  { name: 'Fri', Entry: 1890, Darshan: 4800 },
  { name: 'Sat', Entry: 2390, Darshan: 3800 },
  { name: 'Sun', Entry: 3490, Darshan: 4300 },
];

const ladduData = [
  { name: 'Sold', value: 8500 },
  { name: 'In Stock', value: 3500 },
];
const ladduColors = ['#f97316', '#fed7aa'];

export default function AdminDashboard() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { stats, isLoading, initializeRealtime, cleanupRealtime } = useDashboardStore();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Connect to backend and start real-time socket
    initializeRealtime();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupRealtime();
    };
  }, []);

  const topCards = [
    { 
      label: "Today's Revenue", 
      value: isLoading ? '...' : `₹${stats.todaysRevenue.toLocaleString('en-IN')}`, 
      icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-100" 
    },
    { 
      label: "Today's Visitors", 
      value: isLoading ? '...' : stats.todaysVisitors.toLocaleString('en-IN'), 
      icon: Users, color: "text-blue-600", bg: "bg-blue-100" 
    },
    ...(stats.dynamicSectionsData ? Object.keys(stats.dynamicSectionsData).map(sec => ({
      label: sec,
      value: isLoading ? '...' : stats.dynamicSectionsData![sec].count.toLocaleString('en-IN'),
      icon: Ticket,
      color: "text-purple-600", bg: "bg-purple-100"
    })) : []),
    { label: "Donations", value: "₹45,500", icon: Heart, color: "text-pink-600", bg: "bg-pink-100" },
    { 
      label: "Pending Poojas", 
      value: isLoading ? '...' : String(stats.pendingPoojas), 
      icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" 
    },
    { label: "Inventory Alerts", value: "2 Low", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" },
    { label: "Staff Online", value: "14 Active", icon: Users, color: "text-cyan-600", bg: "bg-cyan-100" },
    { label: "Printer Status", value: "All Ready", icon: Printer, color: "text-green-600", bg: "bg-green-100" },
    { label: "Internet", value: isOnline ? "Online" : "Offline", icon: isOnline ? Wifi : WifiOff, color: isOnline ? "text-green-600" : "text-red-600", bg: isOnline ? "bg-green-100" : "bg-red-100" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Temple Admin Console</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">System overview and real-time statistics.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <button className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
             Export Daily Report
           </button>
        </div>
      </div>

      {/* 11 Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 mb-8">
        {topCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
              <div className={`p-2 rounded-lg ${card.bg} dark:bg-opacity-20 mb-3`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate w-full">{card.label}</p>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{card.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Revenue Trend</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Laddu Stock Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Laddu Stock Overview</h3>
          </div>
          <div className="h-72 w-full flex flex-col items-center justify-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ladduData}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {ladduData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ladduColors[index % ladduColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   formatter={(value: number) => [value.toLocaleString(), 'Laddus']}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-30px]">
               <span className="text-3xl font-black text-gray-900 dark:text-white">12K</span>
               <span className="text-xs font-semibold text-gray-500">Total Prepared</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Sales Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Ticket Sales</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="Entry" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Darshan" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Notifications & Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
          <div className="mb-4 border-b border-gray-100 dark:border-gray-700 pb-4">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
               <Bell className="h-5 w-5 mr-2 text-orange-500" /> Notifications & Alerts
             </h3>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
             
             <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-400 text-sm">Low Laddu Stock Warning</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">Remaining stock is below 20%. Please notify the kitchen.</p>
                  <span className="text-xs text-red-500 mt-2 block">10 mins ago</span>
                </div>
             </div>

             <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl flex items-start gap-3">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Morning Shift Closed</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Counter 2 and 4 have successfully closed their morning shifts.</p>
                  <span className="text-xs text-gray-500 mt-2 block">1 hour ago</span>
                </div>
             </div>

             <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl flex items-start gap-3">
                <Activity className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">New Admin Login</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">System admin accessed the portal from IP 192.168.1.45</p>
                  <span className="text-xs text-gray-500 mt-2 block">2 hours ago</span>
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
}
