import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, Plus, Loader2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InventoryList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['inventory', search, page],
    queryFn: async () => {
      const res = await api.get(`/inventory?search=${search}&page=${page}&limit=10`);
      return res.data;
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage temple supplies and assets.</p>
        </div>
        <button 
          onClick={() => navigate('/inventory/new')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-white/40 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-3 py-2 w-full border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/40 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Current Stock</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.map((item: any) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-5 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-5 py-4 text-gray-600">{item.category}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 flex items-center justify-end gap-3">
                      <button 
                        onClick={() => navigate(`/inventory/${item._id}/edit`)}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {data?.data?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {data?.pagination && data.pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Page {data.pagination.page} of {data.pagination.pages}
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 bg-white border border-gray-200 rounded text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <button 
                disabled={page === data.pagination.pages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 bg-white border border-gray-200 rounded text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
