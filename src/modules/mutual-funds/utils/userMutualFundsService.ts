import type { UserInvestmentData } from "../types/mutual-funds";
import { storageService } from "../../../lib/storage";

const STORAGE_KEY = "fin2ools_my_funds";

export const localStorageService = {
  // Get all user investments
  async getUserInvestments(): Promise<UserInvestmentData[]> {
    try {
      const data = await storageService.get<UserInvestmentData[]>(STORAGE_KEY);
      return data || [];
    } catch (error) {
      console.error("Error reading investments:", error);
      return [];
    }
  },

  // Get investments for a specific scheme
  async getSchemeInvestments(
    schemeCode: number,
  ): Promise<UserInvestmentData | null> {
    const investments = await this.getUserInvestments();
    return investments.find((item) => item.schemeCode === schemeCode) || null;
  },

  // Add investment to a scheme
  async addInvestment(schemeCode: number, investment: any): Promise<void> {
    const investments = await this.getUserInvestments();
    const existingScheme = investments.find(
      (item) => item.schemeCode === schemeCode,
    );

    if (existingScheme) {
      existingScheme.investments.push(investment);
    } else {
      investments.push({
        schemeCode,
        investments: [investment],
      });
    }

    await storageService.set(STORAGE_KEY, investments);
  },

  // Remove specific investment
  async removeInvestment(
    schemeCode: number,
    investmentIndex: number,
  ): Promise<void> {
    const investments = await this.getUserInvestments();
    const schemeIndex = investments.findIndex(
      (item) => item.schemeCode === schemeCode,
    );

    if (schemeIndex !== -1) {
      investments[schemeIndex].investments.splice(investmentIndex, 1);
      if (investments[schemeIndex].investments.length === 0) {
        investments.splice(schemeIndex, 1);
      }
      await storageService.set(STORAGE_KEY, investments);
    }
  },

  // Check if user has any investments
  async hasInvestments(): Promise<boolean> {
    const investments = await this.getUserInvestments();
    return investments.length > 0;
  },

  // Clear all investments
  async clearAll(): Promise<void> {
    await storageService.remove(STORAGE_KEY);
  },
};
