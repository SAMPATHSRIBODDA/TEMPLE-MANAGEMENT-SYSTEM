import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import ClosingReceiptView from '../../printer/ClosingReceiptView';
import { Lock, Calculator, AlertCircle, ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ShiftClosing() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  // Mock aggregated data for the shift
  const systemCash = 45250;
  const totalOnline = 12500;
  const totalRevenue = systemCash + totalOnline;
  
  const [physicalCashInput, setPhysicalCashInput] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [closingData, setClosingData] = useState<any>(null);

  const physicalCash = parseFloat(physicalCashInput) || 0;
  const discrepancy = physicalCash - systemCash;

  const handleGenerate = () => {
    if (physicalCashInput === '') {
      alert("Please enter physical cash count.");
      return;
    }

    setClosingData({
      id: `CLS-${Math.floor(Math.random() * 100000)}`,
      timestamp: new Date().toLocaleString(),
      systemCash,
      physicalCash,
      discrepancy,
      totalOnline,
      totalRevenue,
      totalTickets: 245
    });
    
    setIsGenerated(true);
  };

  const handleSignOut = () => {
    // In a real app, this would submit the closing report to the backend first
    logout();
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/reports')}
          className="mr-4 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Shift Closing</h2>
          <p className="text-gray-500 mt-1">Reconcile cash and close Shift {user?.shift} for {user?.name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: System Aggregates */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center">
              <Calculator className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-bold text-gray-800">System Recorded Revenue</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-gray-600 font-medium">Total Online / UPI</span>
                <span className="text-xl font-bold text-gray-900">₹{totalOnline.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-blue-800 font-bold">Total Cash Collected</span>
                <span className="text-2xl font-black text-blue-900">₹{systemCash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-900 rounded-xl text-white mt-4">
                <span className="font-bold">Total Shift Revenue</span>
                <span className="text-2xl font-black">₹{totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Physical Cash Entry */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center">
              <Lock className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-bold text-gray-800">Cash Reconciliation</h3>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <label className="block text-sm font-bold text-gray-700 mb-2">Physical Cash in Drawer (₹)</label>
              <input 
                type="number"
                value={physicalCashInput}
                onChange={(e) => setPhysicalCashInput(e.target.value)}
                disabled={isGenerated}
                className="w-full text-center text-4xl font-black rounded-xl border-2 border-gray-300 py-6 focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="0"
              />

              {physicalCashInput !== '' && (
                <div className={`mt-6 p-4 rounded-xl border-2 flex items-center ${
                  discrepancy === 0 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <AlertCircle className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-bold text-lg">
                      {discrepancy === 0 ? 'Cash Matches Perfectly' : `Discrepancy: ₹${Math.abs(discrepancy)}`}
                    </p>
                    <p className="text-sm font-medium opacity-80">
                      {discrepancy < 0 ? 'Shortfall in drawer' : discrepancy > 0 ? 'Excess in drawer' : 'Ready to close shift'}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-6">
                {!isGenerated ? (
                  <button 
                    onClick={handleGenerate}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 shadow-md transition-all"
                  >
                    Generate Closing Report
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setClosingData({...closingData})} // trigger print modal
                      className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md transition-all flex items-center justify-center"
                    >
                      <Printer className="h-5 w-5 mr-2" /> Print Report
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="flex-1 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 shadow-md transition-all flex items-center justify-center"
                    >
                      <Lock className="h-5 w-5 mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      <ClosingReceiptView 
        data={closingData} 
        onClose={() => setClosingData(null)} 
      />

    </div>
  );
}
