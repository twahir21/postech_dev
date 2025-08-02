import { createClient } from "redis";

export const redisClient = createClient({ 
  url: 'redis://localhost:6379',
});

// Connect to Redis
redisClient.connect().catch(console.error);
