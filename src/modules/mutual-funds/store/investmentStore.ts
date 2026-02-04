import { create } from "zustand";
import type { UserInvestmentData } from "../types/mutual-funds";
import { localStorageService } from "../utils/userMutualFundsService";

interface InvestmentStore {
  investments: UserInvestmentData[];
  hasInvestments: boolean;
  loading: boolean;
  loadInvestments: () => Promise<void>;
  getAllInvestments: () => UserInvestmentData[];
  addInvestment: (schemeCode: number, investment: any) => Promise<void>;
  removeInvestment: (
    schemeCode: number,
    investmentIndex: number,
  ) => Promise<void>;
  getSchemeInvestments: (schemeCode: number) => UserInvestmentData;
}

export const useInvestmentStore = create<InvestmentStore>((set, get) => ({
  investments: [],
  hasInvestments: false,
  loading: false,

  loadInvestments: async () => {
    set({ loading: true });
    const investments = await localStorageService.getUserInvestments();
    set({
      investments,
      hasInvestments: investments.length > 0,
      loading: false,
    });
  },

  getAllInvestments: () => {
    return get().investments;
  },

  addInvestment: async (schemeCode: number, investment: any) => {
    await localStorageService.addInvestment(schemeCode, investment);
    await get().loadInvestments();
  },

  removeInvestment: async (schemeCode: number, investmentIndex: number) => {
    await localStorageService.removeInvestment(schemeCode, investmentIndex);
    await get().loadInvestments();
  },

  getSchemeInvestments: (schemeCode: number): UserInvestmentData => {
    const investments = get().investments;
    return (
      investments.find((item) => item.schemeCode === schemeCode) || {
        schemeCode,
        investments: [],
      }
    );
  },
}));
