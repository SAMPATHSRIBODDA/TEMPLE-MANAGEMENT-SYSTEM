import React, { useState, useEffect, useRef } from 'react';
import { Save, Building2, MapPin, Phone, Mail, FileText, Camera } from 'lucide-react';
import { useMasterDataStore } from '../../../store/masterDataStore';
import { templeInfoConfig } from '../masterConfigs';

export default function TempleInfoSettings() {
  const { updateData } = useMasterDataStore();
  
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '', taxId: '', profileImage: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch from backend
    fetch('http://localhost:5000/api/v1/temple/core-data')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const t = data.data;
          setFormData({
            name: t.name || '',
            address: t.address?.street || '',
            phone: t.phone || '',
            email: t.email || '',
            taxId: t.taxId || '',
            profileImage: t.profileImage || ''
          });
          if (t.profileImage) {
            setPreviewUrl(t.profileImage);
          }
        }
      })
      .catch(err => console.error("Error fetching temple data:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('address', formData.address);
      fd.append('phone', formData.phone);
      fd.append('email', formData.email);
      fd.append('taxId', formData.taxId);
      if (selectedFile) {
        fd.append('profileImage', selectedFile);
      }

      const response = await fetch('http://localhost:5000/api/v1/temple/core-data', {
        method: 'POST',
        body: fd
      });

      const result = await response.json();
      
      if (result.success) {
        // Also update local store for compatibility with old components
        updateData('temple-info', [formData]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert("Failed to save: " + result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error saving temple data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-full overflow-y-auto animate-in fade-in zoom-in-95 duration-300">
      
      <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Temple Information</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage official temple details used on receipts and reports.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-sm active:scale-95 disabled:opacity-70"
        >
          {isSaving ? (
            <span className="flex items-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Saving...</span>
          ) : (
            <><Save className="w-5 h-5 mr-2" /> Save Changes</>
          )}
        </button>
      </div>

      {showSuccess && (
        <div className="mx-8 mt-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center animate-in slide-in-from-top-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          Temple information updated securely on Cloudinary and Backend.
        </div>
      )}

      <form className="p-8 max-w-4xl" onSubmit={handleSave}>
        
        {/* Logo Section */}
        <div className="mb-10 flex items-start gap-8">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-32 h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors group overflow-hidden"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="w-8 h-8 mb-2 group-hover:text-orange-500 transition-colors" />
                <span className="text-xs font-medium text-center px-4">Upload Temple Logo</span>
              </>
            )}
          </div>
          <div className="flex-1 pt-2">
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Official Logo</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This logo will appear on the Mobile App Home Screen, tickets, and generated PDF reports. It is uploaded to Cloudinary.</p>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Choose File
            </button>
          </div>
        </div>

        <div className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Temple Name */}
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Building2 className="w-4 h-4 mr-2 text-orange-500" /> Temple Full Name
              </label>
              <input 
                type="text" 
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white font-medium text-lg shadow-sm"
                placeholder="e.g. Sri Venkateswara Swamy Temple"
              />
            </div>

            {/* Address */}
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 mr-2 text-orange-500" /> Complete Address
              </label>
              <textarea 
                rows={3}
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white shadow-sm resize-none"
                placeholder="Enter full address for receipts"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 mr-2 text-orange-500" /> Contact Number
              </label>
              <input 
                type="text" 
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white shadow-sm"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 mr-2 text-orange-500" /> Official Email
              </label>
              <input 
                type="email" 
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white shadow-sm"
                placeholder="admin@temple.org"
              />
            </div>

            {/* Trust / Tax ID */}
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 mr-2 text-orange-500" /> Trust Registration / Tax ID
              </label>
              <input 
                type="text" 
                value={formData.taxId || ''}
                onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 dark:text-white shadow-sm"
                placeholder="Registration Number for 80G Receipts"
              />
              <p className="text-xs text-gray-500 mt-2">This ID is legally required for generating 80G tax-exemption donation receipts.</p>
            </div>
          </div>
          
        </div>
      </form>
    </div>
  );
}
