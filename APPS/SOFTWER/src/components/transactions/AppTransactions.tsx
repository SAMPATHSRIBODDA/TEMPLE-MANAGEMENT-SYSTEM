import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, RefreshCw, Smartphone, Eye, X } from 'lucide-react';
import Pagination from '../common/Pagination';
import api from '../../services/api';

interface AppTransactionsProps {
  dynamicCategories: any[];
}

export default function AppTransactions({ dynamicCategories }: AppTransactionsProps) {
  const [activeSection, setActiveSection] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [sectionTotals, setSectionTotals] = useState({ upi: 0, card: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const itemsPerPage = 15;

  const tabs = [
    { id: 'All', label: 'All Transactions' },
    { id: 'Laddu Sales', label: 'Laddu' },
    { id: 'Poojas', label: 'Poojas' },
    { id: 'Donations', label: 'Donations' },
    ...dynamicCategories.map(c => ({ id: c.name, label: c.name }))
  ];

  const fetchAppTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        limit: String(itemsPerPage),
        section: activeSection
      };
      if (selectedDate) {
        // Assume user wants that exact date
        const d = new Date(selectedDate);
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        params.startDate = d.toISOString();
        params.endDate = next.toISOString();
      }

      const res = await api.get('/transactions/app-transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.data);
        setTotal(res.data.total);
        if (res.data.sectionTotals) {
          setSectionTotals(res.data.sectionTotals);
        }
      }
    } catch (err) {
      console.error('Failed to fetch app transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeSection, currentPage, selectedDate]);

  useEffect(() => {
    fetchAppTransactions();
  }, [fetchAppTransactions]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'captured': 
      case 'valid': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      
      {/* Dynamic Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar space-x-2 border-b border-gray-200 dark:border-gray-700 pb-px mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveSection(tab.id); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeSection === tab.id 
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">UPI Collected</p>
            <p className="text-2xl font-black text-indigo-600">₹{sectionTotals.upi.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Card Collected</p>
            <p className="text-2xl font-black text-blue-600">₹{sectionTotals.card.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white">₹{sectionTotals.total.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 border border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 items-center justify-between bg-white dark:bg-gray-800 rounded-t-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setCurrentPage(1); }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={fetchAppTransactions}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-sm font-bold text-gray-500">{total} Payments</div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl shadow-sm">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Payment ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date & Time</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Devotee</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Service</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Method</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td></tr>
              ))
            ) : transactions.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No app transactions found</td></tr>
            ) : (
              transactions.map(t => (
                <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-mono text-xs font-bold">{t.transactionId}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(t.date).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{t.user}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded text-xs font-bold">
                      {t.module}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-600 dark:text-gray-400">{t.method}</td>
                  <td className="px-4 py-3 font-black text-gray-900 dark:text-white">₹{t.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedTxn(t)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
      
      {/* View Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold">Payment Details</h3>
              <button onClick={() => setSelectedTxn(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Payment ID</span><span className="font-bold font-mono">{selectedTxn.transactionId}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Devotee</span><span className="font-bold">{selectedTxn.user}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-bold">{selectedTxn.module}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-green-600">₹{selectedTxn.amount}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
