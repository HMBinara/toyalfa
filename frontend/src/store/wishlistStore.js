import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const exists = get().items.find((i) => i.id === product.id);
        if (exists) {
          set((state) => ({ items: state.items.filter((i) => i.id !== product.id) }));
          return false; // removed
        } else {
          set((state) => ({ items: [...state.items, product] }));
          return true; // added
        }
      },

      isWishlisted: (id) => {
        return get().items.some((i) => i.id === id);
      },

      removeFromWishlist: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'toyalfa-wishlist',
    }
  )
);
