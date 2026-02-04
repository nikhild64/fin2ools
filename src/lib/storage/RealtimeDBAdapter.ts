import { ref, get, set, remove } from "firebase/database";
import { rtdb } from "../firebase";
import type { StorageAdapter } from "./LocalStorageAdapter";

export class RealtimeDBAdapter implements StorageAdapter {
  private userId: string;
  private basePath: string;

  constructor(userId: string) {
    this.userId = userId;
    this.basePath = `user_data/${userId}`;
  }

  private getUserDataRef(key: string) {
    return ref(rtdb, `${this.basePath}/${key}`);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const dataRef = this.getUserDataRef(key);
      const snapshot = await get(dataRef);

      if (snapshot.exists()) {
        return snapshot.val() as T;
      }

      return null;
    } catch (error) {
      console.error("❌ Error getting data from Realtime DB:", error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const dataRef = this.getUserDataRef(key);
      const cleanedValue = this.cleanValue(value);

      // Add timeout to detect hanging operations
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Realtime DB write timeout after 10s - Database may not exist or rules are blocking",
            ),
          );
        }, 10000);
      });

      await Promise.race([set(dataRef, cleanedValue), timeoutPromise]);
    } catch (error: any) {
      console.error("❌ Error setting data in Realtime DB:", {
        userId: this.userId,
        key,
        error,
        message: error?.message,
        code: error?.code,
      });

      if (error?.message?.includes("timeout")) {
        console.error(
          "🚨 SOLUTION: Enable Realtime Database in Firebase Console → Build → Realtime Database → Create Database",
        );
      }

      throw error;
    }
  }

  // Helper to convert undefined to null for consistency
  private cleanValue<T>(obj: T): any {
    if (obj === undefined) {
      return null;
    }

    if (obj === null) {
      return null;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.cleanValue(item));
    }

    if (typeof obj === "object") {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = this.cleanValue(value);
      }
      return cleaned;
    }

    return obj;
  }

  async remove(key: string): Promise<void> {
    try {
      const dataRef = this.getUserDataRef(key);
      await remove(dataRef);
    } catch (error) {
      console.error("❌ Error removing data from Realtime DB:", error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const userRef = ref(rtdb, this.basePath);
      await remove(userRef);
    } catch (error) {
      console.error("❌ Error clearing Realtime DB data:", error);
      throw error;
    }
  }

  async getAll(): Promise<Record<string, any>> {
    try {
      const userRef = ref(rtdb, this.basePath);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        return data || {};
      }

      return {};
    } catch (error) {
      console.error("❌ Error getting all data from Realtime DB:", error);
      return {};
    }
  }
}
