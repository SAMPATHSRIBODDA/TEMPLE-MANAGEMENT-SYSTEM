import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Power, MapPin, Phone, Mail, Globe, Calendar, Smartphone, Server, CreditCard, Building2 } from 'lucide-react';
import { templesList } from '../../data/mockData';

export const TempleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const temple = templesList.find(t => t.id === id);

  if (!temple) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Temple Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The temple you are looking for does not exist.</p>
        <button onClick={() => navigate('/temples')} className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium cursor-pointer">Go Back to List</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <Link to="/temples" className="p-2 -ml-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-gray-100 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{temple.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                temple.softwareStatus === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'
              }`}>
                {temple.softwareStatus}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
              <MapPin size={14} /> {temple.address}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {temple.softwareStatus === 'Active' ? (
            <button className="px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-warning text-sm font-semibold rounded-xl hover:bg-warning/5 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
              <Power size={16} /> Suspend
            </button>
          ) : (
            <button className="px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 text-success text-sm font-semibold rounded-xl hover:bg-success/5 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
              <Power size={16} /> Activate
            </button>
          )}
          <Link to={`/temples/${temple.id}/edit`} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Edit size={16} /> Edit Details
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Building2 size={18} className="text-gray-400 dark:text-gray-500" /> Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Temple Name</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{temple.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Registered On</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
                  {new Date(temple.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Complete Address</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{temple.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Office Contact</p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Phone size={16} className="text-gray-400 dark:text-gray-500" />
                  {temple.contact}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Globe size={18} className="text-gray-400 dark:text-gray-500" /> Digital Infrastructure
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Primary Domain</p>
                <a href={`https://${temple.domain}`} target="_blank" rel="noreferrer" className="text-base font-semibold text-primary hover:underline flex items-center gap-2">
                  {temple.domain}
                </a>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Subscription Plan</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 dark:text-gray-300 border border-white/40 dark:border-gray-700/50">
                  {temple.plan}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Mobile App Status</p>
                <div className="flex items-center gap-2">
                  <Smartphone size={16} className={temple.appStatus === 'Live' ? 'text-success' : 'text-gray-400 dark:text-gray-500'} />
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{temple.appStatus}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Software System</p>
                <div className="flex items-center gap-2">
                  <Server size={16} className={temple.softwareStatus === 'Active' ? 'text-success' : 'text-danger'} />
                  <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{temple.softwareStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Side Info */}
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-6">Administrator</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                {temple.admin.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{temple.admin.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Primary Contact</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md flex items-center justify-center text-gray-500 dark:text-gray-400 border border-white/20 dark:border-gray-800/50">
                  <Mail size={14} />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{temple.admin.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/40 dark:bg-gray-800/40 backdrop-blur-md flex items-center justify-center text-gray-500 dark:text-gray-400 border border-white/20 dark:border-gray-800/50">
                  <Phone size={14} />
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{temple.admin.phone}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-400 dark:text-gray-500" /> Billing Info
            </h3>
            <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-800/50 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Plan: <span className="font-bold text-gray-900 dark:text-gray-100">{temple.plan}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Renews on Oct 15, 2026</p>
              <button className="w-full py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-white/40 dark:bg-gray-800/40 backdrop-blur-md transition-colors cursor-pointer">
                View Invoices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
