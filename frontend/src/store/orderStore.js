import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_ORDERS } from '../data/mockData';

export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,
      activeOrder: null, // the most recently placed order (for success screen)

      placeOrder: ({ items, total, address, paymentMethod, name, email, phone, promoCode }) => {
        const orderId = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
        const now = new Date().toISOString().split('T')[0];
        const newOrder = {
          id: orderId,
          date: now,
          status: 'Processing',
          total,
          items,
          address,
          paymentMethod,
          name,
          email,
          phone,
          promoCode: promoCode || null,
          trackingSteps: [
            { label: 'Order Placed',  date: now, done: true  },
            { label: 'Processing',    date: null, done: false },
            { label: 'Shipped',       date: null, done: false },
            { label: 'Delivered',     date: null, done: false },
          ],
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrder: newOrder,
        }));
        return newOrder;
      },

      getOrderById: (id) => get().orders.find((o) => o.id === id),

      // Admin: update order status
      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            const steps = o.trackingSteps.map((s, i) => {
              const statusMap = { Processing: 1, Shipped: 2, Delivered: 3 };
              return { ...s, done: i <= statusMap[status] };
            });
            return { ...o, status, trackingSteps: steps };
          }),
        }));
      },

      clearActiveOrder: () => set({ activeOrder: null }),
    }),
    {
      name: 'toyalfa-orders',
    }
  )
);
