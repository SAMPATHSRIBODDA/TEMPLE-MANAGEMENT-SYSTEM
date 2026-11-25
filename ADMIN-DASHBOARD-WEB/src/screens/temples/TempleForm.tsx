import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { templesList } from '../../data/mockData';

export const TempleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const existingTemple = isEditing ? templesList.find(t => t.id === id) : null;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      navigate('/temples');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/temples" className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {isEditing ? 'Edit Temple' : 'Add New Temple'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {isEditing ? 'Update the details for this temple.' : 'Register a new temple on the platform.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-8">
        
        {/* Basic Info Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-white/20 dark:border-gray-800/50">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="input-label">Temple Name</label>
              <input type="text" required defaultValue={existingTemple?.name} className="input-field" placeholder="e.g. Sri Venkateswara Swamy Temple" />
            </div>
            <div className="space-y-1">
              <label className="input-label">Contact Number</label>
              <input type="text" required defaultValue={existingTemple?.contact} className="input-field" placeholder="e.g. +91 877 223 3333" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="input-label">Full Address</label>
              <input type="text" required defaultValue={existingTemple?.address} className="input-field" placeholder="Complete physical address" />
            </div>
          </div>
        </div>

        {/* Admin Details Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-white/20 dark:border-gray-800/50 mt-8">Administrator Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="input-label">Full Name</label>
              <input type="text" required defaultValue={existingTemple?.admin?.name} className="input-field" placeholder="Admin name" />
            </div>
            <div className="space-y-1">
              <label className="input-label">Email Address</label>
              <input type="email" required defaultValue={existingTemple?.admin?.email} className="input-field" placeholder="admin@temple.org" />
            </div>
            <div className="space-y-1">
              <label className="input-label">Phone Number</label>
              <input type="text" required defaultValue={existingTemple?.admin?.phone} className="input-field" placeholder="+91 9988776655" />
            </div>
          </div>
        </div>

        {/* Technical Setup Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 pb-2 border-b border-white/20 dark:border-gray-800/50 mt-8">Technical Setup</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="input-label">Domain Name</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/40 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md text-gray-500 dark:text-gray-400 sm:text-sm">
                  https://
                </span>
                <input type="text" required defaultValue={existingTemple?.domain} className="input-field rounded-l-none" placeholder="templedomain.org" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="input-label">Subscription Plan</label>
              <select className="input-field bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl" required defaultValue={existingTemple?.plan || 'Basic'}>
                <option value="Basic">Basic Plan</option>
                <option value="Premium">Premium Plan</option>
                <option value="Enterprise">Enterprise Plan</option>
              </select>
            </div>
            
            {isEditing && (
              <>
                <div className="space-y-1">
                  <label className="input-label">App Status</label>
                  <select className="input-field bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl" defaultValue={existingTemple?.appStatus}>
                    <option value="Not Started">Not Started</option>
                    <option value="In Review">In Review</option>
                    <option value="Live">Live</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="input-label">Software Status</label>
                  <select className="input-field bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl" defaultValue={existingTemple?.softwareStatus}>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/20 dark:border-gray-800/50">
          <Link to="/temples" className="px-5 py-2.5 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors shadow-sm">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEditing ? 'Update Temple' : 'Save Temple'}
          </button>
        </div>
      </form>
    </div>
  );
};
