import React, { useState } from 'react';
import { useTicketStore } from '../../store/ticketStore';
import api from '../../services/api';
import { useMasterDataStore } from '../../store/masterDataStore';
import { entryTicketTypesConfig } from '../masters/masterConfigs';
import PaymentModal from './PaymentModal';
import ReceiptView from '../../printer/ReceiptView';
import { Trash2, Plus, Minus, History, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EntryTicket() {
  const navigate = useNavigate();
  const { cart, addItem, updateQuantity, clearCart, getCartTotal, saveReceipt } = useTicketStore();
  
  const [rawTicketTypes, setRawTicketTypes] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/ticket-categories');
        const data = await res.json();
        if (data.success && data.data) {
          setRawTicketTypes(data.data.filter((t:any) => t.sectionName === 'Entry Tickets'));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);

  const activeTicketTypes = rawTicketTypes.filter(t => t.isActive);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F8' && !isPaymentOpen && !activeReceipt && getCartTotal() > 0) {
        e.preventDefault();
        setIsPaymentOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaymentOpen, activeReceipt, getCartTotal]);

  const total = getCartTotal();

  const handlePaymentConfirm = async (cashReceived: number) => {
    const change = cashReceived - total;
    
    const receipt = {
      id: `RCPT-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toLocaleString(),
      items: [...cart],
      total,
      cashReceived,
      change
    };

    saveReceipt(receipt);
    setActiveReceipt(receipt);
    setIsPaymentOpen(false);
    clearCart();

    // Fire-and-forget to backend: create transaction + broadcast socket update
    try {
      await api.post('/transactions', {
        paymentMethod: cashReceived > total ? 'Cash' : 'UPI',
        totalAmount: total,
        items: receipt.items.map(i => ({
          type: 'Ticket',
          name: i.ticket.name,
          price: i.ticket.price,
          quantity: i.quantity
        }))
      });
    } catch (err) {
      console.warn('Backend sync failed (offline mode):', err);
    }
  };

  return (
    <div className="h-full flex gap-6 animate-in fade-in duration-300 overflow-hidden">
      
      {/* Left Panel: Ticket Selection Grid */}
      <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Entry Tickets</h2>
          <button 
            onClick={() => navigate('/entry/history')}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <History className="h-4 w-4 mr-2" /> View History
          </button>
        </div>

        {activeTicketTypes.length === 0 && (
          <div className="text-center p-4 text-red-500 font-bold bg-red-50 rounded-xl">
            No active Entry Tickets configured. Please configure in Master Data.
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeTicketTypes.map((ticket: any) => (
            <button
              key={ticket._id || ticket.id}
              onClick={() => addItem(ticket)}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all transform active:scale-95 shadow-sm hover:shadow bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100`}
            >
              <TicketIcon className="h-10 w-10 mb-3 opacity-80" />
              <span className="font-bold text-lg leading-tight mb-1">{ticket.name}</span>
              <span className="font-black text-2xl">₹{ticket.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Cart / POS Checkout */}
      <div className="w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        
        {/* Cart Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <div className="flex items-center text-gray-800 dark:text-gray-200 font-bold">
            <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
            Current Order
          </div>
          <button 
            onClick={clearCart}
            disabled={cart.length === 0}
            className="text-red-500 hover:text-red-700 disabled:opacity-30 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.ticket.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">{item.ticket.name}</h4>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">₹{item.ticket.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                    <button onClick={() => updateQuantity(item.ticket.id, -1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg text-gray-600 dark:text-gray-400">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800 dark:text-gray-200">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.ticket.id, 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg text-gray-600 dark:text-gray-400">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white w-12 text-right">
                    ₹{item.ticket.price * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 dark:text-gray-400 font-medium">Total Amount</span>
            <span className="text-4xl font-black text-gray-900 dark:text-white">₹{total}</span>
          </div>
          
          <button
            onClick={() => setIsPaymentOpen(true)}
            disabled={cart.length === 0}
            className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg shadow-sm hover:bg-orange-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Process Payment (₹{total})
          </button>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        total={total}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handlePaymentConfirm}
      />

      <ReceiptView 
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />

    </div>
  );
}

const TicketIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
    <path d="M13 5v2"/>
    <path d="M13 17v2"/>
    <path d="M13 11v2"/>
  </svg>
);
