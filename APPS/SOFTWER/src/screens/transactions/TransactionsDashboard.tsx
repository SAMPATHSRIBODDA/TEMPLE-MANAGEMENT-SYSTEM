import React, { useState, useEffect } from 'react';
import { Store, Smartphone } from 'lucide-react';
import CounterTransactions from '../../components/transactions/CounterTransactions';
import AppTransactions from '../../components/transactions/AppTransactions';
import api from '../../services/api';

export default function TransactionsDashboard() {
  const [activeView, setActiveView] = useState<'counter' | 'app'>('counter');
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dynamic ticket categories so sections can be removed from counter automatically if deleted
    const fetchCategories = async () => {
      try {
        const res = await api.get('/ticket-categories');
        if (res.data.success) {
          setDynamicCategories(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic ticket categories', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-300">
      
      {/* Header & Main Toggles */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Transactions Management</h2>
        
        <div className="flex space-x-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveView('counter')}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeView === 'counter'
                ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Store className={`w-4 h-4 mr-2 ${activeView === 'counter' ? 'text-orange-500' : 'text-gray-400'}`} />
            Counter (POS)
          </button>
          
          <button
            onClick={() => setActiveView('app')}
            className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeView === 'app'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Smartphone className={`w-4 h-4 mr-2 ${activeView === 'app' ? 'text-indigo-500' : 'text-gray-400'}`} />
            Mobile App (Online)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 relative">
        {activeView === 'counter' ? (
          <CounterTransactions dynamicCategories={dynamicCategories} />
        ) : (
          <AppTransactions dynamicCategories={dynamicCategories} />
        )}
      </div>

    </div>
  );
}
