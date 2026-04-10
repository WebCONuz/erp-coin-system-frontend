import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
  updateUser: (fields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      setAuth: (user) => set({ user }),

      logout: () => set({ user: null }),

      updateUser: (fields) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...fields } });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }), // faqat user saqlanadi
    },
  ),
);
