import { create } from "zustand";

// Define the User type directly without Zod
interface User {
  id: string;
  email: string | null;
  name?: string | null;
  role: any; // Role can be a string or null
}

// Define the Zustand store state
interface UserStoreState {
  user: User | null; // User can be null or a valid User object
  isAuthenticated: boolean;
  setUser: (userData: User) => void; // Function to set the user
  signOut: () => void; // Function to sign out
}

// Create the Zustand store
export const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Set user state
  setUser: (userData) => {
    set({ user: userData, isAuthenticated: true });
    
  },

  // Clear user state
  signOut: () => {
    set({ user: null, isAuthenticated: false });
  },
}));


