interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class CacheService<T> {
  private cache: Map<string, CacheEntry<T>> = new Map<string, CacheEntry<T>>();

  async get(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      return entry.value;
    }
    return null;
  }

  async set(key: string, value: T, expirationTimeInMs: number = 1 * 60 * 60 * 1000): Promise<void> {
    const expiresAt = Date.now() + expirationTimeInMs;
    this.cache.set(key, { value, expiresAt });
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

