import React, { useState, useEffect } from 'react';
import { Search, Smartphone, Monitor, CheckCircle2, History, Settings, RefreshCw, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const AppManagementHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toggles, setToggles] = useState<any>({});
  
  const queryClient = useQueryClient();

  // Fetch temples for sidebar
  const { data: templesRes, isLoading: isLoadingTemples } = useQuery({
    queryKey: ['config-temples'],
    queryFn: async () => {
      const res = await api.get('/config/temples');
      return res.data.data;
    }
  });
  const temples = templesRes || [];
  const filteredApps = temples.filter((t: any) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Auto-select first temple
  useEffect(() => {
    if (temples.length > 0 && !selectedId) {
      setSelectedId(temples[0]._id);
    }
  }, [temples]);

  // Fetch specific app config
  const { data: appConfig, isLoading: isLoadingConfig } = useQuery({
    queryKey: ['app-config', selectedId],
    queryFn: async () => {
      const res = await api.get(`/config/app/${selectedId}`);
      return res.data.data;
    },
    enabled: !!selectedId
  });

  useEffect(() => {
    if (appConfig) {
      setToggles({ ...appConfig.coreAccess, ...appConfig.modules });
    }
  }, [appConfig]);

  const updateConfig = useMutation({
    mutationFn: async (newToggles: any) => {
      const payload = {
        coreAccess: {
          mobileApp: newToggles.mobileApp,
          desktopSoftware: newToggles.desktopSoftware
        },
        modules: {
          darshan: newToggles.darshan,
          laddu: newToggles.laddu,
          pooja: newToggles.pooja,
          donation: newToggles.donation,
          inventory: newToggles.inventory
        }
      };
      const res = await api.put(`/config/app/${selectedId}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-config', selectedId] });
    }
  });

  const handleToggle = (key: string) => {
    const newToggles = { ...toggles, [key]: !toggles[key] };
    setToggles(newToggles);
    updateConfig.mutate(newToggles);
  };

  const ToggleSwitch = ({ label, isEnabled, onClick, disabled }: { label: string, isEnabled: boolean, onClick: () => void, disabled?: boolean }) => (
    <div className={`flex items-center justify-between p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-800/50 rounded-xl ${disabled ? 'opacity-50' : ''}`}>
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</span>
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${isEnabled ? 'bg-success' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-1 left-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl w-4 h-4 rounded-full transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">App & Module Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure software access, modules, and updates per temple.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Master List (Left Panel) */}
        <div className="w-1/3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-white/20 dark:border-gray-800/50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input 
                type="text" 
                placeholder="Search temples..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 h-9 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl focus:border-white/40 dark:border-gray-700/50 focus:ring-4 focus:ring-gray-50 transition-all" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {isLoadingTemples ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
            ) : filteredApps.map((t: any) => (
              <button 
                key={t._id}
                onClick={() => setSelectedId(t._id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                  selectedId === t._id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-transparent'
                }`}
              >
                <p className={`font-semibold text-sm ${selectedId === t._id ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>{t.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View (Right Panel) */}
        <div className="flex-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-y-auto custom-scrollbar p-6 lg:p-8">
          {isLoadingConfig || !appConfig ? (
             <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{appConfig.templeId?.name || 'Temple'}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Manage configuration for Temple ID: {selectedId}</p>
              </div>

              <div className="space-y-8">
                {/* Core Access */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Settings size={16} className="text-gray-400 dark:text-gray-500" /> Core Platform Access
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ToggleSwitch 
                      label="Mobile App (Android/iOS)" 
                      isEnabled={toggles.mobileApp || false} 
                      onClick={() => handleToggle('mobileApp')} 
                      disabled={updateConfig.isPending}
                    />
                    <ToggleSwitch 
                      label="Desktop Software (Windows)" 
                      isEnabled={toggles.desktopSoftware || false} 
                      onClick={() => handleToggle('desktopSoftware')} 
                      disabled={updateConfig.isPending}
                    />
                  </div>
                </section>

                <div className="h-px bg-gray-100"></div>

                {/* Feature Modules */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Feature Modules</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <ToggleSwitch label="Darshan Module" isEnabled={toggles.darshan || false} onClick={() => handleToggle('darshan')} disabled={updateConfig.isPending}/>
                    <ToggleSwitch label="Laddu Module" isEnabled={toggles.laddu || false} onClick={() => handleToggle('laddu')} disabled={updateConfig.isPending}/>
                    <ToggleSwitch label="Pooja Module" isEnabled={toggles.pooja || false} onClick={() => handleToggle('pooja')} disabled={updateConfig.isPending}/>
                    <ToggleSwitch label="Donation Module" isEnabled={toggles.donation || false} onClick={() => handleToggle('donation')} disabled={updateConfig.isPending}/>
                    <ToggleSwitch label="Inventory Module" isEnabled={toggles.inventory || false} onClick={() => handleToggle('inventory')} disabled={updateConfig.isPending}/>
                  </div>
                </section>

                <div className="h-px bg-gray-100"></div>

                {/* Version Management */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <RefreshCw size={16} className="text-gray-400 dark:text-gray-500" /> Software Version Management
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-5 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/40 dark:border-gray-700/50 rounded-xl relative overflow-hidden">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Version</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{appConfig.versioning?.currentVersion || '1.0.0'}</p>
                        
                        {appConfig.versioning?.availableUpdate ? (
                          <div className="mt-4 pt-4 border-t border-white/40 dark:border-gray-700/50 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-warning uppercase tracking-wider mb-0.5">Update Available</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{appConfig.versioning.availableUpdate}</p>
                            </div>
                            <button className="px-3 py-1.5 bg-warning text-white text-xs font-bold rounded-lg shadow-sm hover:bg-warning/90 transition-colors cursor-pointer">
                              Force Update
                            </button>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-white/40 dark:border-gray-700/50 flex items-center gap-1.5 text-success">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Up to Date</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-xl">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <History size={16} className="text-gray-400 dark:text-gray-500" /> Update History
                      </p>
                      <div className="space-y-4">
                        {(appConfig.versioning?.history || []).map((hist: any, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                              {idx !== appConfig.versioning.history.length - 1 && (
                                <div className="w-px h-full bg-gray-200 my-1"></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{hist.version} <span className="font-normal text-gray-500 dark:text-gray-400">- {hist.type}</span></p>
                              <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(hist.date).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
