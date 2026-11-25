import React, { useState, useEffect, useCallback } from 'react';
import { Wifi, Search, Calendar, FileText, CheckCircle } from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import api from '../../services/api';

export default function OnlineBookings() {
  const [activeTab, setActiveTab] = useState<string>('Entry Tickets');
  const [tabs, setTabs] = useState<string[]>(['Entry Tickets', 'Poojas', 'Laddu Sales']);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    // Fetch dynamic sections to create tabs
    fetch('http://localhost:5000/api/v1/ticket-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const sections = Array.from(new Set(data.data.map((t:any) => t.sectionName))) as string[];
          const dynamicTabs = ['Entry Tickets', 'Poojas', 'Laddu Sales', ...sections.filter(s => s !== 'Entry Tickets' && s !== 'Darshan' && s !== 'Laddu Sales')];
          setTabs(dynamicTabs);
        }
      })
      .catch(console.error);
  }, []);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/transactions/online-bookings', {
        params: {
          category: activeTab,
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm
        }
      });
      if (res.data.success) {
        let fetchedData = res.data.data;
        // Handle mock adapter structure which returns { transactions: [...] }
        if (!Array.isArray(fetchedData) && fetchedData && Array.isArray(fetchedData.transactions)) {
          fetchedData = fetchedData.transactions.map((t: any) => ({
            id: t._id || t.id,
            time: t.date || t.createdAt || new Date().toISOString(),
            transactionId: t.receiptNumber || t.id || 'N/A',
            name: 'Demo Devotee',
            itemBooked: t.type || 'Booking',
            quantity: 1,
            status: t.status || 'valid'
          }));
        } else if (!Array.isArray(fetchedData)) {
          fetchedData = [];
        }
        
        setBookings(fetchedData);
        setTotalItems(res.data.total || fetchedData.length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch online bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage, searchTerm]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 mb-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Wifi className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex items-center mb-2">
          <div className="p-3 bg-white/20 rounded-2xl mr-4 backdrop-blur-sm">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Online Bookings Hub</h1>
            <p className="text-blue-100 font-medium mt-1">Track and manage all bookings originating from the Devotee App</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col min-h-[600px]">
        
        {/* Tabs & Search */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full lg:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-11 w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Booked</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-base font-medium">No online bookings found for {activeTab}</p>
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {new Date(b.time).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                        {b.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                        {b.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 dark:text-gray-200">
                        {b.itemBooked}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {b.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex items-center text-xs font-bold rounded-full border ${
                          ['used', 'collected', 'Used', 'Collected'].includes(b.status)
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : ['cancelled', 'expired'].includes(b.status)
                            ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Pagination */}
        <div className="border-t border-gray-100 dark:border-gray-700 p-4">
          <Pagination 
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>

      </div>
    </div>
  );
}
