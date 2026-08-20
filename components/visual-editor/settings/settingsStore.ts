import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SettingsState {
  // IDE Preferences
  autoSave: boolean;
  formatOnSave: boolean;
  theme: "light" | "dark";
  
  // Setters
  setAutoSave: (value: boolean) => void;
  setFormatOnSave: (value: boolean) => void;
  setTheme: (value: "light" | "dark") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      autoSave: true,
      formatOnSave: true,
      theme: "light",
      
      setAutoSave: (value) => set({ autoSave: value }),
      setFormatOnSave: (value) => set({ formatOnSave: value }),
      setTheme: (value) => set({ theme: value }),
    }),
    {
      name: "teachflow-settings-storage", // name of the item in the storage (must be unique)
    }
  )
);
