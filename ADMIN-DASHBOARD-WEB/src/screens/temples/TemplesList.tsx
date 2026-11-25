import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, MoreHorizontal, Eye, Edit, Power, Trash2 } from 'lucide-react';
import { templesList } from '../../data/mockData';

export const TemplesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    if (activeMenu === id) {
      setActiveMenu(null);
    } else {
      setActiveMenu(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Temples Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage all registered temples on the platform.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Filter size={16} /> Filters
          </button>
          <Link to="/temples/new" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <Plus size={16} /> Add Temple
          </Link>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-white/40 dark:border-gray-700/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by temple name, domain, or admin..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 h-10 border border-white/40 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-b border-white/40 dark:border-gray-700/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                <th className="px-6 py-4">Temple Details</th>
                <th className="px-6 py-4">Admin Contact</th>
                <th className="px-6 py-4">Plan & Domain</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templesList.map((temple) => (
                <tr key={temple.id} className="hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">{temple.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[250px]">{temple.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-0.5">{temple.admin.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{temple.admin.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 dark:text-gray-300 border border-white/40 dark:border-gray-700/50 mb-1.5">
                      {temple.plan}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      {temple.domain}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${temple.appStatus === 'Live' ? 'bg-success' : temple.appStatus === 'In Review' ? 'bg-warning' : 'bg-gray-400'}`} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">App: {temple.appStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${temple.softwareStatus === 'Active' ? 'bg-success' : 'bg-danger'}`} />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">SW: {temple.softwareStatus}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => toggleMenu(temple.id)}
                      className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    
                    {activeMenu === temple.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                        <div className="absolute right-6 top-10 mt-1 w-48 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          <Link to={`/temples/${temple.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors w-full text-left">
                            <Eye size={14} /> View Details
                          </Link>
                          <Link to={`/temples/${temple.id}/edit`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors w-full text-left">
                            <Edit size={14} /> Edit Temple
                          </Link>
                          <div className="h-px bg-gray-100 my-1 mx-2"></div>
                          {temple.softwareStatus === 'Active' ? (
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-warning hover:bg-warning/5 transition-colors w-full text-left cursor-pointer">
                              <Power size={14} /> Suspend Access
                            </button>
                          ) : (
                            <button className="flex items-center gap-2 px-4 py-2 text-sm text-success hover:bg-success/5 transition-colors w-full text-left cursor-pointer">
                              <Power size={14} /> Activate Access
                            </button>
                          )}
                          <button className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger/5 transition-colors w-full text-left cursor-pointer">
                            <Trash2 size={14} /> Delete Temple
                          </button>
                        </div>
                      </>
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
};
