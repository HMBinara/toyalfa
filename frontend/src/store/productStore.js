import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_REVIEWS, PRODUCTS } from '../data/mockData';

export const useProductStore = create(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      reviews: MOCK_REVIEWS,

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
      getReviews: (id) => get().reviews[id] || [],
      addReview: (productId, review) => {
        set((state) => {
          const currentReviews = state.reviews[productId] || [];
          const reviews = [...currentReviews, { ...review, id: `r_${Date.now()}` }];
          const rating = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
          return {
            reviews: { ...state.reviews, [productId]: reviews },
            products: state.products.map((product) => product.id === productId
              ? { ...product, rating: Number(rating.toFixed(1)), reviewsCount: reviews.length }
              : product),
          };
        });
      },
    }),
    { name: 'toyalfa-products' }
  )
);
