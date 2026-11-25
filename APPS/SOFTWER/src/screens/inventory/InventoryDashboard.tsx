import React, { useState } from 'react';
import { Package, Truck, ShoppingCart, ClipboardList } from 'lucide-react';
import CurrentStock from './CurrentStock';
import Vendors from './Vendors';
import Purchases from './Purchases';
import StockUsage from './StockUsage';

import { useSearchParams } from 'react-router-dom';

type Tab = 'stock' | 'vendors' | 'purchases' | 'usage';

export default function InventoryDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'stock';
  const setActiveTab = (tab: Tab) => setSearchParams({ tab });

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Track pooja materials, prasadam ingredients, and vendor supplies.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl mb-6 w-fit border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'stock'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4 mr-2" /> Current Stock
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'vendors'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4 mr-2" /> Vendors
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'purchases'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" /> Stock Inward
        </button>
        <button
          onClick={() => setActiveTab('usage')}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'usage'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4 mr-2" /> Stock Usage
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'stock' && <CurrentStock />}
        {activeTab === 'vendors' && <Vendors />}
        {activeTab === 'purchases' && <Purchases />}
        {activeTab === 'usage' && <StockUsage />}
      </div>
    </div>
  );
}
