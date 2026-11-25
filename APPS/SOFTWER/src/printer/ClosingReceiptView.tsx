import React, { useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { Printer, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface ClosingData {
  id: string;
  timestamp: string;
  systemCash: number;
  physicalCash: number;
  discrepancy: number;
  totalOnline: number;
  totalRevenue: number;
  totalTickets: number;
}

interface ClosingReceiptViewProps {
  data: ClosingData | null;
  onClose: () => void;
}

export default function ClosingReceiptView({ data, onClose }: ClosingReceiptViewProps) {
  const { printerType } = useSettingsStore();
  const { user } = useAuthStore();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' || e.key === 'F8' || (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!data) return null;

  const containerWidth = printerType === '58mm' ? 'w-[220px]' : 'w-[320px]';
  const textScale = printerType === '58mm' ? 'text-[10px]' : 'text-sm';
  const titleScale = printerType === '58mm' ? 'text-sm' : 'text-xl';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-200 print:bg-transparent print:backdrop-blur-none print:static print:block">
      
      <div className="flex flex-col items-center print:block">
        
        {/* Receipt Wrapper */}
        <div ref={receiptRef} className={`bg-white ${containerWidth} pb-8 shadow-2xl relative receipt-print-target`}>
          
          <div className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-100" style={{ backgroundImage: 'radial-gradient(circle, transparent 4px, white 4px)', backgroundSize: '10px 10px', backgroundPosition: '-5px -5px' }}></div>
          
          <div className="w-full bg-black text-white text-center text-xs font-bold py-1 uppercase tracking-widest">
            SHIFT CLOSING REPORT
          </div>

          <div className="px-4 pt-4 pb-2 text-center border-b-2 border-dashed border-gray-300">
            <h2 className={`${titleScale} font-black text-black leading-tight`}>SRI TUNI TEMPLE</h2>
            <p className={`${textScale} text-black font-medium mt-1`}>End of Shift Summary</p>
          </div>

          <div className={`px-4 py-3 space-y-1 border-b-2 border-dashed border-gray-300 ${textScale} text-black`}>
            <div className="flex justify-between">
              <span className="font-semibold">Report ID:</span>
              <span>{data.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Generated:</span>
              <span>{data.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Staff:</span>
              <span>{user?.name} (Shift {user?.shift})</span>
            </div>
          </div>

          <div className={`px-4 py-3 space-y-2 border-b-2 border-dashed border-gray-300 ${textScale} text-black`}>
            <h3 className="font-bold text-center underline mb-2">REVENUE SUMMARY</h3>
            <div className="flex justify-between">
              <span>Total Cash Coll:</span>
              <span className="font-bold">₹{data.systemCash}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Online:</span>
              <span className="font-bold">₹{data.totalOnline}</span>
            </div>
            <div className="flex justify-between border-t border-black pt-1 mt-1 font-black">
              <span>TOTAL REVENUE:</span>
              <span>₹{data.totalRevenue}</span>
            </div>
          </div>

          <div className={`px-4 py-3 space-y-2 border-b-2 border-dashed border-gray-300 ${textScale} text-black`}>
            <h3 className="font-bold text-center underline mb-2">CASH RECONCILIATION</h3>
            <div className="flex justify-between">
              <span>System Expected:</span>
              <span>₹{data.systemCash}</span>
            </div>
            <div className="flex justify-between">
              <span>Physical Count:</span>
              <span>₹{data.physicalCash}</span>
            </div>
            <div className={`flex justify-between font-bold mt-1 ${data.discrepancy === 0 ? 'text-black' : 'text-black bg-gray-200'}`}>
              <span>Discrepancy:</span>
              <span>₹{Math.abs(data.discrepancy)} {data.discrepancy < 0 ? '(SHORT)' : data.discrepancy > 0 ? '(OVER)' : ''}</span>
            </div>
          </div>

           <div className={`px-4 py-4 space-y-8 ${textScale} text-black text-center`}>
              <div className="border-t border-black w-3/4 mx-auto pt-1 mt-8">
                Staff Signature
              </div>
              <div className="border-t border-black w-3/4 mx-auto pt-1">
                Manager Signature
              </div>
           </div>
          
           <div className="absolute bottom-[-10px] left-0 w-full h-4" style={{ backgroundImage: 'radial-gradient(circle, white 4px, transparent 4px)', backgroundSize: '10px 10px', backgroundPosition: '0px -4px', transform: 'rotate(180deg)' }}></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 print:hidden">
          <button
            onClick={onClose}
            className="flex items-center px-6 py-3 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-700 transition-colors shadow-lg"
          >
            <X className="h-5 w-5 mr-2" /> Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Printer className="h-5 w-5 mr-2" /> Print Report
          </button>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body {
            background: white !important;
          }
          body * {
            visibility: hidden;
          }
          .receipt-print-target, .receipt-print-target * {
            visibility: visible !important;
          }
          .receipt-print-target {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: ${printerType === '58mm' ? '58mm' : '80mm'} !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
