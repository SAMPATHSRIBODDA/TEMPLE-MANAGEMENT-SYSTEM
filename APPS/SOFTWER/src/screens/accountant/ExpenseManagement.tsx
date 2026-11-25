import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingDown, BookOpen, Plus, 
  Search, Filter, ArrowUpRight, ArrowDownRight, Briefcase
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

const INCOME_CATEGORIES = [
  'Donations (Manual)', 'Hall Rental', 'Scrap Sale', 'Interest/Bank', 'Events/Sponsorship', 'Other'
];

const EXPENSE_CATEGORIES = [
  'Electricity/Utilities', 'Maintenance/Repairs', 'Flower/Decorations', 
  'Annadanam Supplies', 'Salaries/Wages', 'Transport', 'Other'
];

export default function ExpenseManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  
  // Ledger and Summary State
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0 });
  const [ledger, setLedger] = useState<any[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Filter State
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [search, setSearch] = useState('');

  // Form State (Reusable for both Income & Expense)
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    otherCategory: '', // Used if 'Other' is selected
    description: '',
    sourceOrVendor: '',
    paymentMethod: 'Cash',
    fundedBy: 'General Funds', // Which income source paid for this expense
    otherFundedBy: '' // Used if 'Other' is selected for fundedBy
  });

  useEffect(() => {
    fetchData();
  }, [currentPage, typeFilter, search]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Summary
      const summaryRes = await api.get('/accounting/summary');
      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      }
      
      // 2. Fetch Ledger
      const ledgerRes = await api.get('/accounting/ledger', {
        params: { page: currentPage, limit: itemsPerPage, type: typeFilter, search }
      });
      if (ledgerRes.data.success) {
        setLedger(ledgerRes.data.data);
        setTotalItems(ledgerRes.data.total);
      }
    } catch (err) {
      console.error('Failed to load accounting data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (type: 'INCOME' | 'EXPENSE') => {
    if (!formData.amount || !formData.category) return alert('Amount and Category are required');
    
    const finalCategory = formData.category === 'Other' ? formData.otherCategory : formData.category;
    if (!finalCategory) return alert('Please specify the custom category');

    const finalFundedBy = formData.fundedBy === 'Other' ? formData.otherFundedBy : formData.fundedBy;
    if (type === 'EXPENSE' && formData.fundedBy === 'Other' && !finalFundedBy) {
      return alert('Please specify the custom funding source');
    }

    const payload = {
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: finalCategory,
      description: formData.description,
      [type === 'INCOME' ? 'sourceName' : 'vendorName']: formData.sourceOrVendor,
      paymentMethod: formData.paymentMethod,
      ...(type === 'EXPENSE' && { fundedBy: finalFundedBy })
    };

    try {
      const endpoint = type === 'INCOME' ? '/accounting/income' : '/accounting/expense';
      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        // Reset and close
        setFormData({ amount: '', date: new Date().toISOString().split('T')[0], category: '', otherCategory: '', description: '', sourceOrVendor: '', paymentMethod: 'Cash', fundedBy: 'General Funds', otherFundedBy: '' });
        setShowIncomeModal(false);
        setShowExpenseModal(false);
        fetchData(); // Refresh table and summary
      } else {
        alert(res.data.error || 'Failed to save record');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    }
  };

  const renderModal = (type: 'INCOME' | 'EXPENSE') => {
    const isIncome = type === 'INCOME';
    const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const setter = isIncome ? setShowIncomeModal : setShowExpenseModal;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
            <h3 className={`font-bold text-lg flex items-center ${isIncome ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
              {isIncome ? <ArrowDownRight className="w-5 h-5 mr-2" /> : <ArrowUpRight className="w-5 h-5 mr-2" />}
              Record New {isIncome ? 'Income' : 'Expense'}
            </h3>
            <button onClick={() => setter(false)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold" 
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {formData.category === 'Other' && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specify Category</label>
                  <input 
                    type="text" 
                    value={formData.otherCategory}
                    onChange={(e) => setFormData({...formData, otherCategory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" 
                    placeholder="E.g., Printing Costs"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{isIncome ? 'Received From (Source)' : 'Paid To (Vendor/Party)'}</label>
                <input 
                  type="text" 
                  value={formData.sourceOrVendor}
                  onChange={(e) => setFormData({...formData, sourceOrVendor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" 
                  placeholder={isIncome ? 'e.g., Trust Board' : 'e.g., State Electricity Board'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                <select 
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer / UPI</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            </div>

            {!isIncome && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Funded By (Income Source)</label>
                  <select 
                    value={formData.fundedBy}
                    onChange={(e) => setFormData({...formData, fundedBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  >
                    <option value="General Funds">General Funds (Overall)</option>
                    <option value="Ticket Collection">Ticket Collection</option>
                    <option value="Hundi / Donations">Hundi / Donations</option>
                    <option value="Laddu Sales">Laddu Sales</option>
                    <option value="Other">Other (Specify)</option>
                  </select>
                </div>

                {formData.fundedBy === 'Other' && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specify Source</label>
                    <input 
                      type="text" 
                      value={formData.otherFundedBy}
                      onChange={(e) => setFormData({...formData, otherFundedBy: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" 
                      placeholder="E.g., Special Grant"
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
              <input 
                type="text" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white" 
                placeholder="Brief details about the transaction"
              />
            </div>

          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
            <button onClick={() => setter(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
            <button 
              onClick={() => handleSubmit(type)} 
              className={`px-6 py-2 text-white rounded-lg font-bold shadow-md transition-colors ${
                isIncome ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Save {isIncome ? 'Income' : 'Expense'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Temple Financial Ledger</h2>
          <p className="text-sm text-gray-500">Track all income, expenses, and current profit/loss</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center px-4 py-2 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400 rounded-lg text-sm font-bold transition-colors"
          >
            <ArrowUpRight className="w-4 h-4 mr-2" /> Record Expense
          </button>
          <button 
            onClick={() => setShowIncomeModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white hover:bg-green-700 shadow-md rounded-lg text-sm font-bold transition-colors"
          >
            <ArrowDownRight className="w-4 h-4 mr-2" /> Record Income
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹{summary.totalIncome.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Tickets, Donations, and Manual Income</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹{summary.totalExpense.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-gray-500">Salaries, Purchases, and Manual Expenses</p>
        </div>

        <div className={`bg-gradient-to-br rounded-2xl p-6 shadow-md border ${
          summary.netBalance >= 0 
            ? 'from-emerald-500 to-green-600 border-green-600' 
            : 'from-rose-500 to-red-600 border-red-600'
        }`}>
          <div className="flex justify-between items-start mb-2 text-white">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">Net Balance (Profit / Loss)</p>
              <h3 className="text-3xl font-black">₹{Math.abs(summary.netBalance).toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-white/80 font-medium">
            {summary.netBalance >= 0 ? '+ Overall Profit' : '- Overall Loss'}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden min-h-0">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 items-center">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search description or vendor..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-900 dark:text-white"
              />
            </div>
            
            <select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value as any); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none"
            >
              <option value="ALL">All Entries</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expense Only</option>
            </select>
          </div>
        </div>

        {/* Data Grid with Loading, Empty, and Success states */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : ledger.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-10 w-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Ledger Entries Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">No matching income or expenses found for this search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto flex-1 h-full">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-max animate-in fade-in">
                <thead className="bg-gray-50 dark:bg-gray-900/80 sticky top-0 text-gray-500 dark:text-gray-400 font-medium">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Description / Details</th>
                    <th className="px-6 py-3">Party / Vendor</th>
                    <th className="px-6 py-3 text-right">Credit (Income)</th>
                    <th className="px-6 py-3 text-right">Debit (Expense)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {ledger.map((row) => (
                  <tr key={row._id || row.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(row.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        row.type === 'INCOME' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {row.type === 'INCOME' ? 'INCOME' : 'EXPENSE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{row.category}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                      {row.description || '-'}
                      {row.type === 'EXPENSE' && row.fundedBy && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center">
                          Funded by: {row.fundedBy}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{row.partyName || '-'}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">
                      {row.type === 'INCOME' ? `+ ₹${row.amount.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">
                      {row.type === 'EXPENSE' ? `- ₹${row.amount.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && ledger.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {showIncomeModal && renderModal('INCOME')}
      {showExpenseModal && renderModal('EXPENSE')}

    </div>
  );
}
