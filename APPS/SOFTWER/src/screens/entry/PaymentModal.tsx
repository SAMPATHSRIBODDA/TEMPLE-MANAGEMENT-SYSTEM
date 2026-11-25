import React, { useState, useEffect } from 'react';
import { IndianRupee, X } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onConfirm: (cashReceived: number) => void;
}

export default function PaymentModal({ isOpen, total, onClose, onConfirm }: PaymentModalProps) {
  const [cashReceived, setCashReceived] = useState<string>(total.toString());

  useEffect(() => {
    if (isOpen) {
      setCashReceived(total.toString());
    }
  }, [isOpen, total]);

  if (!isOpen) return null;

  const cash = parseFloat(cashReceived) || 0;
  const change = Math.max(0, cash - total);
  const isValid = cash >= total;

  const handleQuickAmount = (amount: number) => {
    setCashReceived(amount.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Process Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Total */}
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-xl p-4 flex justify-between items-center border border-orange-100 dark:border-orange-800">
            <span className="text-orange-900 dark:text-orange-100 font-medium text-lg">Total Due</span>
            <span className="text-3xl font-bold text-orange-700 dark:text-orange-400">₹{total}</span>
          </div>

          {/* Cash Received Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cash Received</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IndianRupee className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="number"
                min={total}
                className={`pl-12 w-full text-2xl font-bold rounded-xl border-2 ${isValid ? 'border-gray-300 dark:border-gray-600 focus:border-green-500' : 'border-red-300 dark:border-red-600 focus:border-red-500'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 outline-none transition-all`}
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValid) {
                    onConfirm(cash);
                  }
                }}
                autoFocus
              />
            </div>
            
            {/* Quick cash buttons */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[100, 200, 500, 2000].map(amt => (
                <button
                  key={amt}
                  onClick={() => handleQuickAmount(amt)}
                  className="py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg text-sm transition-colors border border-gray-200 dark:border-gray-700"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Change */}
          <div className="flex justify-between items-center px-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Change to Return</span>
            <span className={`text-2xl font-bold ${change > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
              ₹{change}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(cash)}
            disabled={!isValid}
            className="flex-1 py-3 bg-green-600 rounded-xl text-white font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Generate Receipt
          </button>
        </div>

      </div>
    </div>
  );
}
