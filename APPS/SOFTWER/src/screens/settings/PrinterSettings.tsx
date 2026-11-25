import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Printer, Settings2, Save } from 'lucide-react';
import ReceiptView from '../../printer/ReceiptView';

export default function PrinterSettings() {
  const { printerType, defaultPrinter, setPrinterType, setDefaultPrinter } = useSettingsStore();
  const [testReceipt, setTestReceipt] = React.useState<any>(null);

  const handleTestPrint = () => {
    setTestReceipt({
      id: `TEST-${Math.floor(Math.random() * 100000)}`,
      timestamp: new Date().toLocaleString(),
      total: 100,
      cashReceived: 100,
      change: 0,
      items: [{ ticket: { name: 'Test Print Item', price: 100 }, quantity: 1 }]
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Printer Settings</h2>
        <p className="text-gray-500 mt-1">Configure thermal printer settings for the counter.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center bg-gray-50">
          <Settings2 className="h-6 w-6 text-gray-400 mr-3" />
          <h3 className="text-xl font-bold text-gray-800">Hardware Configuration</h3>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Paper Size */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-4">Thermal Paper Width</label>
            <div className="flex gap-4">
              <button
                onClick={() => setPrinterType('58mm')}
                className={`flex-1 py-4 px-6 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  printerType === '58mm' ? 'border-orange-500 bg-orange-50 text-orange-900 shadow' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="font-black text-2xl mb-1">58mm</div>
                <div className="text-sm font-medium opacity-80">Narrow / Standard</div>
              </button>
              <button
                onClick={() => setPrinterType('80mm')}
                className={`flex-1 py-4 px-6 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                  printerType === '80mm' ? 'border-orange-500 bg-orange-50 text-orange-900 shadow' : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <div className="font-black text-2xl mb-1">80mm</div>
                <div className="text-sm font-medium opacity-80">Wide / Premium</div>
              </button>
            </div>
          </div>

          {/* Active Printer */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Active Printer (System)</label>
            <select
              value={defaultPrinter}
              onChange={(e) => setDefaultPrinter(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
              <option value="Microsoft Print to PDF">Microsoft Print to PDF</option>
              <option value="POS-58">POS-58 (USB)</option>
              <option value="POS-80">POS-80 (Network)</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">If you select a hardware printer, it must be installed in Windows OS Settings first.</p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button
            onClick={handleTestPrint}
            className="flex items-center px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4 mr-2" /> Print Test Page
          </button>
          
          <button className="flex items-center px-8 py-2.5 bg-gray-900 text-white rounded-lg font-bold shadow-sm hover:bg-gray-800 transition-colors">
            <Save className="h-4 w-4 mr-2" /> Save Settings
          </button>
        </div>
      </div>

      <ReceiptView 
        receipt={testReceipt}
        onClose={() => setTestReceipt(null)}
        isReprint={false}
      />

    </div>
  );
}
