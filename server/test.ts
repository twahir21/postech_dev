const redis = Bun.redis;

// Benchmark SET operation
console.time("redis-set");
await redis.set("greeting", "Hello from Bun!");
console.timeEnd("redis-set"); // Logs time taken for SET

// Benchmark GET operation
console.time("redis-get");
const greeting = await redis.get("greeting");
console.timeEnd("redis-get"); // Logs time taken for GET

console.log(greeting); // "Hello from Bun!"