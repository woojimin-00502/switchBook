import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  nickname: string;
  isPro?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  cartCount: number;
  login: (user: AuthUser) => void;
  logout: () => void;
  setCartCount: (count: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      cartCount: 0,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      setCartCount: (count) => set({ cartCount: count }),
    }),
    { name: 'switchbook-auth' },
  ),
);
