import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertTriangle, FileText, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import api from '../../services/api';

export default function DailyClosing() {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [pendingShifts, setPendingShifts] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedShift, setExpandedShift] = useState<string | null>(null);

  const fetchDailySummary = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/shifts/daily-summary', { params: { date } });
      if (res.data.success) {
        setShifts(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error('Failed to fetch daily summary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingShifts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/shifts/pending');
      if (res.data.success) {
        setPendingShifts(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch pending shifts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'pending') {
      fetchPendingShifts();
    } else {
      fetchDailySummary();
    }
  }, [activeTab, date]);

  const handleVerify = async (id: string) => {
    try {
      const res = await api.post(`/shifts/${id}/verify`);
      if (res.data.success) {
        fetchPendingShifts(); // Refresh pending list
      }
    } catch (err) {
      console.error('Failed to verify shift:', err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedShift(expandedShift === id ? null : id);
  };

  const renderShiftCard = (shift: any, isPending: boolean) => (
    <div key={shift._id} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mb-4">
      <div 
        onClick={() => toggleExpand(shift._id)}
        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${shift.discrepancy === 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {shift.discrepancy === 0 ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{shift.userId?.name || 'Unknown Staff'}</p>
            <p className="text-xs text-gray-500">
              {new Date(shift.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
              {shift.endTime ? new Date(shift.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Ongoing'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">System Expected Cash</p>
            <p className="font-bold">₹{((shift.openingBalance || 0) + (shift.systemCashSales || 0)).toLocaleString()}</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs text-gray-500">Staff Counted Cash</p>
            <p className="font-bold text-blue-600">₹{(shift.physicalCashCounted || 0).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Discrepancy</p>
            <p className={`font-bold ${shift.discrepancy === 0 ? 'text-green-600' : 'text-red-600'}`}>
              {shift.discrepancy === 0 ? '₹0' : `₹${(shift.discrepancy || 0).toLocaleString()}`}
            </p>
          </div>
          
          {isPending && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleVerify(shift._id); }}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors ml-4"
            >
              <Lock className="w-4 h-4" /> Verify
            </button>
          )}

          <div className="ml-2">
            {expandedShift === shift._id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
        </div>
      </div>

      {expandedShift === shift._id && (
        <div className="px-6 pb-6 bg-gray-50 dark:bg-gray-800/50 pt-4 animate-in slide-in-from-top-2 border-t border-gray-200 dark:border-gray-700">
          
          {shift.discrepancyReason && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <h4 className="font-bold text-red-900 dark:text-red-100 flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4" /> Discrepancy Reason Provided
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 italic">"{shift.discrepancyReason}"</p>
            </div>
          )}

          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Category Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(shift.categoryBreakdown || {}).map(([category, amounts]: [string, any]) => (
              <div key={category} className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <p className="font-bold text-gray-900 dark:text-white text-sm mb-2">{category}</p>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Cash:</span>
                  <span className="font-mono font-bold">₹{(amounts.cash || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Online:</span>
                  <span className="font-mono font-bold text-indigo-600">₹{(amounts.online || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Header & Tabs */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Shift Audits & Verifications</h2>
        <p className="text-gray-500 mb-6">Verify cash from counter staff and view historical shift data.</p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'pending' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Pending Verifications
              {pendingShifts.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingShifts.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeTab === 'history' 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Shift History
            </button>
          </div>

          {activeTab === 'history' && (
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-20">
          {activeTab === 'pending' && (
            <div>
              {pendingShifts.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">All Caught Up!</p>
                  <p className="text-gray-500">There are no pending shifts to verify right now.</p>
                </div>
              ) : (
                pendingShifts.map((shift) => renderShiftCard(shift, true))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {/* Master Summary Cards */}
              {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total System Cash</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">₹{(summary.totalExpectedCash || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Physical Cash</p>
                    <p className="text-2xl font-black text-blue-600">₹{(summary.totalPhysicalCash || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Discrepancy</p>
                    <p className={`text-2xl font-black ${summary.totalDiscrepancy === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.totalDiscrepancy === 0 ? 'Balanced' : `₹${(summary.totalDiscrepancy || 0).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Total Online/UPI</p>
                    <p className="text-2xl font-black text-purple-600">₹{(summary.totalOnline || 0).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {summary && summary.categoryBreakdown && Object.keys(summary.categoryBreakdown).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" /> Category-wise Total Sales
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Object.entries(summary.categoryBreakdown).map(([category, amounts]: [string, any]) => (
                      <div key={category} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <p className="font-bold text-gray-900 dark:text-white text-sm mb-3 truncate" title={category}>{category}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Cash</span>
                            <span className="font-mono font-bold text-gray-900 dark:text-gray-300">₹{(amounts.cash || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500 font-medium">Online</span>
                            <span className="font-mono font-bold text-indigo-600">₹{(amounts.online || 0).toLocaleString()}</span>
                          </div>
                          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs">
                            <span className="text-gray-900 dark:text-white font-bold">Total</span>
                            <span className="font-mono font-black text-green-600">₹{((amounts.cash || 0) + (amounts.online || 0)).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {shifts.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <p className="text-gray-500">No verified shifts for this date.</p>
                </div>
              ) : (
                shifts.map((shift) => renderShiftCard(shift, false))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
