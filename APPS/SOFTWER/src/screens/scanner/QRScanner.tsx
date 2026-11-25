import React, { useState, useEffect, useRef } from 'react';
import { QrCode, CheckCircle, XCircle, AlertTriangle, Search, Zap, Clock } from 'lucide-react';
import api from '../../services/api';

type ValidationState = 'IDLE' | 'VALID' | 'USED' | 'EXPIRED' | 'INVALID';

interface TicketDetails {
  id: string;
  type: string;
  section?: string;
  persons: number;
  date: string;
  slot?: string;
  scannedAt?: string;
}

export default function QRScanner() {
  const [scanInput, setScanInput] = useState('');
  const [status, setStatus] = useState<ValidationState>('IDLE');
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input for physical USB QR scanners
  useEffect(() => {
    inputRef.current?.focus();
    
    const interval = setInterval(() => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim() || isProcessing) return;

    await validateTicket(scanInput.trim());
    setScanInput(''); // clear for next scan
  };

  const validateTicket = async (code: string) => {
    setIsProcessing(true);
    setStatus('IDLE');
    setTicketDetails(null);
    
    try {
      const res = await api.post('/tickets/validate', { code });
      if (res.data.success) {
        setStatus(res.data.validationStatus);
        setTicketDetails(res.data.data);
      } else {
        setStatus('INVALID');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setStatus('INVALID');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkUsed = async () => {
    if (status === 'VALID' && ticketDetails) {
      setIsProcessing(true);
      try {
        const res = await api.post('/tickets/mark-used', { code: ticketDetails.id });
        if (res.data.success) {
          setStatus('USED');
          setTicketDetails({
            ...ticketDetails,
            scannedAt: new Date().toLocaleTimeString()
          });
        }
      } catch (error) {
        console.error('Mark used error:', error);
        alert('Failed to mark ticket as used. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300 h-full flex flex-col">
      
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">QR Validator</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Scan tickets using a physical scanner or type the ID manually.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        
        {/* Left Side: Scanner Input & Status */}
        <div className="flex flex-col space-y-6">
          
          {/* Scan Input Box */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <QrCode className="h-20 w-20 text-blue-500 mb-6 relative z-10" />
            
            <form onSubmit={handleScanSubmit} className="w-full relative z-10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Zap className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="Ready to Scan..."
                  className="w-full text-center text-xl tracking-widest uppercase font-mono rounded-xl border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-4 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 outline-none transition-all shadow-inner"
                />
              </div>
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-3">
                Tips: Test with "VALID", "USED", "EXP", or random text.
              </p>
            </form>
          </div>

          {/* Validation Status Card */}
          <div className={`flex-1 rounded-2xl shadow-sm border flex flex-col items-center justify-center p-8 transition-colors duration-300 ${
            status === 'IDLE' ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' :
            status === 'VALID' ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-900 dark:text-green-400' :
            status === 'USED' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-400' :
            status === 'EXPIRED' ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400' :
            'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-900 dark:text-red-400' // INVALID
          }`}>
            {status === 'IDLE' && (
              <>
                <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500">Waiting for scan...</h3>
              </>
            )}
            {status === 'VALID' && (
              <>
                <CheckCircle className="h-20 w-20 text-green-500 mb-4 drop-shadow-md" />
                <h3 className="text-3xl font-black text-green-700 dark:text-green-500">TICKET VALID</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mt-2">Proceed with marking as used</p>
              </>
            )}
            {status === 'USED' && (
              <>
                <AlertTriangle className="h-20 w-20 text-amber-500 mb-4 drop-shadow-md" />
                <h3 className="text-3xl font-black text-amber-700 dark:text-amber-500">ALREADY USED</h3>
                <p className="text-amber-600 dark:text-amber-400 font-medium mt-2">Scanned at: {ticketDetails?.scannedAt}</p>
              </>
            )}
            {status === 'EXPIRED' && (
              <>
                <Clock className="h-20 w-20 text-gray-500 dark:text-gray-400 mb-4 drop-shadow-md" />
                <h3 className="text-3xl font-black text-gray-700 dark:text-gray-300">EXPIRED</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">Date passed: {ticketDetails?.date}</p>
              </>
            )}
            {status === 'INVALID' && (
              <>
                <AlertTriangle className="h-20 w-20 text-red-500 mb-4 drop-shadow-md" />
                <h3 className="text-3xl font-black text-red-700 dark:text-red-500">INVALID CODE ({status})</h3>
                <p className="text-red-600 dark:text-red-400 font-medium mt-2">Ticket not found in database</p>
              </>
            )}
            {status !== 'VALID' && status !== 'USED' && status !== 'EXPIRED' && status !== 'IDLE' && status !== 'INVALID' && (
              <h3 className="text-3xl font-black text-red-700 dark:text-red-500">Unknown Status: {String(status)}</h3>
            )}
          </div>

        </div>

        {/* Right Side: Ticket Details */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Ticket Details</h3>
          </div>
          
          <div className="flex-1 p-6">
            {!ticketDetails ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 opacity-50">
                <QrCode className="h-16 w-16 mb-4" />
                <p>No details available</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Ticket ID</label>
                  <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white">{ticketDetails.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Ticket Type</label>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{ticketDetails.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Persons</label>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{ticketDetails.persons}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Date</label>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{ticketDetails.date}</p>
                  </div>
                  {ticketDetails.slot && (
                    <div>
                      <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Time Slot</label>
                      <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{ticketDetails.slot}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 h-28 flex items-center justify-center">
            {status === 'VALID' ? (
              <button 
                onClick={handleMarkUsed}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg transform transition-transform active:scale-95"
              >
                Mark as Used
              </button>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 font-medium text-center">Scan a valid ticket to take action.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
