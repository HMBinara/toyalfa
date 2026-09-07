import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock credential database
const MOCK_CREDENTIALS = {
  'customer@toyalfa.com': {
    password: 'demo123',
    user: {
      id: 'u_cust_1',
      name: 'Alex Johnson',
      email: 'customer@toyalfa.com',
      role: 'customer',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alex',
      phone: '+94 77 123 4567',
      address: '42 Maple Street, Colombo 07, Sri Lanka',
    },
  },
  'admin@toyalfa.com': {
    password: 'demo123',
    user: {
      id: 'u_admin_1',
      name: 'Admin User',
      email: 'admin@toyalfa.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Admin',
      phone: '+94 77 999 0000',
      address: 'ToyAlfa HQ, Colombo 03, Sri Lanka',
    },
  },
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      // Simulate async login
      login: (email, password) => {
        const entry = MOCK_CREDENTIALS[email.toLowerCase()];
        if (!entry) return { success: false, error: 'No account found with this email.' };
        if (entry.password !== password) return { success: false, error: 'Incorrect password.' };

        const token = `mock_jwt_${Date.now()}`;
        set({ isLoggedIn: true, user: entry.user, token });
        return { success: true, user: entry.user };
      },

      // Simulate registration — always succeeds and creates a customer
      register: (name, email, password) => {
        if (typeof password !== 'string' || password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters.' };
        }
        const newUser = {
          id: `u_${Date.now()}`,
          name,
          email,
          role: 'customer',
          avatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${name}`,
          phone: '',
          address: '',
        };
        const token = `mock_jwt_${Date.now()}`;
        set({ isLoggedIn: true, user: newUser, token });
        return { success: true, user: newUser };
      },

      logout: () => {
        set({ isLoggedIn: false, user: null, token: null });
      },

      updateProfile: (updates) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updates } });
      },
    }),
    {
      name: 'toyalfa-auth',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
