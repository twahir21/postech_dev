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

make sure results are [1.93ms] redis-set
[0.11ms] redis-get
Hello from Bun! meaning we are fine now!!

use pipeling for max speed in multi tasks.
do not use TCP redis new Redis() is slow.
result show my implemented logic beats redis. + have analytics on memory usage