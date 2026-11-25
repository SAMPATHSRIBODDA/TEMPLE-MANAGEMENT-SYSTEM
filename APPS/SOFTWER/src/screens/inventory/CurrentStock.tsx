import React, { useState } from 'react';
import { PackageOpen, AlertTriangle } from 'lucide-react';

const mockStock = [
  { id: 'ITM001', name: 'Flowers (Garlands)', category: 'Pooja Items', quantity: 15, unit: 'Pieces', minThreshold: 20, status: 'Low' },
  { id: 'ITM002', name: 'Coconut', category: 'Pooja Items', quantity: 250, unit: 'Pieces', minThreshold: 100, status: 'Good' },
  { id: 'ITM003', name: 'Sesame Oil', category: 'Pooja Items', quantity: 5, unit: 'Liters', minThreshold: 10, status: 'Low' },
  { id: 'ITM004', name: 'Rice', category: 'Annadanam', quantity: 500, unit: 'Kg', minThreshold: 100, status: 'Good' },
  { id: 'ITM005', name: 'Ghee', category: 'Prasadam', quantity: 45, unit: 'Kg', minThreshold: 50, status: 'Low' },
  { id: 'ITM006', name: 'Cashew Nuts', category: 'Prasadam', quantity: 25, unit: 'Kg', minThreshold: 10, status: 'Good' },
];

export default function CurrentStock() {
  const [items] = useState(mockStock);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <PackageOpen className="h-5 w-5 mr-2 text-orange-500" /> Current Stock Levels
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Real-time inventory levels. Items below minimum threshold are highlighted.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {items.filter(i => i.status === 'Low').map(item => (
           <div key={item.id} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-xl flex items-start gap-3">
             <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
             <div>
               <h4 className="font-bold text-red-900 dark:text-red-400 text-sm">{item.name} is running low!</h4>
               <p className="text-sm text-red-700 dark:text-red-300 mt-1">Current: {item.quantity} {item.unit} (Min: {item.minThreshold})</p>
             </div>
           </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Qty</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${item.status === 'Low' ? 'bg-red-50/30 dark:bg-red-900/5' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{item.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.category}</td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${item.status === 'Low' ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.unit}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.status === 'Good' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Low Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
