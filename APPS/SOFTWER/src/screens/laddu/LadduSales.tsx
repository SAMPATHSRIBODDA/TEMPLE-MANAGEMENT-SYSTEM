import React, { useState } from 'react';
import { useLadduStore } from '../../store/ladduStore';
import api from '../../services/api';
import { useMasterDataStore } from '../../store/masterDataStore';
import { ladduTypesConfig } from '../masters/masterConfigs';
import PaymentModal from '../entry/PaymentModal';
import ReceiptView from '../../printer/ReceiptView';
import { Trash2, Plus, Minus, History, ShoppingCart, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LadduSales() {
  const navigate = useNavigate();
  const { cart, stocks, addItem, updateQuantity, clearCart, getCartTotal, processOrder } = useLadduStore();
  
  const [rawLadduTypes, setRawLadduTypes] = useState<any[]>([]);
  const activeLadduTypes = rawLadduTypes.filter(t => t.isActive);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/v1/ticket-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const tickets = data.data.filter((t:any) => t.sectionName === 'Laddu Sales');
          setRawLadduTypes(tickets);
        }
      })
      .catch(console.error);
  }, []);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<any>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F8' && !isPaymentOpen && !activeReceipt) {
        e.preventDefault();
        setIsPaymentOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaymentOpen, activeReceipt]);

  const total = getCartTotal();

  const handlePaymentConfirm = async (cashReceived: number) => {
    const change = cashReceived - total;
    
    const orderData = {
      id: `LADDU-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toLocaleString(),
      items: [...cart],
      total,
      cashReceived,
      change
    };

    processOrder(orderData);
    
    const receiptData = {
      ...orderData,
      items: orderData.items.map(i => ({
        ticket: i.laddu,
        quantity: i.quantity
      }))
    };
    
    setActiveReceipt(receiptData);
    setIsPaymentOpen(false);

    // Sync to backend
    try {
      await api.post('/transactions', {
        paymentMethod: 'Cash',
        totalAmount: total,
        items: orderData.items.map(i => ({
          type: 'Laddu',
          name: i.laddu.name,
          price: i.laddu.price,
          quantity: i.quantity
        }))
      });
    } catch (err) {
      console.warn('Backend sync failed (offline mode):', err);
    }
  };

  const getStock = (id: string) => {
    const stock = stocks.find(s => s.ladduId === id);
    return stock ? stock.remainingStock : 0;
  };

  return (
    <div className="h-full flex gap-6 animate-in fade-in duration-300">
      
      {/* Left Panel: Laddu Selection Grid */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Laddu Sales Terminal</h2>
          <button 
            onClick={() => navigate('/laddu/history')}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <History className="h-4 w-4 mr-2" /> View Orders
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeLadduTypes.map(laddu => {
            const stockRemaining = getStock(laddu.id);
            const isOutOfStock = stockRemaining === 0;

            return (
              <button
                key={laddu.id}
                onClick={() => !isOutOfStock && addItem(laddu)}
                disabled={isOutOfStock}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all transform active:scale-95 shadow-sm hover:shadow relative ${
                  isOutOfStock ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 opacity-70 cursor-not-allowed' : 'bg-orange-50 border-orange-200 text-orange-900 hover:bg-orange-100'
                }`}
              >
                {/* Stock Indicator */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold border flex items-center ${
                  stockRemaining > 50 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 
                  stockRemaining > 0 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700'
                }`}>
                  <Package className="h-3 w-3 mr-1" />
                  {stockRemaining} Left
                </div>

                <div className="h-12 w-12 rounded-full bg-white/50 flex items-center justify-center mb-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-current opacity-80"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                
                <span className="font-bold text-lg leading-tight mb-1">{laddu.name}</span>
                <span className="font-black text-2xl">₹{laddu.price}</span>
              </button>
            )
          })}
          {activeLadduTypes.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-4 text-red-500 font-bold bg-red-50 rounded-xl">
              No active Laddu types configured. Please configure in Master Data.
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Cart / POS Checkout */}
      <div className="w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        
        {/* Cart Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <div className="flex items-center text-gray-800 dark:text-gray-200 font-bold">
            <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
            Order Summary
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
              <Package className="h-16 w-16 mb-4" />
              <p>Add laddus to cart</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.laddu.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">{item.laddu.name}</h4>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">₹{item.laddu.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                    <button onClick={() => updateQuantity(item.laddu.id, -1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg text-gray-600 dark:text-gray-400">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800 dark:text-gray-200">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.laddu.id, 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg text-gray-600 dark:text-gray-400">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white w-12 text-right">
                    ₹{item.laddu.price * item.quantity}
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
            Collect Payment (₹{total})
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
