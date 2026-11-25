import React, { useState, useEffect } from 'react';
import { Lock, FileText, CheckCircle, Calculator, Info } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function ShiftManagement() {
  const logout = useAuthStore((state) => state.logout);
  const [shift, setShift] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openingBalanceInput, setOpeningBalanceInput] = useState('');
  const [physicalCashCounted, setPhysicalCashCounted] = useState('');
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  const fetchCurrentShift = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/shifts/current');
      if (res.data.success) {
        setShift(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch shift:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenShift = async () => {
    if (!openingBalanceInput) return;
    try {
      const res = await api.post('/shifts/open', { openingBalance: Number(openingBalanceInput) });
      if (res.data.success) {
        fetchCurrentShift();
        window.dispatchEvent(new Event('shiftUpdated'));
      }
    } catch (err) {
      console.error('Failed to open shift:', err);
    }
  };

  const handleCloseShift = async () => {
    if (!physicalCashCounted) return;
    
    const physical = Number(physicalCashCounted);
    const expected = (shift.expectedCash || 0);
    
    if (physical !== expected && !discrepancyReason) {
      alert('Please provide a reason for the cash discrepancy before closing.');
      return;
    }

    setIsClosing(true);
    try {
      const res = await api.post('/shifts/close', { 
        physicalCashCounted: physical,
        discrepancyReason
      });
      if (res.data.success) {
        setShift(res.data.data);
        window.dispatchEvent(new Event('shiftUpdated'));
        alert('Shift submitted for verification. You will now be logged out.');
        logout();
      }
    } catch (err) {
      console.error('Failed to close shift:', err);
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  // If shift is pending verification
  if (shift && shift.status === 'Pending Verification') {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-in fade-in max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-full text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Shift Submitted</h2>
          <p className="text-gray-500 mb-8">Your cash count has been submitted. Waiting for the Accountant to verify and accept the cash.</p>
          <button
            onClick={logout}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors"
          >
            Log Out Now
          </button>
        </div>
      </div>
    );
  }

  // If no open shift
  if (!shift || shift.status === 'Closed' || shift.status === 'Verified') {
    return (
      <div className="flex flex-col items-center justify-center h-full animate-in fade-in max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 w-full text-center">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Open Your Shift</h2>
          <p className="text-gray-500 mb-8">You must declare your opening float (cash in drawer) before you can start selling tickets.</p>
          
          <div className="text-left mb-6">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Opening Float Amount (₹)</label>
            <input
              type="number"
              value={openingBalanceInput}
              onChange={(e) => setOpeningBalanceInput(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full text-xl font-bold p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <button
            onClick={handleOpenShift}
            disabled={!openingBalanceInput}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
          >
            Start Shift
          </button>
        </div>
      </div>
    );
  }

  // If shift is Open
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col animate-in fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Daily Closing & Cash Management</h2>
        <p className="text-gray-500">Reconcile your physical cash with the system before closing your shift.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - System Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-gray-400" />
            <h3 className="font-bold text-gray-900 dark:text-white">System Collection Summary</h3>
          </div>
          
          <div className="p-6 space-y-6 flex-1">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Opening Balance (Float)</span>
              <span className="font-mono font-bold text-lg">₹{(shift.openingBalance || 0).toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center px-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Total Cash Sales</span>
              <span className="font-mono font-bold text-lg text-green-600">+ ₹{(shift.systemCashSales || 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-900 dark:text-blue-100">Expected Cash in Drawer</span>
              </div>
              <span className="font-black text-2xl text-blue-700 dark:text-blue-400">₹{(shift.expectedCash || 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center px-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-gray-500 font-medium">Total Online / UPI</span>
              <span className="font-mono font-bold text-gray-600 dark:text-gray-300">₹{(shift.systemOnlineSales || 0).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="bg-gray-900 text-white p-6 flex justify-between items-center mt-auto">
            <span className="font-bold">Shift Total Revenue</span>
            <span className="font-black text-2xl text-green-400">₹{((shift.systemCashSales || 0) + (shift.systemOnlineSales || 0)).toLocaleString()}</span>
          </div>
        </div>

        {/* Right Side - Physical Reconciliation */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-gray-900 dark:text-white">Cash Reconciliation</h3>
            </div>
            
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Physical Cash Counted (₹)</label>
              <input
                type="number"
                value={physicalCashCounted}
                onChange={(e) => setPhysicalCashCounted(e.target.value)}
                placeholder="0"
                className="w-full text-center text-4xl font-black p-8 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 outline-none mb-6"
              />
              
              {physicalCashCounted !== '' && Number(physicalCashCounted) !== (shift.expectedCash || 0) && (
                <div className="mb-6 animate-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-red-600 dark:text-red-400 mb-2">
                    Discrepancy Reason Required
                  </label>
                  <p className="text-xs text-gray-500 mb-2">You counted ₹{Number(physicalCashCounted).toLocaleString()} but system expects ₹{(shift.expectedCash || 0).toLocaleString()}.</p>
                  <textarea
                    value={discrepancyReason}
                    onChange={(e) => setDiscrepancyReason(e.target.value)}
                    placeholder="Explain why the cash does not match..."
                    className="w-full p-4 border border-red-300 dark:border-red-800 rounded-xl bg-red-50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-500 outline-none resize-none h-24"
                  />
                </div>
              )}
              
              <button
                onClick={handleCloseShift}
                disabled={!physicalCashCounted || isClosing || (Number(physicalCashCounted) !== (shift.expectedCash || 0) && !discrepancyReason)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                {isClosing ? 'Closing Shift...' : (
                  <>
                    <Lock className="w-5 h-5" />
                    Generate Shift Closing Report
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Category Breakdown Details */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex-1">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-400" />
              <h3 className="font-bold text-gray-900 dark:text-white">Category Breakdown</h3>
            </div>
            <div className="p-6">
              {Object.keys(shift.categoryBreakdown || {}).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sales recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(shift.categoryBreakdown).map(([category, amounts]: [string, any]) => (
                    <div key={category} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                      <span className="font-bold text-gray-700 dark:text-gray-300">{category}</span>
                      <div className="text-right">
                        <div className="text-sm"><span className="text-gray-500">Cash:</span> <span className="font-mono font-bold">₹{(amounts.cash || 0).toLocaleString()}</span></div>
                        <div className="text-sm"><span className="text-gray-500">Online:</span> <span className="font-mono font-bold">₹{(amounts.online || 0).toLocaleString()}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
