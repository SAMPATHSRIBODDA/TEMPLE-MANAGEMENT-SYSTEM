import React, { useState, useEffect } from 'react';
import { useDarshanStore } from '../../store/darshanStore';
import api from '../../services/api';
import { useMasterDataStore } from '../../store/masterDataStore';
import { darshanTypesConfig } from '../masters/masterConfigs';
import PaymentModal from '../entry/PaymentModal';
import ReceiptView from '../../printer/ReceiptView';
import { History, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TIME_SLOTS = ['06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

export default function DarshanBooking() {
  const navigate = useNavigate();
  const { saveBooking } = useDarshanStore();
  
  const [rawDarshanTypes, setRawDarshanTypes] = useState<any[]>([]);
  const activeDarshanTypes = rawDarshanTypes.filter(t => t.isActive);
  const [selectedType, setSelectedType] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/ticket-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const tickets = data.data.filter((t:any) => t.sectionName === 'Darshan');
          setRawDarshanTypes(tickets);
          const active = tickets.filter((t:any) => t.isActive);
          if (active.length > 0) setSelectedType(active[0]);
        }
      })
      .catch(console.error);
  }, []);

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slot, setSlot] = useState<string>(TIME_SLOTS[0]);
  const [persons, setPersons] = useState<number>(1);
  
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

  const total = (selectedType?.price || 0) * persons;

  const handlePaymentConfirm = async (cashReceived: number) => {
    if (!selectedType) return;
    const change = cashReceived - total;
    
    const booking = {
      id: `DRSH-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toLocaleString(),
      darshanType: selectedType,
      date,
      slot,
      persons,
      total,
      cashReceived,
      change
    };

    saveBooking(booking);

    const receiptData = {
      id: booking.id,
      timestamp: booking.timestamp,
      total,
      cashReceived,
      change,
      items: [{
        ticket: { id: selectedType.id, name: `${selectedType.name} (${date} ${slot})`, price: selectedType.price, color: '' },
        quantity: persons
      }]
    };

    setActiveReceipt(receiptData);
    setIsPaymentOpen(false);

    // Sync to backend
    try {
      await api.post('/transactions', {
        paymentMethod: 'Cash',
        totalAmount: total,
        items: [{
          type: 'Ticket',
          name: `${selectedType.name} - Darshan`,
          price: selectedType.price,
          quantity: persons
        }]
      });
    } catch (err) {
      console.warn('Backend sync failed (offline mode):', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Darshan Booking</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Book slots for General, Special, and VIP Darshan.</p>
        </div>
        <button 
          onClick={() => navigate('/darshan/history')}
          className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <History className="h-4 w-4 mr-2" /> View History
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Step 1: Darshan Type */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">1. Select Darshan Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeDarshanTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedType?.id === type.id 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-gray-600'
                }`}
              >
                <h4 className={`font-bold text-lg ${selectedType?.id === type.id ? 'text-orange-900 dark:text-orange-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {type.name}
                </h4>
                <p className={`font-medium ${selectedType?.id === type.id ? 'text-orange-700 dark:text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  ₹{type.price} / person
                </p>
              </button>
            ))}
            {activeDarshanTypes.length === 0 && (
              <div className="col-span-3 text-center p-4 text-red-500 font-bold bg-red-50 rounded-xl">
                No active Darshan types configured. Please configure in Master Data.
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Date & Slot */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" /> 2. Select Date
            </label>
            <input 
              type="date" 
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              <Clock className="h-4 w-4 mr-2 text-gray-400" /> 3. Select Time Slot
            </label>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
            >
              {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Step 3: Persons & Checkout */}
        <div className="p-8 bg-gray-50 dark:bg-gray-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="w-full md:w-1/3">
            <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              <Users className="h-4 w-4 mr-2 text-gray-400" /> 4. Number of Persons
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => setPersons(Math.max(1, persons - 1))}
                className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-xl text-xl font-bold dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >-</button>
              <div className="flex-1 h-12 bg-white dark:bg-gray-800 border-y border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold dark:text-white">
                {persons}
              </div>
              <button 
                onClick={() => setPersons(persons + 1)}
                className="w-12 h-12 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-xl text-xl font-bold dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >+</button>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 flex items-center justify-end gap-6">
            <div className="text-right">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Amount</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white">₹{total}</p>
            </div>
            <button
              onClick={() => setIsPaymentOpen(true)}
              className="flex items-center px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 shadow-md transition-all"
            >
              Proceed <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Payment & Receipt Modals */}
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
