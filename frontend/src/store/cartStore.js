import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROMO_CODES } from '../data/mockData';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      appliedPromo: null, // { code, discount, type, label }

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (product) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex((item) => item.id === product.id);

        if (existingIndex > -1) {
          const updatedCart = [...currentCart];
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: updatedCart[existingIndex].quantity + 1,
          };
          set({ cart: updatedCart, isCartOpen: true });
        } else {
          set({ cart: [...currentCart, { ...product, quantity: 1 }], isCartOpen: true });
        }
      },

      addItem: (product) => get().addToCart(product),

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

      removeItem: (productId) => get().removeFromCart(productId),

      updateQuantity: (productId, delta) => {
        const updatedCart = get()
          .cart.map((item) => {
            if (item.id === productId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean);
        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [], appliedPromo: null }),

      applyPromoCode: (code) => {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (!promo) return { success: false, error: 'Invalid promo code.' };
        set({ appliedPromo: { code: code.toUpperCase(), ...promo } });
        return { success: true, label: promo.label };
      },

      removePromoCode: () => set({ appliedPromo: null }),

      getSubtotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getTotalPrice: () => {
        const subtotal = get().getSubtotal();
        const promo = get().appliedPromo;
        if (!promo) return subtotal;
        if (promo.type === 'percent') return subtotal * (1 - promo.discount / 100);
        if (promo.type === 'flat') return Math.max(0, subtotal - promo.discount);
        return subtotal;
      },

      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'toyalfa-cart',
      partialize: (state) => ({ cart: state.cart, appliedPromo: state.appliedPromo }),
    }
  )
);