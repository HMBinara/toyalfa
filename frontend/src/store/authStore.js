import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_URL = 'http://localhost:8080/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,

      // Real API Login
      login: async (email, password) => {
        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            return { success: false, error: data.detail || 'Login failed' };
          }

          const token = data.access_token;

          // Fetch logged-in user profile details
          const profileRes = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          let userData = { email, name: email.split('@')[0], role: 'customer' };
          if (profileRes.ok) {
            userData = await profileRes.json();
          }

          set({ isLoggedIn: true, user: userData, token });
          return { success: true, user: userData };
        } catch (err) {
          return { success: false, error: 'Could not connect to backend server.' };
        }
      },

      // Real API Register
      register: async (name, email, password) => {
        try {
          const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await res.json();

          if (!res.ok) {
            return { success: false, error: data.detail || 'Registration failed' };
          }

          // Registration සාර්ථක වුණාම Auto Login වෙනවා
          return await get().login(email, password);
        } catch (err) {
          return { success: false, error: 'Could not connect to backend server.' };
        }
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