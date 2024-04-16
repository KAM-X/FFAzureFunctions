interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  lastAccessed: number;
}

export class CacheService<T> {
  private _cache: Map<string, CacheEntry<T>> = new Map<string, CacheEntry<T>>();
  private _maxEntries: number;
  private _defaultExpirationInMs: number;

  constructor(maxEntries: number = 100, defaultExpirationInMinutes: number = 10) { 
    this._maxEntries = maxEntries;
    this._defaultExpirationInMs = this.minutesToMilliseconds(defaultExpirationInMinutes);
  }

  async get(key: string): Promise<T | null> {
    const entry = this._cache.get(key);
    if (entry && entry.expiresAt > Date.now()) {
      entry.lastAccessed = Date.now();

      return entry.value;
    }
    
    this._cache.delete(key);

    return null;
  }

  async set(key: string, value: T, expirationTimeInMs: number = this._defaultExpirationInMs): Promise<void> {
    if (this._cache.size >= this._maxEntries) {
      this.evictExpiredEntries();
    }
    if (this._cache.size >= this._maxEntries) {
      this.evictLRUEntry();
    }
    const expiresAt = Date.now() + expirationTimeInMs;
    this._cache.set(key, { value, expiresAt, lastAccessed: Date.now() });
  }

  async clear(): Promise<void> {
    this._cache.clear();
  }

  private evictExpiredEntries(): void {
    const now = Date.now();
    for (let [key, entry] of this._cache) {
      if (entry.expiresAt <= now) {
        this._cache.delete(key);
      }
    }
  }


  private evictLRUEntry(): void {
    const leastRecentlyUsed = Array.from(this._cache.entries()).reduce((lru, entry) => {
      if (!lru || entry[1].lastAccessed < lru[1].lastAccessed) {
        return entry;
      }

      return lru;
    }, null as [string, CacheEntry<T>] | null);

    if (leastRecentlyUsed) {
      this._cache.delete(leastRecentlyUsed[0]);
    }
  }

  minutesToMilliseconds(minutes: number): number {
    return minutes * 60 * 1000;
  }
}

