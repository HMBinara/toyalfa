import { create } from 'zustand';
import { PRODUCTS } from '../data/mockData';

export const useProductStore = create((set, get) => ({
  products: PRODUCTS,

  addProduct: (product) => {
    const newProduct = {
      ...product,
      id: `p_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      reviewsCount: 0,
      isFeatured: false,
      images: product.image ? [product.image] : [],
    };
    set((state) => ({ products: [newProduct, ...state.products] }));
    return newProduct;
  },

  editProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates, images: updates.image ? [updates.image, ...(p.images || []).slice(1)] : p.images } : p
      ),
    }));
  },

  deleteProduct: (id) => {
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
  },

  toggleStock: (id) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, stock: p.stock > 0 ? 0 : 10 } : p
      ),
    }));
  },

  getProductById: (id) => get().products.find((p) => p.id === id),
}));
