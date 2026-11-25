import React, { useState } from 'react';
import { Truck, Plus } from 'lucide-react';

const mockVendors = [
  { id: 'V001', name: 'Sri Balaji General Stores', contact: 'Ramu', phone: '9876543210', supplies: 'Rice, Dhal' },
  { id: 'V002', name: 'Tirumala Dairy', contact: 'Krishna', phone: '9876543211', supplies: 'Ghee, Milk' },
  { id: 'V003', name: 'Local Flower Market', contact: 'Sita', phone: '9876543212', supplies: 'Flowers, Garlands' },
];

export default function Vendors() {
  const [vendors] = useState(mockVendors);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Truck className="h-5 w-5 mr-2 text-orange-500" /> Vendor Management
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage suppliers for temple inventory.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Add Vendor
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Business Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Person</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supplies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{vendor.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">{vendor.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{vendor.contact}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{vendor.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{vendor.supplies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
