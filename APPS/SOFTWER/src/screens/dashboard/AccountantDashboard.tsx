import React, { useEffect } from 'react';
import { 
  IndianRupee, 
  CreditCard, 
  Banknote, 
  TrendingUp, 
  Download,
  Calendar,
  Ticket,
  Package,
  HeartHandshake,
  RotateCcw,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStore } from '../../store/dashboardStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function AccountantDashboard() {
  const { user } = useAuthStore();
  const { stats, isLoading, initializeRealtime, cleanupRealtime } = useDashboardStore();

  useEffect(() => {
    initializeRealtime();
    return () => cleanupRealtime();
  }, []);

  const metrics = [
    { label: "Today's Revenue",       value: isLoading ? '...' : fmt(stats.todaysRevenue),    icon: IndianRupee,    color: "bg-emerald-100 text-emerald-700" },
    { label: "Cash Collection",        value: isLoading ? '...' : fmt(stats.cashCollection),   icon: Banknote,       color: "bg-green-100 text-green-700" },
    { label: "Online/UPI Collection",  value: isLoading ? '...' : fmt(stats.onlineCollection), icon: CreditCard,     color: "bg-blue-100 text-blue-700" },
    { label: "Today's Donations",      value: isLoading ? '...' : fmt(stats.donationRevenue),  icon: HeartHandshake, color: "bg-rose-100 text-rose-700" },
    { label: "Laddu Sales Revenue",    value: isLoading ? '...' : fmt(stats.ladduRevenue),     icon: Package,        color: "bg-orange-100 text-orange-700" },
    { label: "Darshan Revenue",        value: isLoading ? '...' : fmt(stats.darshanRevenue),   icon: Calendar,       color: "bg-purple-100 text-purple-700" },
    { label: "Entry Ticket Revenue",   value: isLoading ? '...' : fmt(stats.entryRevenue),     icon: Ticket,         color: "bg-sky-100 text-sky-700" },
    { label: "Today's Visitors",       value: isLoading ? '...' : stats.todaysVisitors.toLocaleString('en-IN'), icon: Activity, color: "bg-amber-100 text-amber-700" },
    { label: "Donations Count",        value: isLoading ? '...' : String(stats.donationCount), icon: RotateCcw,      color: "bg-red-100 text-red-700" },
    { label: "Monthly Revenue",        value: isLoading ? '...' : fmt(stats.monthlyRevenue),   icon: TrendingUp,     color: "bg-teal-100 text-teal-700" },
  ];

  const collectionData = stats.collectionData?.length ? stats.collectionData : [
    { name: 'Cash', value: 0, color: '#10b981' },
    { name: 'Online/UPI', value: 0, color: '#3b82f6' },
  ];
  const moduleRevenueData = stats.moduleRevenueData || [];
  const hourlyData = stats.hourlyData || [];
  const recentReceipts = stats.recentReceipts || [];
  const totalRevenue = stats.todaysRevenue || 1;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Accountant Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Live financial overview — updates instantly when counter sells.
            {isLoading && <span className="ml-2 text-orange-500 animate-pulse">Loading...</span>}
          </p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 shadow-sm transition-colors">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {metrics.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between hover:border-gray-300 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color} dark:bg-opacity-20`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{stat.value}</h3>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Daily Revenue Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Today's Hourly Revenue Trend
          </h3>
          <div className="h-[300px]">
            {hourlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                {isLoading ? 'Loading chart data...' : 'No transactions recorded today yet.'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 11}} tickFormatter={(v) => `₹${v/1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Collection Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Collection Breakdown</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={collectionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {collectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {collectionData.map((entry) => (
              <div key={entry.name} className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue by Module */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Revenue by Module</h3>
          <div className="space-y-5">
            {moduleRevenueData.map((module) => {
              const percentage = (module.value / totalRevenue) * 100;
              return (
                <div key={module.name}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{module.name}</span>
                    <span className="font-black text-gray-900 dark:text-white">{fmt(module.value)}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-700" 
                      style={{ width: `${Math.min(100, percentage)}%`, backgroundColor: module.color }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {moduleRevenueData.length === 0 && (
              <p className="text-gray-400 text-center py-8 text-sm">{isLoading ? 'Loading...' : 'No transactions today.'}</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
            <span className="text-xs text-gray-400">Live</span>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-72">
            {recentReceipts.length === 0 && (
              <p className="text-gray-400 text-center py-8 text-sm">{isLoading ? 'Loading...' : 'No transactions today.'}</p>
            )}
            {recentReceipts.map((r: any) => (
              <div key={r._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {r.items?.[0]?.itemType || 'Transaction'}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="mr-2">{r.receiptNumber}</span>
                    <span className="px-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{r.paymentMethod}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{fmt(r.totalAmount)}</p>
                  <p className="text-[10px] font-bold uppercase text-green-600">Captured</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Requests (static placeholder) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              <RotateCcw className="w-5 h-5 mr-2 text-red-500" /> Refund Requests
            </h3>
          </div>
          <p className="text-gray-500 text-center py-4 font-medium text-sm">No pending refunds.</p>
        </div>

      </div>
    </div>
  );
}
