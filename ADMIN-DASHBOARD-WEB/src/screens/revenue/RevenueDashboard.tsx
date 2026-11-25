import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, IndianRupee, TrendingUp, CreditCard, RefreshCw, AlertCircle, Building2, Download, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { revenueByPlan, transactionsList } from '../../data/mockData';

const COLORS = ['#5B4BDB', '#6366F1', '#10B981', '#F59E0B'];

export const RevenueDashboard = () => {
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['super-admin-revenue'],
    queryFn: async () => {
      const res = await api.get('/dashboard/revenue');
      return res.data.data;
    }
  });

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const { totalRevenue = 0, mrr = 0, setupFees = 0, pending = 0, chartData = [], revenueByTemple = [] } = revenueData || {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Revenue Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Financial overview, collections, and transaction ledgers.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><IndianRupee size={48} /></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Revenue (YTD)</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">₹{(totalRevenue/100000).toFixed(1)}M</h2>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-success">
            <ArrowUpRight size={16} /> <span>14.5% vs last year</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><RefreshCw size={48} /></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Monthly Recurring (MRR)</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">₹{(mrr/1000).toFixed(0)}K</h2>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-success">
            <ArrowUpRight size={16} /> <span>8.2% vs last month</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp size={48} /></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Setup & Commissions</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">₹{(setupFees/1000).toFixed(0)}K</h2>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-danger">
            <ArrowDownRight size={16} /> <span>2.1% vs last month</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-warning/30 shadow-sm relative overflow-hidden ring-1 ring-warning/20">
          <div className="absolute top-0 right-0 p-6 opacity-10"><AlertCircle size={48} className="text-warning" /></div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Pending / Overdue</p>
          <div className="flex items-baseline gap-2 mb-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">₹{(pending/1000).toFixed(1)}K</h2>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-warning">
            <AlertCircle size={16} /> <span>Needs immediate action</span>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Revenue Breakdown</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Subscriptions vs Setup vs Commissions</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setTimeframe('month')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${timeframe === 'month' ? 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100'}`}>6 Months</button>
              <button onClick={() => setTimeframe('year')} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${timeframe === 'year' ? 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100'}`}>12 Months</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B4BDB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5B4BDB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSetup" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                />
                <Area type="monotone" dataKey="subscriptions" stackId="1" stroke="#5B4BDB" strokeWidth={2} fill="url(#colorSub)" name="Subscriptions" />
                <Area type="monotone" dataKey="setup" stackId="1" stroke="#10B981" strokeWidth={2} fill="url(#colorSetup)" name="Setup Fees" />
                <Area type="monotone" dataKey="commissions" stackId="1" stroke="#F59E0B" strokeWidth={2} fill="none" name="Commissions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Revenue by Plan</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Distribution across subscription tiers</p>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {revenueByPlan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value}%`, undefined]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">45%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Enterprise</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-3 mt-4">
            {revenueByPlan.map((plan, i) => (
              <div key={plan.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{plan.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Temples Table */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/20 dark:border-gray-800/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Top Performing Temples</h3>
            <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold border-b border-white/20 dark:border-gray-800/50">
                  <th className="px-6 py-4">Temple Name</th>
                  <th className="px-6 py-4">Total Revenue</th>
                  <th className="px-6 py-4 text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {revenueByTemple.map((temple: any, i: number) => (
                  <tr key={temple.id} className="hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs">
                          #{i + 1}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{temple.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      ₹{temple.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center text-xs font-bold ${temple.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                        {temple.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Ledger */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/20 dark:border-gray-800/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Transaction Ledger</h3>
            <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer">Full History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold border-b border-white/20 dark:border-gray-800/50">
                  <th className="px-6 py-4">Transaction</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactionsList.map((trx) => (
                  <tr key={trx.id} className="hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">{trx.type}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{trx.templeName} • {trx.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold text-sm ${trx.amount < 0 ? 'text-danger' : 'text-gray-900 dark:text-gray-100'}`}>
                        {trx.amount < 0 ? '-' : ''}₹{Math.abs(trx.amount).toLocaleString()}
                      </span>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{new Date(trx.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        trx.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                        trx.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-danger/10 text-danger border-danger/20'
                      }`}>
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};
