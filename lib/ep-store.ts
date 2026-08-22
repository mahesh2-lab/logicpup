import { create } from "zustand";
import { getArcadeState, addEP as addEPServer, unlockGame as unlockGameServer } from "@/app/actions/arcade";
import { useProjectsStore } from "@/components/visual-editor/projects/projectStore";

interface EPState {
  ep: number;
  unlockedGames: Record<string, boolean>;
  isLoading: boolean;
  loadState: () => Promise<void>;
  addEP: (amount: number) => Promise<void>;
  unlockGame: (gameId: string, cost: number) => Promise<boolean>;
}

export const useEPStore = create<EPState>((set, get) => ({
  ep: 0,
  unlockedGames: { racing: true },
  isLoading: true,
  
  loadState: async () => {
    try {
      const state = await getArcadeState();
      set({ ep: state.ep, unlockedGames: state.unlockedGames, isLoading: false });
    } catch (e) {
      console.error("Failed to load arcade state:", e);
      set({ isLoading: false });
    }
  },
  
  addEP: async (amount) => {
    try {
      // Optimistic update
      set((state) => ({ ep: state.ep + amount }));
      const newEp = await addEPServer(amount);
      set({ ep: newEp });
    } catch (e) {
      console.error("Failed to add EP:", e);
      // Rollback could be added here
    }
  },
  
  unlockGame: async (gameId, cost) => {
    const state = get();
    if (state.unlockedGames[gameId]) return true;
    
    const challengeXP = useProjectsStore.getState().getTotalEarnedPoints();
    if (state.ep + challengeXP < cost) return false;
    
    try {
      const result = await unlockGameServer(gameId, cost);
      if (result.success) {
        set({ ep: result.ep, unlockedGames: result.unlockedGames! });
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to unlock game:", e);
      return false;
    }
  },
}));
