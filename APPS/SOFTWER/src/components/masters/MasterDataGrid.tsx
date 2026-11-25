import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useMasterDataStore } from '../../store/masterDataStore';
import Pagination from '../common/Pagination';

export interface FieldSchema {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'time';
  options?: string[];
  required?: boolean;
}

export interface MasterConfig {
  id: string;
  title: string;
  description: string;
  fields: FieldSchema[];
  initialData: any[];
}

interface Props {
  config: MasterConfig;
}

export default function MasterDataGrid({ config }: Props) {
  const { data: globalData, updateData } = useMasterDataStore();
  
  // Use global data if it exists for this config, otherwise fallback to initialData
  const activeData = globalData[config.id] || config.initialData;

  const [data, setData] = useState<any[]>(activeData);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset data when config changes (switching modules)
  useEffect(() => {
    setData(globalData[config.id] || config.initialData);
    setSearchQuery('');
    setCurrentPage(1);
  }, [config.id, globalData]);

  // Sync local state changes to global store
  const syncToGlobal = (newData: any[]) => {
    setData(newData);
    updateData(config.id, newData);
  };

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    return Object.values(item).some((val) => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAdd = () => {
    setEditingItem(null);
    const initialForm: any = {};
    config.fields.forEach(f => {
      if (f.type === 'boolean') initialForm[f.key] = true;
      else if (f.type === 'number') initialForm[f.key] = 0;
      else initialForm[f.key] = '';
    });
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      syncToGlobal(data.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      syncToGlobal(data.map(item => item.id === editingItem.id ? { ...formData, id: editingItem.id } : item));
    } else {
      syncToGlobal([...data, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{config.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{config.description}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
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
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm dark:text-white"
            />
          </div>
          <button 
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-bold shadow-sm whitespace-nowrap"
          >
            <Plus className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Add New</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex flex-col min-h-0 overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10 text-gray-500 dark:text-gray-400 font-medium">
              <tr>
                {config.fields.map(field => (
                  <th key={field.key} className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">{field.label}</th>
                ))}
                <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={config.fields.length + 1} className="px-6 py-12 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    {config.fields.map(field => (
                      <td key={field.key} className="px-6 py-4 text-gray-900 dark:text-gray-100">
                        {field.type === 'boolean' ? (
                          item[field.key] ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">Active</span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-medium">Inactive</span>
                          )
                        ) : (
                          item[field.key]
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg mr-2 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Record' : 'Add New Record'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {config.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'boolean' ? (
                      <div className="flex items-center mt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={!!formData[field.key]}
                            onChange={(e) => setFormData({...formData, [field.key]: e.target.checked})}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                          <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {formData[field.key] ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                      </div>
                    ) : field.type === 'select' ? (
                      <select
                        required={field.required}
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                      >
                        <option value="">Select...</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : field.type === 'time' ? 'time' : 'text'}
                        required={field.required}
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData({...formData, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value})}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 mt-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                >
                  {editingItem ? 'Save Changes' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
