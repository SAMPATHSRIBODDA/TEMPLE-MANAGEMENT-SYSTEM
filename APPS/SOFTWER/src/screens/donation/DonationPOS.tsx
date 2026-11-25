import React, { useState } from 'react';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useTicketStore } from '../../store/ticketStore';
import { useMasterDataStore } from '../../store/masterDataStore';
import api from '../../services/api';

export default function DonationPOS() {
  const { cart, addItem, clearCart, getCartTotal, saveReceipt } = useTicketStore();
  const { data } = useMasterDataStore();
  const donations = data['donation-categories'] || [
    { id: '1', name: 'General Donation', minAmount: 100 },
    { id: '2', name: 'Annadanam', minAmount: 500 }
  ];

  const total = getCartTotal();

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    const receipt = {
      id: `RCPT-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toLocaleString(),
      items: [...cart],
      total,
      cashReceived: total,
      change: 0
    };

    saveReceipt(receipt);
    clearCart();

    try {
      await api.post('/transactions', {
        paymentMethod: 'Cash',
        totalAmount: total,
        items: receipt.items.map(i => ({
          type: 'Donation',
          name: i.ticket.name,
          price: i.ticket.price,
          quantity: i.quantity,
          sectionName: 'Donations'
        }))
      });
      alert('Checkout successful!');
    } catch (err) {
      console.warn('Backend sync failed:', err);
      alert('Checkout successful (Offline)');
    }
  };

  return (
    <div className="h-full flex gap-6 animate-in fade-in duration-300 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Donations</h2>
        </div>

        {donations.length === 0 && (
          <div className="text-center p-4 text-red-500 font-bold bg-red-50 rounded-xl">
            No donation categories configured.
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {donations.map((don: any) => (
            <button
              key={don.id}
              onClick={() => addItem({ id: don.id, name: don.name, price: don.minAmount })}
              className="p-6 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all transform active:scale-95 shadow-sm hover:shadow bg-pink-50 border-pink-200 text-pink-900 hover:bg-pink-100"
            >
              <Heart className="h-10 w-10 mb-3 opacity-80 text-pink-500" />
              <span className="font-bold text-lg leading-tight mb-1">{don.name}</span>
              <span className="font-black text-2xl">₹{don.minAmount}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-[400px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
          <div className="flex items-center text-gray-800 dark:text-gray-200 font-bold">
            <ShoppingCart className="h-5 w-5 mr-2 text-orange-600" />
            Current Order
          </div>
          <button onClick={clearCart} disabled={cart.length === 0} className="text-red-500 hover:text-red-700 disabled:opacity-30 transition-colors">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
              <ShoppingCart className="h-16 w-16 mb-4" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200">{item.ticket.name}</h4>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">₹{item.ticket.price} × {item.quantity}</p>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">₹{item.ticket.price * item.quantity}</span>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Total Amount</span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">₹{total}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
