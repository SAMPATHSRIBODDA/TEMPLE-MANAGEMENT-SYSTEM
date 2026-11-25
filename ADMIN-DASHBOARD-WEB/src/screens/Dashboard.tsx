import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Building2, TrendingUp, CreditCard, Activity, Search, Filter, MoreHorizontal,
  Users, Ticket, AlertCircle, CheckCircle2, Wallet, HeartHandshake, FileX, Loader2
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle }: any) => (
  <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm flex flex-col">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-800/50">
        <Icon size={18} className="text-gray-600 dark:text-gray-400" />
      </div>
      {trendValue && (
        <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-md ${
          trend === 'up' ? 'text-success bg-success/10' : 'text-danger bg-danger/10'
        }`}>
          {trendValue}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-1">{value}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">{title}</p>
      {subtitle && <p className="text-gray-400 dark:text-gray-500 text-[10px] mt-1">{subtitle}</p>}
    </div>
  </div>
);

const SectionHeading = ({ title }: { title: string }) => (
  <h2 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 mt-8">{title}</h2>
);

export const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data.data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {user?.role?.name === 'Super Admin' ? 'Super Admin Dashboard' : 'Temple Dashboard'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of your operations today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors shadow-sm cursor-pointer">
            Export Data
          </button>
        </div>
      </div>

      <SectionHeading title="Today's Overview" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Today's Revenue" value={`₹${stats.todaysRevenue?.toLocaleString() || 0}`} icon={TrendingUp} trend="up" trendValue="Live" />
        <StatCard title="Visitors" value={stats.todaysVisitors?.toLocaleString() || 0} icon={Users} trend="up" trendValue="Live" />
        <StatCard title="Laddus Sold" value={stats.laddusSold?.toLocaleString() || 0} icon={CheckCircle2} />
        <StatCard title="Donations" value={`₹${stats.donationRevenue?.toLocaleString() || 0}`} icon={HeartHandshake} />
      </div>

      <SectionHeading title="Analytics" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm p-6 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Revenue Today (Hourly)</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hourly collection across all modules</p>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B4BDB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5B4BDB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} tickFormatter={(val) => `₹${val}`} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827', fontWeight: 600 }} />
                <Area type="monotone" dataKey="amount" stroke="#5B4BDB" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Collection Breakdown */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Collection Breakdown</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cash vs Online</p>
          </div>
          <div className="h-[260px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.collectionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                  {stats.collectionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#111827', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {stats.collectionData.map((item: any) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- Operational Widgets --- */}
      <SectionHeading title="Operations & Health" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities (2 columns) */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-5 border-b border-white/40 dark:border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Recent Activities</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input type="text" placeholder="Search..." className="pl-8 pr-3 py-1.5 border border-white/40 dark:border-gray-700/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-48" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  <th className="px-5 py-3">Temple</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentActivities.slice(0, 4).map((activity) => (
                  <tr key={activity.id} className="hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors text-sm">
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-gray-100">{activity.temple}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400 font-medium">{activity.type}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-gray-100">₹{activity.amount.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        activity.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                        activity.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-danger/10 text-danger border-danger/20'
                      }`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health & Notifications Container */}
        <div className="flex flex-col gap-6">
          
          {/* System Health */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">System Health</h3>
            <div className="space-y-4">
              {systemHealth.map(sys => (
                <div key={sys.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${sys.status === 'Operational' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sys.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{sys.uptime}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">{sys.latency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm p-5 flex-1">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">Notifications</h3>
            <div className="space-y-4">
              {systemNotifications.map(note => (
                <div key={note.id} className="flex gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    note.type === 'success' ? 'bg-success' :
                    note.type === 'warning' ? 'bg-warning' :
                    note.type === 'danger' ? 'bg-danger' : 'bg-primary'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{note.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{note.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
