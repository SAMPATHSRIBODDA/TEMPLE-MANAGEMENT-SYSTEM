import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, RefreshCw, Eye, X, FileText } from 'lucide-react';
import Pagination from '../common/Pagination';
import api from '../../services/api';

interface CounterTransactionsProps {
  dynamicCategories: any[];
}

export default function CounterTransactions({ dynamicCategories }: CounterTransactionsProps) {
  const [activeSection, setActiveSection] = useState('All');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [sectionTotals, setSectionTotals] = useState({ cash: 0, online: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCounter, setSelectedCounter] = useState('All');
  const [counters, setCounters] = useState<any[]>([]);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const tabs = [
    { id: 'All', label: 'All Transactions' },
    { id: 'Laddu Sales', label: 'Laddu' },
    { id: 'Poojas', label: 'Poojas' },
    { id: 'Donations', label: 'Donations' },
    ...dynamicCategories.map(c => ({ id: c.name, label: c.name }))
  ];

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        limit: String(itemsPerPage),
        section: activeSection
      };
      if (selectedDate) params.date = selectedDate;
      if (selectedCounter !== 'All') params.counterId = selectedCounter;

      const res = await api.get('/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.data);
        setTotal(res.data.total);
        if (res.data.sectionTotals) {
          setSectionTotals(res.data.sectionTotals);
        }
      }
    } catch (err) {
      console.error('Failed to fetch counter transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeSection, currentPage, selectedDate, selectedCounter]);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const res = await api.get('/staff');
        if (res.data.success) {
          // Filter to just Counter Staff if needed, but for now we take all returned staff
          setCounters(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch staff list', err);
      }
    };
    fetchCounters();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Cash': return 'bg-emerald-100 text-emerald-700';
      case 'UPI': return 'bg-blue-100 text-blue-700';
      case 'Card': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-600';
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
                ? 'border-orange-600 text-orange-600 dark:text-orange-400' 
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
            <p className="text-xs font-bold text-gray-500 uppercase">Cash Collected</p>
            <p className="text-2xl font-black text-emerald-600">₹{sectionTotals.cash.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Online Collected</p>
            <p className="text-2xl font-black text-blue-600">₹{sectionTotals.online.toLocaleString('en-IN')}</p>
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
      <div className="p-4 border border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 items-center justify-between bg-white dark:bg-gray-800 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setCurrentPage(1); }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCounter}
              onChange={e => { setSelectedCounter(e.target.value); setCurrentPage(1); }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Counters</option>
              {counters.map(c => (
                <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchTransactions}
            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-sm font-bold text-gray-500">{total} Receipts</div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl shadow-sm">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Receipt #</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Counter</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Item Breakdown</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Method</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></td></tr>
              ))
            ) : transactions.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No receipts found</td></tr>
            ) : (
              transactions.map(t => (
                <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-mono text-xs font-bold">{t.receiptNumber}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs font-medium">
                    {t.issuedBy ? `${t.issuedBy.firstName} ${t.issuedBy.lastName || ''}` : 'System'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {t.items?.map((item: any, idx: number) => (
                        <div key={idx} className="text-xs flex justify-between gap-4">
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {item.description || item.categoryName || item.itemType} x{item.quantity}
                          </span>
                          {item.price && <span className="text-gray-500">₹{item.price}</span>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(t.paymentMethod)}`}>
                      {t.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-black text-gray-900 dark:text-white">₹{t.totalAmount}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedTxn(t)} className="p-1.5 text-gray-400 hover:text-orange-600 rounded">
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

      {selectedTxn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold">Receipt Details</h3>
              <button onClick={() => setSelectedTxn(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Receipt #</span><span className="font-bold font-mono">{selectedTxn.receiptNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Amount</span><span className="font-bold text-green-600">₹{selectedTxn.totalAmount}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-bold">{selectedTxn.paymentMethod}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
