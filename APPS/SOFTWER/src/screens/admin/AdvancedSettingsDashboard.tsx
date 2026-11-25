import React, { useState } from 'react';
import { Settings, Shield, Image, Megaphone, Calendar as Cal, BookOpen, HardDrive, Smartphone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import AdminDataView from '../../components/admin/AdminDataView';
import { auditLogsConfig, bannersConfig, announcementsConfig, subscriptionsConfig } from './advancedConfigs';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';

const menuGroups = [
  {
    title: 'Content Management',
    items: [
      { id: 'banners', name: 'Banners', icon: Image },
      { id: 'announcements', name: 'Announcements', icon: Megaphone },
      { id: 'festivals', name: 'Festivals', icon: Cal },
    ]
  },
  {
    title: 'Operations',
    items: [
      { id: 'subscriptions', name: 'Subscriptions', icon: BookOpen },
      { id: 'templates', name: 'Receipt Templates', icon: FileText },
    ]
  },
  {
    title: 'Security & Logs',
    items: [
      { id: 'audit', name: 'Audit Logs', icon: Shield },
      { id: 'backup', name: 'Backup & Restore', icon: HardDrive },
    ]
  },
  {
    title: 'Integrations',
    items: [
      { id: 'sms', name: 'SMS & WhatsApp API', icon: Smartphone },
      { id: 'email', name: 'Email Settings', icon: Mail },
    ]
  }
];

import { useSearchParams } from 'react-router-dom';

export default function AdvancedSettingsDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeModule = searchParams.get('tab') || 'audit';
  const setActiveModule = (tab: string) => setSearchParams({ tab });
  
  // States for custom forms
  const [isSaving, setIsSaving] = useState(false);
  const [showBackupConfirm, setShowBackupConfirm] = useState(false);

  const handleSaveAPI = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('API Settings saved successfully.');
    }, 1000);
  };

  const handleBackup = () => {
    setShowBackupConfirm(false);
    alert('System backup initiated. You will be notified when complete.');
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'audit': return <AdminDataView config={auditLogsConfig} />;
      case 'banners': return <AdminDataView config={bannersConfig} />;
      case 'announcements': return <AdminDataView config={announcementsConfig} />;
      case 'subscriptions': return <AdminDataView config={subscriptionsConfig} />;
      
      // Custom Integration Form Example
      case 'sms': return (
        <div className="animate-in fade-in duration-300 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">SMS & WhatsApp Gateway</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Configure third-party providers for sending OTPs and receipt links.</p>
          
          <form onSubmit={handleSaveAPI} className="max-w-2xl bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">SMS Provider Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:text-white">
                  <option>Twilio</option>
                  <option>MSG91</option>
                  <option>AWS SNS</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
                  <input type="password" value="****************" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:text-white" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender ID</label>
                  <input type="text" value="TMSRCP" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:text-white" readOnly />
                </div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-bold shadow-sm disabled:opacity-70 flex items-center justify-center">
                  {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
                <button type="button" className="w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold shadow-sm">Test Connection</button>
              </div>
            </div>
          </form>
        </div>
      );

      // Custom Backup Action Example
      case 'backup': return (
        <div className="animate-in fade-in duration-300 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">System Backup & Restore</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Create manual database snapshots or restore from a previous point.</p>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 p-3 rounded-full">
                <HardDrive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Create Snapshot</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Backs up all master data, transactions, and settings.</p>
              </div>
            </div>
            <button onClick={() => setShowBackupConfirm(true)} className="px-6 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
              Initiate Manual Backup
            </button>
          </div>
          <ConfirmationDialog
            isOpen={showBackupConfirm}
            title="Initiate Backup"
            message="Creating a backup may briefly slow down the system. Do you want to proceed?"
            confirmText="Proceed"
            isDestructive={false}
            onConfirm={handleBackup}
            onCancel={() => setShowBackupConfirm(false)}
          />
        </div>
      );

      default: return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 animate-in fade-in">
          <Settings className="h-12 w-12 mb-3 opacity-20" />
          <p>This module is currently under construction.</p>
        </div>
      );
    }
  };

  const allTabs = menuGroups.flatMap(group => group.items);

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 pb-10">
      
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Advanced Settings</h2>
        
        <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-gray-200 dark:border-gray-700 pb-px">
          {allTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-0">
        {renderContent()}
      </div>
      
    </div>
  );
}
