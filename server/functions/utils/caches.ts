import { MemoryCache } from "./memoryCache";

// Singleton cache instance for suppliers (total 100 MB)
export const userCheckCache = new MemoryCache(15);
export const shopCheckCache = new MemoryCache(15);
export const loginCache = new MemoryCache(40);
