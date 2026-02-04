export interface StorageAdapter {
  get<T>(key: string): T | null | Promise<T | null>;
  set<T>(key: string, value: T): void | Promise<void>;
  remove(key: string): void | Promise<void>;
  clear(): void | Promise<void>;
  getAll(): Record<string, any> | Promise<Record<string, any>>;
}

export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    // Clear only app-specific keys, not all localStorage
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("fin2ools_")) {
        localStorage.removeItem(key);
      }
    });
  }

  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("fin2ools_")) {
        const value = this.get(key);
        if (value !== null) {
          result[key] = value;
        }
      }
    });
    return result;
  }
}
