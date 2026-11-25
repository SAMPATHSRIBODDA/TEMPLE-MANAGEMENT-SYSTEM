import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import ClosingReceiptView from '../../printer/ClosingReceiptView';
import { Lock, Calculator, AlertCircle, Printer, Download, Users, Banknote, CalendarDays, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const mockCounters = [
  { id: 'C1', staff: 'Rahul', shift: 'Morning', cash: 12500, online: 5000, status: 'Closed' },
  { id: 'C2', staff: 'Priya', shift: 'Morning', cash: 8200, online: 3400, status: 'Closed' },
  { id: 'C3', staff: 'Anand', shift: 'Morning', cash: 15400, online: 8000, status: 'Active' },
];

export default function ClosingDashboard() {
  const { user, logout } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'Shift' | 'Day' | 'Counters') || 'Shift';
  const setActiveTab = (tab: 'Shift' | 'Day' | 'Counters') => setSearchParams({ tab });

  const [openingBalance, setOpeningBalance] = useState<string>('5000');
  const [physicalCashInput, setPhysicalCashInput] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [closingData, setClosingData] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [liveSummary, setLiveSummary] = useState<any>({
    cashCollection: 0, onlineCollection: 0, totalRevenue: 0,
    donationTotal: 0, ticketCount: 0, ladduQuantity: 0, ladduRevenue: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      setSummaryLoading(true);
      try {
        const res = await api.get('/transactions/summary');
        if (res.data.success) setLiveSummary(res.data.data);
      } catch (e) {
        console.warn('Could not fetch closing summary:', e);
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchSummary();
    // Refresh every 60 seconds
    const interval = setInterval(fetchSummary, 60000);
    return () => clearInterval(interval);
  }, []);

  // Use live data from API
  const systemCash = liveSummary.cashCollection || 0;
  const totalOnline = liveSummary.onlineCollection || 0;
  const totalRevenue = liveSummary.totalRevenue || 0;

  const openingBal = parseFloat(openingBalance) || 0;
  const physicalCash = parseFloat(physicalCashInput) || 0;
  
  // Total expected cash = Opening Balance + Cash Collected
  const expectedCash = openingBal + systemCash;
  const discrepancy = physicalCash - expectedCash;

  const handleGenerate = () => {
    if (physicalCashInput === '') {
      alert("Please enter physical cash count.");
      return;
    }
    setClosingData({
      id: `CLS-${Math.floor(Math.random() * 100000)}`,
      timestamp: new Date().toLocaleString(),
      systemCash,
      physicalCash,
      discrepancy,
      totalOnline,
      totalRevenue,
      openingBalance: openingBal,
      expectedCash,
      totalTickets: 312
    });
    setIsGenerated(true);
  };

  const handleDownload = () => {
    alert("Downloading CSV Report...");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-300">
      
      {/* Header & Tabs */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Daily Closing & Cash Management</h2>
        
        <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-gray-200 dark:border-gray-700 pb-px">
          <button
            onClick={() => setActiveTab('Shift')}
            className={`flex items-center px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Shift' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Lock className="w-4 h-4 mr-2" /> Shift Closing
          </button>
          <button
            onClick={() => setActiveTab('Day')}
            className={`flex items-center px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Day' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <CalendarDays className="w-4 h-4 mr-2" /> End of Day Closing
          </button>
          <button
            onClick={() => setActiveTab('Counters')}
            className={`flex items-center px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Counters' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Users className="w-4 h-4 mr-2" /> Counter Collections
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        
        {activeTab === 'Counters' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active & Closed Counters</h3>
              <button className="text-orange-600 text-sm font-bold">Refresh Status</button>
            </div>
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Counter</th>
                  <th className="px-6 py-3">Staff</th>
                  <th className="px-6 py-3">Shift</th>
                  <th className="px-6 py-3 text-right">Cash Collected</th>
                  <th className="px-6 py-3 text-right">Online Collected</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {mockCounters.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{c.id}</td>
                    <td className="px-6 py-4">{c.staff}</td>
                    <td className="px-6 py-4">{c.shift}</td>
                    <td className="px-6 py-4 text-right font-medium">₹{c.cash}</td>
                    <td className="px-6 py-4 text-right font-medium">₹{c.online}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(activeTab === 'Shift' || activeTab === 'Day') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* System Calculation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-fit">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                  <Calculator className="h-5 w-5 text-gray-400 mr-2" /> System Collection Summary
                </h3>
              </div>
              <div className="p-6 space-y-4">
                
                <div className="flex justify-between items-center p-3">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Opening Balance (Float)</span>
                  <input 
                    type="number" 
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    className="w-32 px-3 py-1 text-right font-bold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300 font-medium flex items-center"><Banknote className="w-4 h-4 mr-2" /> Total Cash Sales</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">+ ₹{systemCash.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-800 dark:text-blue-400 font-medium flex items-center"><FileText className="w-4 h-4 mr-2" /> Expected Cash in Drawer</span>
                  <span className="text-xl font-black text-blue-900 dark:text-blue-500">₹{expectedCash.toLocaleString()}</span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                <div className="flex justify-between items-center p-3">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Total Online / UPI</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{totalOnline.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-900 dark:bg-gray-950 rounded-xl text-white mt-4">
                  <span className="font-bold">{activeTab} Total Revenue</span>
                  <span className="text-2xl font-black text-green-400">₹{totalRevenue.toLocaleString()}</span>
                </div>

              </div>
            </div>

            {/* Reconciliation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-fit flex flex-col">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" /> Cash Reconciliation
                </h3>
              </div>
              
              <div className="p-6 flex-1 flex flex-col space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Physical Cash Counted (₹)</label>
                  <input 
                    type="number"
                    value={physicalCashInput}
                    onChange={(e) => setPhysicalCashInput(e.target.value)}
                    disabled={isGenerated}
                    className="w-full text-center text-5xl font-black rounded-xl border-2 border-gray-300 dark:border-gray-600 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all disabled:bg-gray-100 disabled:dark:bg-gray-800"
                    placeholder="0"
                  />
                </div>

                {physicalCashInput !== '' && (
                  <div className={`p-5 rounded-xl border-2 flex items-center ${
                    discrepancy === 0 
                      ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                      : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                  }`}>
                    {discrepancy === 0 ? <CheckCircle2 className="h-8 w-8 mr-4" /> : <AlertCircle className="h-8 w-8 mr-4" />}
                    <div>
                      <p className="font-black text-xl">
                        {discrepancy === 0 ? 'Cash Matches Expected' : `Adjustment Needed: ₹${Math.abs(discrepancy)}`}
                      </p>
                      <p className="text-sm font-medium opacity-80 mt-1">
                        {discrepancy < 0 ? `Shortage of ₹${Math.abs(discrepancy)} detected` : discrepancy > 0 ? `Excess of ₹${discrepancy} detected` : 'Perfectly balanced! Ready to close.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  {!isGenerated ? (
                    <button 
                      onClick={handleGenerate}
                      className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 shadow-md transition-all flex items-center justify-center"
                    >
                      <Lock className="w-5 h-5 mr-2" /> Generate {activeTab} Closing Report
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setClosingData({...closingData})}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md transition-all flex items-center justify-center"
                      >
                        <Printer className="h-5 w-5 mr-2" /> Print
                      </button>
                      <button 
                        onClick={handleDownload}
                        className="flex-1 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center"
                      >
                        <Download className="h-5 w-5 mr-2" /> Download CSV
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {closingData && (
        <ClosingReceiptView 
          data={closingData} 
          onClose={() => setClosingData(null)} 
        />
      )}

    </div>
  );
}
