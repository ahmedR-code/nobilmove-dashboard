import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  admin: Admin | null;
  setAuth: (token: string, admin: Admin) => void;
  updateAdmin: (admin: Admin) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,

      setAuth: (token, admin) => {
        set({ token, admin });
      },

      updateAdmin: (admin) => {
        set({ admin });
      },

      logout: () => {
        set({ token: null, admin: null });
      },

      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: 'nobilmove-auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
