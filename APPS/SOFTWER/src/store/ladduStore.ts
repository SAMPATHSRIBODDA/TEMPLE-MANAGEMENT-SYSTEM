import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LadduType {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface LadduStock {
  ladduId: string;
  totalStock: number;
  remainingStock: number;
}

export interface LadduCartItem {
  laddu: LadduType;
  quantity: number;
}

export interface LadduOrder {
  id: string;
  timestamp: string;
  items: LadduCartItem[];
  total: number;
  cashReceived: number;
  change: number;
  status: 'PENDING_COLLECTION' | 'COLLECTED';
}

interface LadduState {
  cart: LadduCartItem[];
  orderHistory: LadduOrder[];
  stocks: LadduStock[];
  
  addItem: (laddu: LadduType) => void;
  updateQuantity: (ladduId: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  processOrder: (order: Omit<LadduOrder, 'status'>) => void;
  markCollected: (orderId: string) => void;
}

// Initial Mock Stock
const initialStocks: LadduStock[] = [
  { ladduId: 'l1', totalStock: 500, remainingStock: 485 },
  { ladduId: 'l2', totalStock: 1000, remainingStock: 642 },
  { ladduId: 'l3', totalStock: 200, remainingStock: 45 },
];

export const useLadduStore = create<LadduState>()(
  persist(
    (set, get) => ({
      cart: [],
      orderHistory: [],
      stocks: initialStocks,

      addItem: (laddu) => {
        const { cart, stocks } = get();
        const stockInfo = stocks.find(s => s.ladduId === laddu.id);
        const existing = cart.find(item => item.laddu.id === laddu.id);
        
        const currentQty = existing ? existing.quantity : 0;
        
        // Check if adding 1 exceeds stock
        if (stockInfo && currentQty + 1 > stockInfo.remainingStock) {
          alert(`Cannot exceed remaining stock (${stockInfo.remainingStock}) for ${laddu.name}`);
          return;
        }

        if (existing) {
          set({
            cart: cart.map(item => 
              item.laddu.id === laddu.id 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            )
          });
        } else {
          set({ cart: [...cart, { laddu, quantity: 1 }] });
        }
      },

      updateQuantity: (ladduId, delta) => {
        const { cart, stocks } = get();
        const stockInfo = stocks.find(s => s.ladduId === ladduId);
        
        set({
          cart: cart.map(item => {
            if (item.laddu.id === ladduId) {
              const newQuantity = Math.max(0, item.quantity + delta);
              
              if (stockInfo && newQuantity > stockInfo.remainingStock) {
                alert(`Cannot exceed remaining stock (${stockInfo.remainingStock})`);
                return item;
              }
              
              return { ...item, quantity: newQuantity };
            }
            return item;
          }).filter(item => item.quantity > 0)
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.laddu.price * item.quantity), 0);
      },

      processOrder: (orderData) => {
        const newOrder: LadduOrder = { ...orderData, status: 'PENDING_COLLECTION' };
        
        set((state) => {
          // Deduct from stock
          const newStocks = state.stocks.map(stock => {
            const cartItem = orderData.items.find(i => i.laddu.id === stock.ladduId);
            if (cartItem) {
              return { ...stock, remainingStock: stock.remainingStock - cartItem.quantity };
            }
            return stock;
          });

          return {
            orderHistory: [newOrder, ...state.orderHistory],
            stocks: newStocks,
            cart: [] // Clear cart automatically
          };
        });
      },

      markCollected: (orderId) => {
        set((state) => ({
          orderHistory: state.orderHistory.map(order => 
            order.id === orderId ? { ...order, status: 'COLLECTED' } : order
          )
        }));
      }
    }),
    {
      name: 'laddu-storage',
    }
  )
);
