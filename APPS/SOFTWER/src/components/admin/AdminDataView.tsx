import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Database, AlertCircle, Loader2 } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';

export interface AdminColumn {
  key: string;
  label: string;
  type?: 'text' | 'boolean' | 'date';
}

export interface AdminModuleConfig {
  id: string;
  title: string;
  description: string;
  columns: AdminColumn[];
  mockData: any[];
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

interface Props {
  config: AdminModuleConfig;
}

export default function AdminDataView({ config }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Confirmation Dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when config changes
    setIsLoading(true);
    setError(null);
    setSearchQuery('');
    setCurrentPage(1);

    // Simulate network delay
    const timer = setTimeout(() => {
      // Simulate random error (5% chance) just to show error state, normally don't do this
      if (Math.random() < 0.05) {
        setError('Failed to fetch data from the server. Please try again later.');
      } else {
        setData(config.mockData);
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [config.id]);

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    return Object.values(item).some((val) => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = () => {
    if (deleteId) {
      setData(data.filter(item => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{config.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{config.description}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-shadow text-gray-900 dark:text-white"
            />
          </div>
          {config.canAdd !== false && (
            <button className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col relative min-h-[400px]">
        
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading data...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 z-10 p-6 text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              Retry
            </button>
          </div>
        ) : filteredData.length === 0 ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800 z-10 p-6 text-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-full mb-4">
              <Database className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Records Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              {searchQuery ? `No results match your search "${searchQuery}".` : 'There is currently no data to display in this module.'}
            </p>
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="mt-4 text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline">
                Clear Search
              </button>
            )}
          </div>
        ) : null}

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                {config.columns.map(col => (
                  <th key={col.key} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
                {(config.canEdit !== false || config.canDelete !== false) && (
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right sticky right-0 bg-gray-50 dark:bg-gray-900/50 backdrop-blur-md">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  {config.columns.map(col => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {col.type === 'boolean' ? (
                        item[col.key] ? 
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Yes</span> : 
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">No</span>
                      ) : (
                        item[col.key]
                      )}
                    </td>
                  ))}
                  {(config.canEdit !== false || config.canDelete !== false) && (
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap sticky right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md group-hover:bg-gray-50/80 dark:group-hover:bg-gray-800/80">
                      {config.canEdit !== false && (
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      {config.canDelete !== false && (
                        <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {!isLoading && !error && filteredData.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 text-sm border rounded transition-colors ${
                    currentPage === i + 1 
                      ? 'bg-orange-600 border-orange-600 text-white' 
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        title="Delete Record"
        message="Are you sure you want to permanently delete this record? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
