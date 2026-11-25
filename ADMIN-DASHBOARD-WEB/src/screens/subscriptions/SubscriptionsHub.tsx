import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, MoreHorizontal, Check, Zap, Building2, CreditCard, Clock, Settings, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const SubscriptionsHub = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'plans'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = (id: string) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const { data: subscriptionsRes, isLoading: isLoadingSubs } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const res = await api.get('/subscriptions');
      return res.data.data;
    }
  });
  
  const { data: plansRes, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const res = await api.get('/subscriptions/plans');
      return res.data.data;
    }
  });

  const activeSubscriptions = subscriptionsRes || [];
  const subscriptionPlans = plansRes || [];

  const filteredSubs = activeSubscriptions.filter((s: any) => 
    s.templeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.planId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Subscription Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage platform pricing tiers and active temple licenses.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'active' ? 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100'
            }`}
          >
            Active Licenses
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'plans' ? 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100'
            }`}
          >
            Pricing Plans
          </button>
        </div>
      </div>

      {activeTab === 'active' && (
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-300">
          <div className="p-5 border-b border-white/40 dark:border-gray-700/50 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Search by temple name or plan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 h-10 border border-white/40 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
              />
            </div>
            <button className="px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
              <Filter size={16} /> Filters
            </button>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {isLoadingSubs ? (
              <div className="flex justify-center items-center h-full pt-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  <th className="px-6 py-4">Temple</th>
                  <th className="px-6 py-4">Current Plan</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Remaining Days</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-500">No subscriptions found</td></tr>
                ) : filteredSubs.map((sub: any) => {
                  const remainingDays = Math.ceil((new Date(sub.expiryDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                  return (
                  <tr key={sub._id} className="hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">{sub.templeId?.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {sub.templeId?._id?.substring(0,8)}...</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{sub.planId?.name || 'Custom'}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">({sub.billingCycle})</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className={`inline-flex items-center w-2 h-2 rounded-full ${
                          sub.status === 'Active' ? 'bg-success' : sub.status === 'Trial' ? 'bg-warning' : 'bg-danger'
                        }`} />
                        {sub.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        sub.paymentStatus === 'Paid' ? 'bg-success/10 text-success border-success/20' :
                        sub.paymentStatus === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-danger/10 text-danger border-danger/20'
                      }`}>
                        {sub.paymentStatus}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹{sub.amount?.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className={remainingDays > 14 ? 'text-success' : remainingDays > 0 ? 'text-warning' : 'text-danger'} />
                        <span className={`font-semibold text-sm ${remainingDays > 14 ? 'text-gray-900 dark:text-gray-100' : remainingDays > 0 ? 'text-warning' : 'text-danger'}`}>
                          {remainingDays} days
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Exp: {new Date(sub.expiryDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => toggleMenu(sub._id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      
                      {activeMenu === sub._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                          <div className="absolute right-6 top-10 mt-1 w-48 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <Link to={`/subscriptions/${sub.templeId?._id}/manage`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors w-full text-left">
                              <Settings size={14} /> Manage License
                            </Link>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors w-full text-left cursor-pointer">
                              <CreditCard size={14} /> Renew Plan
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-end mb-6">
            <Link to="/subscriptions/plans/new" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
              <Plus size={16} /> Create New Plan
            </Link>
          </div>
          {isLoadingPlans ? (
            <div className="flex justify-center pt-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {subscriptionPlans.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-gray-500">No pricing plans created yet</div>
            ) : subscriptionPlans.map((plan: any) => (
              <div key={plan._id} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm flex flex-col overflow-hidden relative group">
                <div className="p-6 border-b border-white/20 dark:border-gray-800/50 flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">{plan.description || 'No description provided'}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">₹{(plan.monthlyPrice || 0).toLocaleString()}</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/mo</span>
                  </div>
                  
                  <div className="space-y-3">
                    {(plan.features || []).map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check size={16} className="text-success mt-0.5 shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md flex items-center justify-between border-t border-white/20 dark:border-gray-800/50">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{plan.maxLicenses}</span> max licenses
                  </div>
                  <Link to={`/subscriptions/plans/${plan._id}/edit`} className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                    Edit Plan <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
};
