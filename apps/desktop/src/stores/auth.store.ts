import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  setAuthenticated: (userId: string) => void;
  setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('access_token'),
  userId: localStorage.getItem('user_id'),

  setAuthenticated: (userId) => {
    localStorage.setItem('user_id', userId);
    set({ isAuthenticated: true, userId });
  },

  setUnauthenticated: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    set({ isAuthenticated: false, userId: null });
  },
}));
