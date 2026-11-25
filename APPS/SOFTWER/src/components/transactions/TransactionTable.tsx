import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, Printer, Eye, Calendar, X, FileText, RefreshCw } from 'lucide-react';
import Pagination from '../common/Pagination';
import api from '../../services/api';
import { socket, connectSocket } from '../../services/socket';

export type TransactionCategory = 'All' | 'Cash' | 'Online' | 'Donations' | 'Refunds' | 'ReceiptHistory';

interface TransactionTableProps {
  category: TransactionCategory;
}

export default function TransactionTable({ category }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        limit: String(itemsPerPage),
        category: category !== 'All' ? category : ''
      };
      if (selectedDate) params.date = selectedDate;

      const res = await api.get('/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [category, currentPage, selectedDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Live update on socket event
  useEffect(() => {
    connectSocket();
    socket.on('DASHBOARD_UPDATE', fetchTransactions);
    return () => { socket.off('DASHBOARD_UPDATE', fetchTransactions); };
  }, [fetchTransactions]);

  const getItemType = (r: any) => r.items?.[0]?.itemType || 'Transaction';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Cash': return 'bg-emerald-100 text-emerald-700';
      case 'UPI': return 'bg-blue-100 text-blue-700';
      case 'Card': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const filteredData = safeTransactions.filter(r => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (r.receiptNumber?.toLowerCase() || '').includes(term) ||
      (r.issuedToName?.toLowerCase() || '').includes(term) ||
      (r.paymentMethod?.toLowerCase() || '').includes(term)
    );
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full animate-in fade-in duration-300">

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-3 items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-t-xl">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setCurrentPage(1); }}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            onClick={fetchTransactions}
            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-bold text-gray-900 dark:text-white">{total}</span> records
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 sticky top-0">
            <tr>
              {['Receipt #', 'Date & Time', 'Module', 'Amount', 'Method', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No transactions found</p>
                </td>
              </tr>
            ) : filteredData.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {r.receiptNumber}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap text-xs">
                  {new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded text-xs font-bold">
                    {getItemType(r)}
                  </span>
                </td>
                <td className="px-4 py-3 font-black text-gray-900 dark:text-white">
                  ₹{r.totalAmount?.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getMethodColor(r.paymentMethod)}`}>
                    {r.paymentMethod}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(r.status)}`}>
                    {r.status || 'valid'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedTxn(r)}
                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, total)} of {total}</span>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {/* View Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Receipt Details</h3>
              <button onClick={() => setSelectedTxn(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Receipt #</span><span className="font-bold font-mono">{selectedTxn.receiptNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-bold">{new Date(selectedTxn.createdAt).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-green-600">₹{selectedTxn.totalAmount?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-bold">{selectedTxn.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-bold capitalize">{selectedTxn.status}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Items</span><span className="font-bold">{selectedTxn.items?.length || 0}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
