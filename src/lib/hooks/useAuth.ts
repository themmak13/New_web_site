'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  phoneNumber: string | null;
  setAuth: (userId: string, phoneNumber: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      phoneNumber: null,
      setAuth: (userId, phoneNumber) =>
        set({ isAuthenticated: true, userId, phoneNumber }),
      logout: () =>
        set({ isAuthenticated: false, userId: null, phoneNumber: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
