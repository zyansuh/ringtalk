import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  isLoading: boolean;
  setAuthenticated: (userId: string) => void;
  setUnauthenticated: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  isLoading: true,

  setAuthenticated: (userId) => set({ isAuthenticated: true, userId, isLoading: false }),

  setUnauthenticated: () => set({ isAuthenticated: false, userId: null, isLoading: false }),

  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      const userId = await SecureStore.getItemAsync('user_id');
      if (token && userId) {
        set({ isAuthenticated: true, userId, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));
