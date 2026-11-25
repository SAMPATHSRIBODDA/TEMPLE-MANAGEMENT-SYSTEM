import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

const mockUsage = [
  { id: 'USE-001', date: '2026-06-26 06:00', item: 'Flowers (Garlands)', qty: 10, purpose: 'Morning Alankaram', user: 'Priest Venkatesh' },
  { id: 'USE-002', date: '2026-06-26 11:30', item: 'Rice', qty: 25, purpose: 'Annadanam (Lunch)', user: 'Kitchen Staff 1' },
];

export default function StockUsage() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-orange-500" /> Stock Outward (Usage)
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Record daily consumption of inventory items.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Log Usage
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Log ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item Used</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockUsage.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{u.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-red-600 dark:text-red-400">- {u.qty} {u.item}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{u.purpose}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{u.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
