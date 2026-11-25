import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Smartphone, Monitor, UploadCloud, Save, Loader2, Paintbrush, FileText, Bell } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const WhiteLabelHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  
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
  const filteredBrands = temples.filter((t: any) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Auto-select first temple
  useEffect(() => {
    if (temples.length > 0 && !selectedId) {
      setSelectedId(temples[0]._id);
    }
  }, [temples]);

  // Fetch specific whitelabel config
  const { data: whiteLabelConfig, isLoading: isLoadingConfig } = useQuery({
    queryKey: ['whitelabel-config', selectedId],
    queryFn: async () => {
      const res = await api.get(`/config/whitelabel/${selectedId}`);
      return res.data.data;
    },
    enabled: !!selectedId
  });

  const [form, setForm] = useState<any>({
    appName: 'Temple Admin',
    templeName: '',
    description: '',
    primaryColor: '#5B4BDB',
    secondaryColor: '#F59E0B',
    templeLogo: '',
    splashScreen: '',
    homeBanner: '',
    phone: '',
    email: '',
    address: '',
    facebook: '',
    instagram: '',
    notificationSms: ''
  });

  useEffect(() => {
    if (whiteLabelConfig) {
      setForm(whiteLabelConfig);
    }
  }, [whiteLabelConfig]);

  const updateWhiteLabel = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.put(`/config/whitelabel/${selectedId}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whitelabel-config', selectedId] });
    }
  });

  const handleSave = () => {
    updateWhiteLabel.mutate(form);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">White Label Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure branding, colors, and assets per temple.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Master List (Left Panel) */}
        <div className="w-1/4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm flex flex-col overflow-hidden shrink-0">
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
            ) : filteredBrands.map((t: any) => (
              <button 
                key={t._id}
                onClick={() => setSelectedId(t._id)}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                  selectedId === t._id ? 'bg-primary/5 border border-primary/20' : 'hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-transparent'
                }`}
              >
                <p className={`font-semibold text-sm ${selectedId === t._id ? 'text-primary' : 'text-gray-900 dark:text-gray-100'}`}>{t.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Settings</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Configurator (Middle Panel) */}
        <div className="flex-1 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm overflow-y-auto custom-scrollbar p-6 lg:p-8">
          {isLoadingConfig || !whiteLabelConfig ? (
             <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{whiteLabelConfig.templeId?.name || 'Temple'}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Brand Configurator</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={updateWhiteLabel.isPending}
                  className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {updateWhiteLabel.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>

              <div className="space-y-8">
                {/* Identity */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Paintbrush size={16} className="text-gray-400 dark:text-gray-500" /> Brand Identity
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1">
                      <label className="input-label">App Name</label>
                      <input 
                        type="text" 
                        value={form.appName}
                        onChange={(e) => setForm({...form, appName: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="input-label">Temple Name</label>
                      <input 
                        type="text" 
                        value={form.templeName}
                        onChange={(e) => setForm({...form, templeName: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="input-label">Temple Description</label>
                      <textarea 
                        value={form.description}
                        onChange={(e) => setForm({...form, description: e.target.value})}
                        className="w-full p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/40 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none h-24" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="input-label">Primary Color</label>
                        <div className="flex gap-2">
                          <div className="w-12 h-12 rounded-xl border border-white/40 dark:border-gray-700/50 flex-shrink-0" style={{ backgroundColor: form.primaryColor }}></div>
                          <input 
                            type="text" 
                            value={form.primaryColor}
                            onChange={(e) => setForm({...form, primaryColor: e.target.value})}
                            className="input-field uppercase font-mono" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="input-label">Secondary Color</label>
                        <div className="flex gap-2">
                          <div className="w-12 h-12 rounded-xl border border-white/40 dark:border-gray-700/50 flex-shrink-0" style={{ backgroundColor: form.secondaryColor }}></div>
                          <input 
                            type="text" 
                            value={form.secondaryColor}
                            onChange={(e) => setForm({...form, secondaryColor: e.target.value})}
                            className="input-field uppercase font-mono" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-gray-100"></div>

                {/* Assets */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ImageIcon size={16} className="text-gray-400 dark:text-gray-500" /> Media Assets
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border-2 border-dashed border-white/40 dark:border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors mb-3">
                        <UploadCloud size={20} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">App Logo</p>
                      <input 
                        type="text" 
                        placeholder="Image URL..."
                        value={form.templeLogo}
                        onChange={(e) => setForm({...form, templeLogo: e.target.value})}
                        className="mt-4 w-full h-8 px-3 rounded-md border text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="border-2 border-dashed border-white/40 dark:border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors mb-3">
                        <UploadCloud size={20} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Splash Screen</p>
                      <input 
                        type="text" 
                        placeholder="Image URL..."
                        value={form.splashScreen}
                        onChange={(e) => setForm({...form, splashScreen: e.target.value})}
                        className="mt-4 w-full h-8 px-3 rounded-md border text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="border-2 border-dashed border-white/40 dark:border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors mb-3">
                        <UploadCloud size={20} />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Home Banner</p>
                      <input 
                        type="text" 
                        placeholder="Image URL..."
                        value={form.homeBanner}
                        onChange={(e) => setForm({...form, homeBanner: e.target.value})}
                        className="mt-4 w-full h-8 px-3 rounded-md border text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-gray-100"></div>

                {/* Contact & Social */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400 dark:text-gray-500" /> Contact & Social
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="input-label">Phone</label>
                      <input type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <label className="input-label">Email</label>
                      <input type="text" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input-field" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="input-label">Address</label>
                      <input type="text" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <label className="input-label">Facebook URL</label>
                      <input type="text" value={form.facebook} onChange={(e) => setForm({...form, facebook: e.target.value})} className="input-field" />
                    </div>
                    <div className="space-y-1">
                      <label className="input-label">Instagram URL</label>
                      <input type="text" value={form.instagram} onChange={(e) => setForm({...form, instagram: e.target.value})} className="input-field" />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-gray-100"></div>

                {/* Notifications */}
                <section>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Bell size={16} className="text-gray-400 dark:text-gray-500" /> Notification Templates
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="input-label flex justify-between">
                        <span>SMS Template</span>
                        <span className="text-primary cursor-pointer hover:underline">Insert Variable</span>
                      </label>
                      <textarea 
                        value={form.notificationSms}
                        onChange={(e) => setForm({...form, notificationSms: e.target.value})}
                        className="w-full p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/40 dark:border-gray-700/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none h-24" 
                      />
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>

        {/* Live Preview Engine (Right Panel) */}
        <div className="w-[380px] bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl border border-white/40 dark:border-gray-700/50 shadow-sm flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-white/40 dark:border-gray-700/50 flex justify-center gap-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
            <button 
              onClick={() => setPreviewMode('mobile')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${previewMode === 'mobile' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100'}`}
            >
              <Smartphone size={16} /> Mobile
            </button>
            <button 
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${previewMode === 'desktop' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100'}`}
            >
              <Monitor size={16} /> Desktop
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
            {previewMode === 'mobile' ? (
              <div className="w-[300px] h-[600px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-[40px] shadow-2xl border-[8px] border-gray-900 relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-b-3xl w-1/2 mx-auto z-20"></div>
                <div 
                  className="h-20 flex items-end justify-center pb-4 transition-colors duration-300"
                  style={{ backgroundColor: form.primaryColor }}
                >
                  <span className="text-white font-bold text-lg">{form.appName}</span>
                </div>
                <div className="flex-1 p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md">
                  <div className="w-full h-32 rounded-xl bg-gray-200 animate-pulse mb-4"></div>
                  <div className="space-y-3">
                    <div className="w-full h-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-lg shadow-sm"></div>
                    <div className="w-full h-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-lg shadow-sm"></div>
                    <div className="w-full h-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-lg shadow-sm"></div>
                  </div>
                </div>
                <div className="h-16 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-t border-white/20 dark:border-gray-800/50 flex items-center justify-around px-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: form.primaryColor }}></div>
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[340px] aspect-video bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl shadow-2xl border border-white/40 dark:border-gray-700/50 relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <div className="h-6 bg-gray-100 border-b border-white/40 dark:border-gray-700/50 flex items-center gap-1.5 px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-warning/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-success/80"></div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-16 h-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border-r border-white/20 dark:border-gray-800/50 flex flex-col items-center py-4 gap-4">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: form.primaryColor }}></div>
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="w-full h-24 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-lg border border-white/20 dark:border-gray-800/50"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
