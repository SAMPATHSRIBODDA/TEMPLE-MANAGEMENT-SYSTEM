import React, { useState } from 'react';
import { 
  Building2, CreditCard, Receipt, Settings, 
  Save, AlertCircle, Plus, Trash2
} from 'lucide-react';

import { useSearchParams } from 'react-router-dom';

export default function AccountantSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'Bank Accounts';
  const setActiveTab = (tab: string) => setSearchParams({ tab });
  
  const tabs = [
    { id: 'Bank Accounts', icon: Building2 },
    { id: 'Payment Methods', icon: CreditCard },
    { id: 'Tax & Financial', icon: Receipt },
    { id: 'Report Settings', icon: Settings }
  ];

  const [banks, setBanks] = useState([
    { id: 1, name: 'State Bank of India', account: 'XXXX-XXXX-1234', ifsc: 'SBIN0001234', active: true },
    { id: 2, name: 'HDFC Bank', account: 'XXXX-XXXX-5678', ifsc: 'HDFC0005678', active: false }
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-300">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Accountant Settings</h2>
        
        {/* Horizontal Navigation */}
        <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-gray-200 dark:border-gray-700 pb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-orange-600 text-orange-600 dark:text-orange-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'}`} />
                {tab.id}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-y-auto">
          
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{activeTab}</h3>
            <button className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors shadow-sm">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'Bank Accounts' && (
              <div className="space-y-6 max-w-3xl">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-sm text-gray-500">Manage bank accounts used for online settlements and bulk deposits.</p>
                  <button className="w-full sm:w-auto flex items-center justify-center text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
                    <Plus className="w-4 h-4 mr-1" /> Add Account
                  </button>
                </div>

                <div className="grid gap-4">
                  {banks.map(bank => (
                    <div key={bank.id} className={`p-4 border-2 rounded-xl flex items-center justify-between ${bank.active ? 'border-orange-500 bg-orange-50/30' : 'border-gray-200 dark:border-gray-700'}`}>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{bank.name}</h4>
                        <div className="flex gap-4 mt-1 text-sm text-gray-500">
                          <span>A/c: {bank.account}</span>
                          <span>IFSC: {bank.ifsc}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" checked={bank.active} onChange={() => {}} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${bank.active ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${bank.active ? 'transform translate-x-4' : ''}`}></div>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {bank.active ? 'Primary' : 'Inactive'}
                          </span>
                        </label>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-lg flex gap-3 text-sm border border-blue-100 dark:border-blue-900/50">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>The <strong>Primary</strong> bank account will be used on all generated invoices, donation receipts, and tax reports.</p>
                </div>
              </div>
            )}

            {activeTab === 'Payment Methods' && (
              <div className="space-y-6 max-w-2xl">
                <p className="text-sm text-gray-500">Enable or disable payment methods across all counter modules.</p>
                
                <div className="space-y-4">
                  {['Cash Handling', 'UPI (Dynamic QR)', 'Credit/Debit Card (POS)', 'Cheque (Donations Only)'].map((method, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{method}</h4>
                        <p className="text-xs text-gray-500 mt-1">Accept {method.toLowerCase()} at ticketing counters.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 3} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Tax & Financial' && (
              <div className="space-y-6 max-w-2xl">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Default Tax Rate (CGST + SGST)</label>
                    <div className="flex gap-4 items-center">
                      <input type="number" defaultValue="0" className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
                      <span className="text-gray-500 font-medium">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Many temple services are tax-exempt. Set to 0 if applicable.</p>
                  </div>
                  
                  <hr className="border-gray-200 dark:border-gray-700" />

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Financial Year Start</label>
                    <select className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500">
                      <option>1st April (Indian FY)</option>
                      <option>1st January (Calendar Year)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Currency Symbol</label>
                    <input type="text" defaultValue="₹" className="w-full max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Report Settings' && (
              <div className="space-y-6 max-w-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Auto-Email Daily Reports</h4>
                      <p className="text-xs text-gray-500 mt-1">Send day closing reports to Admin automatically.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Report Footer Text</label>
                    <textarea 
                      rows={3} 
                      defaultValue="* This is a system-generated financial report."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
    </div>
  );
}
