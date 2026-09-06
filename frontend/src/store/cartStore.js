import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cart: [],
  isCartOpen: false,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (product) => {
    const currentCart = get().cart;
    const existingIndex = currentCart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingIndex].quantity += 1;
      set({ cart: updatedCart, isCartOpen: true });
    } else {
      set({ cart: [...currentCart, { ...product, quantity: 1 }], isCartOpen: true });
    }
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId, delta) => {
    const currentCart = get().cart;
    const updatedCart = currentCart
      .map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    set({ cart: updatedCart });
  },

  getTotalPrice: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },
}));