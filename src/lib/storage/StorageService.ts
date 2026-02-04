import { LocalStorageAdapter } from "./LocalStorageAdapter";
import type { StorageAdapter } from "./LocalStorageAdapter";
import { RealtimeDBAdapter } from "./RealtimeDBAdapter";
import type { AuthMode } from "../../types/auth";

class StorageService {
  private adapter: StorageAdapter;
  private mode: AuthMode = "local";

  constructor() {
    this.adapter = new LocalStorageAdapter();
  }

  setMode(mode: AuthMode, userId?: string) {
    this.mode = mode;
    if (mode === "firebase" && userId) {
      this.adapter = new RealtimeDBAdapter(userId);
    } else {
      this.adapter = new LocalStorageAdapter();
    }
  }

  getMode(): AuthMode {
    return this.mode;
  }

  get<T>(key: string): T | null | Promise<T | null> {
    return this.adapter.get<T>(key);
  }

  set<T>(key: string, value: T): void | Promise<void> {
    return this.adapter.set<T>(key, value);
  }

  remove(key: string): void | Promise<void> {
    return this.adapter.remove(key);
  }

  clear(): void | Promise<void> {
    return this.adapter.clear();
  }

  getAll(): Record<string, any> | Promise<Record<string, any>> {
    return this.adapter.getAll();
  }

  // Helper method to migrate data from localStorage to Realtime DB
  async migrateToRealtimeDB(userId: string): Promise<void> {
    try {
      // Get all data from localStorage
      const localAdapter = new LocalStorageAdapter();
      const localData = localAdapter.getAll();

      // Switch to Realtime DB mode
      const realtimeAdapter = new RealtimeDBAdapter(userId);

      // Migrate each item
      const migrationPromises = Object.entries(localData).map(([key, value]) =>
        realtimeAdapter.set(key, value),
      );

      await Promise.all(migrationPromises);
    } catch (error) {
      console.error("Error migrating data:", error);
      throw error;
    }
  }

  // Helper method to export data for backup
  async exportData(): Promise<string> {
    const data = await this.getAll();
    return JSON.stringify(data, null, 2);
  }

  // Helper method to import data from backup
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      const importPromises = Object.entries(data).map(([key, value]) =>
        this.set(key, value),
      );
      await Promise.all(importPromises);
    } catch (error) {
      console.error("Error importing data:", error);
      throw error;
    }
  }
}

// Singleton instance
export const storageService = new StorageService();
