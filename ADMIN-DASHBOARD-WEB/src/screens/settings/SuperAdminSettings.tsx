import React, { useState } from 'react';
import { Settings, CreditCard, MessageSquare, Mail, Smartphone, Megaphone, Image as ImageIcon, Tag, Bell, Database, RotateCcw, ShieldCheck, Users, Search, Download, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { systemRoles } from '../../data/mockData';

export const SuperAdminSettings = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const queryClient = useQueryClient();

  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: CreditCard, description: 'Gateways & APIs' },
    { id: 'marketing', label: 'Marketing', icon: Megaphone, description: 'Coupons & Banners' },
    { id: 'data', label: 'Data Management', icon: Database, description: 'Backups & Restore' },
    { id: 'access', label: 'Access Control', icon: ShieldCheck, description: 'Roles & Permissions' }
  ];

  const IntegrationsView = () => {
    const { data: settings, isLoading } = useQuery({
      queryKey: ['system-settings'],
      queryFn: async () => {
        const res = await api.get('/system/settings');
        return res.data.data;
      }
    });

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" size={32} /></div>;

    const gatewaySettings = settings?.find((s: any) => s.category === 'PaymentGateway')?.settings || { stripeKey: 'sk_live_...' };
    const smsSettings = settings?.find((s: any) => s.category === 'SMSGateway')?.settings || { twilioAccountSid: 'AC...' };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:bg-slate-800 p-6 rounded-2xl border border-white/40 dark:border-gray-700/50 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 dark:text-white">Payment Gateway</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400">Stripe / Razorpay API keys</p>
                </div>
              </div>
              <div className="w-11 h-6 rounded-full bg-success relative cursor-pointer">
                <div className="absolute top-1 left-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl w-4 h-4 rounded-full translate-x-5"></div>
              </div>
            </div>
            <div className="space-y-3">
              <input type="password" value={gatewaySettings.stripeKey || ''} readOnly className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-white font-mono text-sm" />
              <button className="text-sm font-semibold text-primary hover:underline cursor-pointer">Test Connection</button>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:bg-slate-800 p-6 rounded-2xl border border-white/40 dark:border-gray-700/50 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 dark:text-white">SMS Gateway</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400">Twilio / MSG91 configuration</p>
                </div>
              </div>
              <div className="w-11 h-6 rounded-full bg-success relative cursor-pointer">
                <div className="absolute top-1 left-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl w-4 h-4 rounded-full translate-x-5"></div>
              </div>
            </div>
            <div className="space-y-3">
              <input type="password" value={smsSettings.twilioAccountSid || ''} readOnly className="input-field dark:bg-slate-900 dark:border-slate-700 dark:text-white font-mono text-sm" />
              <button className="text-sm font-semibold text-primary hover:underline cursor-pointer">Test Connection</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MarketingView = () => {
    const { data: activeCoupons = [], isLoading } = useQuery({
      queryKey: ['system-coupons'],
      queryFn: async () => {
        const res = await api.get('/system/coupons');
        return res.data.data;
      }
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:bg-slate-800 rounded-2xl border border-white/40 dark:border-gray-700/50 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/20 dark:border-gray-800/50 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 dark:text-white">Active Coupons</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-slate-400">Manage promotional discounts across all temples.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input type="text" placeholder="Search coupons..." className="pl-9 pr-4 py-2 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md dark:bg-slate-900 border border-transparent dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
              </div>
              <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                <Plus size={16} /> New Coupon
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : activeCoupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md dark:bg-slate-900/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 dark:text-slate-400 font-semibold border-b border-white/20 dark:border-gray-800/50 dark:border-slate-700">
                    <th className="px-6 py-4">Code</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Usage</th>
                    <th className="px-6 py-4">Valid Until</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {activeCoupons.map((coupon: any, i: number) => (
                    <tr key={i} className="hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900 dark:text-gray-100 dark:text-white">{coupon.code}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 dark:text-gray-100 dark:text-white">{coupon.discountValue}{coupon.discountType === 'Percentage' ? '%' : '₹'}</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400">{coupon.discountType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 mb-1 max-w-[100px]">
                          <div className={`h-1.5 rounded-full ${coupon.usageCount >= coupon.usageLimit ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400">{coupon.usageCount} / {coupon.usageLimit}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 dark:text-white">{new Date(coupon.validUntil).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                          coupon.isActive ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'
                        }`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 dark:text-slate-500 mb-4">
                <Tag size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 dark:text-white mb-1">No Active Coupons</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-slate-400 max-w-sm">You haven't created any promotional coupons yet. Create one to boost sales.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DataView = () => {
    const { data: systemBackups = [], isLoading } = useQuery({
      queryKey: ['system-backups'],
      queryFn: async () => {
        const res = await api.get('/system/backups');
        return res.data.data;
      }
    });

    const triggerBackup = useMutation({
      mutationFn: async () => {
        await api.post('/system/backups');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['system-backups'] });
      }
    });

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:bg-slate-800 rounded-2xl border border-white/40 dark:border-gray-700/50 dark:border-slate-700 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 dark:text-white">System Backups</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-slate-400">Automated daily snapshots of all temple databases.</p>
            </div>
            <button 
              onClick={() => triggerBackup.mutate()}
              disabled={triggerBackup.isPending}
              className="px-4 py-2 bg-gray-900 dark:bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl text-white dark:text-gray-900 dark:text-gray-100 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {triggerBackup.isPending ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />} 
              Generate Manual Backup
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <div className="space-y-3">
              {systemBackups.map((backup: any) => (
                <div key={backup._id || backup.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md dark:bg-slate-900/50 border border-white/20 dark:border-gray-800/50 dark:border-slate-700 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:bg-slate-800 border border-white/40 dark:border-gray-700/50 dark:border-slate-600 rounded-lg flex items-center justify-center text-primary">
                      <Database size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 dark:text-white">{backup.fileName || backup.id} <span className="font-normal text-gray-500 dark:text-gray-400 dark:text-slate-400 text-sm ml-2">- {backup.backupType || backup.type}</span></p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400">{new Date(backup.createdAt || backup.date).toLocaleString()} • {backup.size}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-3">
                    <span className="text-xs font-bold text-success uppercase tracking-wider">{backup.status}</span>
                    <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors cursor-pointer" title="Restore">
                      <RotateCcw size={18} />
                    </button>
                    <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors cursor-pointer" title="Download">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {systemBackups.length === 0 && (
                <div className="text-center py-8 text-gray-500">No backups found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const AccessView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:bg-slate-800 rounded-2xl border border-white/40 dark:border-gray-700/50 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/20 dark:border-gray-800/50 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 dark:text-white">Role & Permission Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-slate-400">Control system access levels for staff.</p>
          </div>
          <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Plus size={16} /> New Role
          </button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-slate-700">
          {systemRoles.map(role => (
            <div key={role.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md dark:hover:bg-slate-700/30 transition-colors">
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 dark:text-white flex items-center gap-2">
                  {role.name} <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 dark:text-slate-300 text-xs rounded-full">{role.users} Users</span>
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {role.permissions.map(perm => (
                    <span key={perm} className="text-xs font-medium text-primary bg-primary/5 border border-primary/10 px-2 py-1 rounded-md">{perm}</span>
                  ))}
                </div>
              </div>
              <button className="text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer">Edit Role</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-white tracking-tight">Super Admin Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 dark:text-slate-400 text-sm mt-1">Platform configuration, security, and global preferences.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Vertical Tabs Navigation */}
        <div className="w-full md:w-64 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl dark:bg-slate-800 border border-white/40 dark:border-gray-700/50 dark:border-slate-700 rounded-2xl shadow-sm flex flex-col overflow-y-auto shrink-0 p-3 gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left p-4 rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                activeTab === tab.id ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20' : 'hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md dark:hover:bg-slate-700/50 border border-transparent'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-primary' : 'text-gray-400 dark:text-gray-500 dark:text-slate-500'} />
              <div>
                <p className={`font-bold text-sm ${activeTab === tab.id ? 'text-primary' : 'text-gray-900 dark:text-gray-100 dark:text-white'}`}>{tab.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-slate-400 mt-0.5 hidden md:block">{tab.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === 'integrations' && <IntegrationsView />}
          {activeTab === 'marketing' && <MarketingView />}
          {activeTab === 'data' && <DataView />}
          {activeTab === 'access' && <AccessView />}
        </div>
      </div>
    </div>
  );
};
