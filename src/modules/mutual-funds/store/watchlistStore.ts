import { create } from "zustand";
import { storageService } from "../../../lib/storage";

interface WatchlistStore {
  watchlist: number[];
  hasWatchlist: boolean;
  loading: boolean;
  loadWatchlist: () => Promise<void>;
  addToWatchlist: (schemeCode: number) => Promise<void>;
  removeFromWatchlist: (schemeCode: number) => Promise<void>;
  isInWatchlist: (schemeCode: number) => boolean;
  getWatchlist: () => number[];
}

const WATCHLIST_KEY = "fin2ools_mf_watchlist";

export const useWatchlistStore = create<WatchlistStore>((set, get) => ({
  watchlist: [],
  hasWatchlist: false,
  loading: false,

  loadWatchlist: async () => {
    try {
      set({ loading: true });
      const watchlist =
        (await storageService.get<number[]>(WATCHLIST_KEY)) || [];
      set({
        watchlist,
        hasWatchlist: watchlist.length > 0,
        loading: false,
      });
    } catch (error) {
      console.error("Error loading watchlist:", error);
      set({ watchlist: [], hasWatchlist: false, loading: false });
    }
  },

  addToWatchlist: async (schemeCode: number) => {
    const { watchlist } = get();
    if (!watchlist.includes(schemeCode)) {
      const newWatchlist = [...watchlist, schemeCode];
      await storageService.set(WATCHLIST_KEY, newWatchlist);
      set({
        watchlist: newWatchlist,
        hasWatchlist: true,
      });
    }
  },

  removeFromWatchlist: async (schemeCode: number) => {
    const { watchlist } = get();
    const newWatchlist = watchlist.filter((code) => code !== schemeCode);
    await storageService.set(WATCHLIST_KEY, newWatchlist);
    set({
      watchlist: newWatchlist,
      hasWatchlist: newWatchlist.length > 0,
    });
  },

  isInWatchlist: (schemeCode: number) => {
    return get().watchlist.includes(schemeCode);
  },

  getWatchlist: () => {
    return get().watchlist;
  },
}));
