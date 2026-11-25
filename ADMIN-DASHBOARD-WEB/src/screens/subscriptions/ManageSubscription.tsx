import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, RefreshCw, AlertTriangle, ArrowUpCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { activeSubscriptions, subscriptionPlans } from '../../data/mockData';

export const ManageSubscription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sub = activeSubscriptions.find(s => s.templeId === id);
  const plan = subscriptionPlans.find(p => p.id === sub?.planId);

  const [isLoading, setIsLoading] = useState(false);

  if (!sub || !plan) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">License Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Could not locate subscription data for this temple.</p>
        <button onClick={() => navigate('/subscriptions')} className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium cursor-pointer">Go Back</button>
      </div>
    );
  }

  const handleAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/subscriptions');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-5xl">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/subscriptions" className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Manage License: {sub.templeName}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
              sub.status === 'Active' ? 'bg-success/10 text-success border-success/20' :
              sub.status === 'Trial' ? 'bg-warning/10 text-warning border-warning/20' :
              'bg-danger/10 text-danger border-danger/20'
            }`}>
              {sub.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
            Subscription ID: {sub.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Plan Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 relative z-10">Current Plan Overview</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plan Tier</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{plan.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Billing Cycle</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{sub.billingCycle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{sub.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {sub.paymentStatus === 'Paid' ? <CheckCircle2 size={16} className="text-success" /> : <AlertTriangle size={16} className="text-warning" />}
                  <span className={`text-sm font-semibold ${sub.paymentStatus === 'Paid' ? 'text-success' : 'text-warning'}`}>{sub.paymentStatus}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-xl border border-white/20 dark:border-gray-800/50 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">License Validity</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(sub.startDate).toLocaleDateString()} — {new Date(sub.expiryDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${sub.remainingDays > 14 ? 'text-gray-900 dark:text-gray-100' : 'text-danger'}`}>{sub.remainingDays}</p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Days Remaining</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Upgrade / Downgrade Plan</h3>
            <div className="space-y-4">
              {subscriptionPlans.map((p) => (
                <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl border ${p.id === plan.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/40 dark:border-gray-700/50 hover:border-gray-300'}`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 dark:text-gray-100">{p.name}</span>
                      {p.id === plan.id && <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{p.description}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-bold text-gray-900 dark:text-gray-100">₹{p.monthlyPrice.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/mo</span>
                    </div>
                    {p.id !== plan.id && (
                      <button className="px-3 py-1.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md shadow-sm transition-colors cursor-pointer">
                        Select
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button onClick={handleAction} className="w-full flex items-center justify-between p-3 rounded-xl border border-white/40 dark:border-gray-700/50 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <RefreshCw size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Renew License</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Extend current plan validity</p>
                  </div>
                </div>
              </button>

              <button onClick={handleAction} className="w-full flex items-center justify-between p-3 rounded-xl border border-white/40 dark:border-gray-700/50 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-600 dark:text-gray-400 group-hover:bg-warning/10 group-hover:text-warning transition-colors">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Extend Trial</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add 14 days to trial period</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="h-px bg-gray-100 my-6"></div>

            <div className="space-y-3">
              <button onClick={handleAction} className="w-full flex items-center justify-between p-3 rounded-xl border border-danger/20 hover:bg-danger/5 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-danger/10 text-danger">
                    <ShieldAlert size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-danger">Suspend License</p>
                    <p className="text-xs text-danger/70">Immediately revoke access</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
