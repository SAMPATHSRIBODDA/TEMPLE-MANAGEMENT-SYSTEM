import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface CartItem {
  ticket: TicketType;
  quantity: number;
}

export interface Receipt {
  id: string;
  timestamp: string;
  items: CartItem[];
  total: number;
  cashReceived: number;
  change: number;
}

interface TicketState {
  cart: CartItem[];
  receiptHistory: Receipt[];
  addItem: (ticket: TicketType) => void;
  updateQuantity: (ticketId: string, delta: number) => void;
  clearCart: () => void;
  saveReceipt: (receipt: Receipt) => void;
  getCartTotal: () => number;
}

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      cart: [],
      receiptHistory: [],

      addItem: (ticket) => {
        const { cart } = get();
        const existing = cart.find(item => item.ticket.id === ticket.id);
        if (existing) {
          set({
            cart: cart.map(item => 
              item.ticket.id === ticket.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          });
        } else {
          set({ cart: [...cart, { ticket, quantity: 1 }] });
        }
      },

      updateQuantity: (ticketId, delta) => {
        const { cart } = get();
        set({
          cart: cart.map(item => {
            if (item.ticket.id === ticketId) {
              const newQuantity = Math.max(0, item.quantity + delta);
              return { ...item, quantity: newQuantity };
            }
            return item;
          }).filter(item => item.quantity > 0)
        });
      },

      clearCart: () => set({ cart: [] }),

      saveReceipt: (receipt) => {
        set((state) => ({
          receiptHistory: [receipt, ...state.receiptHistory]
        }));
      },

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.ticket.price * item.quantity), 0);
      }
    }),
    {
      name: 'ticket-storage',
    }
  )
);
