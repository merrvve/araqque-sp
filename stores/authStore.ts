import { create } from "zustand";
import { persist } from "zustand/middleware";
// Define the user type
export type UserType = {
  id: string;
  aud: string;
  role?: string | undefined;
  email?: string | undefined;
  email_confirmed_at?: string | undefined;
  phone?: string | undefined;
  confirmed_at?: string | undefined;
  last_sign_in_at?: string | undefined;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: Record<string, unknown>;
  identities?: Array<{
    identity_id?: string | undefined;
    id?: string;
    user_id?: string;
    identity_data?: {
      email?: string;
      email_verified?: boolean;
      phone_verified?: boolean;
      sub?: string;
    };
    provider?: string;
    last_sign_in_at?: string;
    created_at?: string;
    updated_at?: string | undefined;
    email?: string;
  }>;
  created_at: string;
  updated_at?: string | undefined;
  is_anonymous?: boolean | undefined;
};

// Define the Zustand store type
interface AuthStore {
  user: UserType | null; // Authenticated user object or null
  setUser: (user: UserType | null) => void; // Update the user state
  clearUser: () => void; // Clear the user state
}

// Create the Zustand store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null, // Initial state of the user is null
      setUser: (user) => set(() => ({ user })), // Sets the user object
      clearUser: () => set(() => ({ user: null })), // Clears the user
    }),
    {
      name: "auth-store", // The key to store data in localStorage
      partialize: (state) => ({ user: state.user }), // Only persist the user object
    },
  ),
);
