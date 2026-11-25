import React, { useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X } from 'lucide-react';

interface ReceiptItem {
  ticket: { name: string; price: number };
  quantity: number;
}

interface Receipt {
  id: string;
  timestamp: string;
  items: ReceiptItem[];
  total: number;
  cashReceived: number;
  change: number;
}

interface ReceiptViewProps {
  receipt: Receipt | null;
  onClose: () => void;
  isReprint?: boolean;
}

export default function ReceiptView({ receipt, onClose, isReprint = false }: ReceiptViewProps) {
  const { printerType } = useSettingsStore();
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

  if (!receipt) return null;

  // 58mm ~ 220px, 80mm ~ 300px width
  const containerWidth = printerType === '58mm' ? 'w-[220px]' : 'w-[320px]';
  const textScale = printerType === '58mm' ? 'text-[10px]' : 'text-sm';
  const titleScale = printerType === '58mm' ? 'text-sm' : 'text-xl';
  const qrSize = printerType === '58mm' ? 80 : 128;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm animate-in fade-in duration-200 print:bg-transparent print:backdrop-blur-none print:static print:block">
      
      {/* Container - hides on print so only receipt shows */}
      <div className="flex flex-col items-center print:block">
        
        {/* Receipt Wrapper (Simulates thermal paper) */}
        <div ref={receiptRef} className={`bg-white ${containerWidth} pb-8 shadow-2xl relative receipt-print-target`}>
          
          {/* Jagged top border */}
          <div className="w-full h-4 bg-gradient-to-r from-gray-200 to-gray-100" style={{ backgroundImage: 'radial-gradient(circle, transparent 4px, white 4px)', backgroundSize: '10px 10px', backgroundPosition: '-5px -5px' }}></div>
          
          {isReprint && (
            <div className="w-full bg-gray-800 text-white text-center text-[10px] font-bold py-1 uppercase tracking-widest">
              *** Duplicate Copy ***
            </div>
          )}

          <div className="px-4 pt-4 pb-2 text-center border-b-2 border-dashed border-gray-300">
            <h2 className={`${titleScale} font-black text-black leading-tight`}>SRI TUNI TEMPLE</h2>
            <p className={`${textScale} text-black font-medium mt-1`}>Official Receipt</p>
          </div>

          <div className={`px-4 py-3 space-y-1 border-b-2 border-dashed border-gray-300 ${textScale} text-black`}>
            <div className="flex justify-between">
              <span className="font-semibold">Rcpt No:</span>
              <span>{receipt.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Date/Time:</span>
              <span>{receipt.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Counter:</span>
              <span>Counter 1</span>
            </div>
          </div>

          <div className="px-4 py-3 border-b-2 border-dashed border-gray-300">
            <table className={`w-full ${textScale} text-black`}>
              <thead>
                <tr className="font-bold border-b border-black">
                  <th className="text-left pb-1">Item</th>
                  <th className="text-center pb-1">Qty</th>
                  <th className="text-right pb-1">Amt</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, i) => (
                  <tr key={i} className="mt-1">
                    <td className="py-1 truncate pr-1">{item.ticket.name}</td>
                    <td className="text-center py-1">{item.quantity}</td>
                    <td className="text-right py-1">₹{item.ticket.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`px-4 py-3 space-y-1 ${textScale} text-black border-b-2 border-dashed border-gray-300`}>
             <div className={`flex justify-between font-black ${printerType === '58mm' ? 'text-sm' : 'text-lg'}`}>
              <span>TOTAL</span>
              <span>₹{receipt.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash Recv:</span>
              <span>₹{receipt.cashReceived}</span>
            </div>
            <div className="flex justify-between">
              <span>Change:</span>
              <span>₹{receipt.change}</span>
            </div>
          </div>

          <div className="px-4 pt-4 flex flex-col items-center text-black">
            <QRCodeSVG value={receipt.id} size={qrSize} level="M" includeMargin={false} />
            <p className={`mt-2 font-mono font-bold ${textScale}`}>{receipt.id}</p>
            <p className={`mt-3 font-medium text-center ${textScale}`}>Thank you for visiting.</p>
          </div>
          
          {/* Jagged bottom */}
           <div className="absolute bottom-[-10px] left-0 w-full h-4" style={{ backgroundImage: 'radial-gradient(circle, white 4px, transparent 4px)', backgroundSize: '10px 10px', backgroundPosition: '0px -4px', transform: 'rotate(180deg)' }}></div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
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
            <Printer className="h-5 w-5 mr-2" /> Print Receipt
          </button>
        </div>

      </div>

      {/* Global Print Styles specific to this component */}
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
