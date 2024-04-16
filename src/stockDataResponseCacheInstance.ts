import { CacheService } from "./services/cache";

const cacheSize = process.env.CACHE_SIZE ? parseInt(process.env.CACHE_SIZE) : 1000;
const cacheExpirationInMinutes = process.env.CACHE_EXPIRATION_IN_MINUTES ? parseInt(process.env.CACHE_EXPIRATION_IN_MINUTES) : 10;

export const cacheInstance = new CacheService<string>(cacheSize, cacheExpirationInMinutes);
