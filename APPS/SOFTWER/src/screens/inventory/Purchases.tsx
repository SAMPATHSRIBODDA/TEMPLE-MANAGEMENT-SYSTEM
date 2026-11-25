import React from 'react';
import { ShoppingCart, Plus } from 'lucide-react';

const mockPurchases = [
  { id: 'INV-2026-001', date: '2026-06-25', vendor: 'Sri Balaji General Stores', item: 'Rice', qty: 500, total: '₹25,000' },
  { id: 'INV-2026-002', date: '2026-06-26', vendor: 'Local Flower Market', item: 'Flowers (Garlands)', qty: 50, total: '₹2,500' },
];

export default function Purchases() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-orange-500" /> Stock Inward (Purchases)
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record new stock arriving from vendors.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> New Purchase
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockPurchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">{p.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{p.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">{p.vendor}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{p.item} ({p.qty})</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white text-right">{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
