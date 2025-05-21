avoid using zod since are slow and consume more memory use typeBox t.Object (fastest)
use depcheck to check un-used libs for memory optimization especially if u want low cost in hosting
implement time for cpu and memory usage to estimate number of users server can hanlde.

use npm install -g autocannon
then run with npx autocannon -c 100 -d 10 http://locahost:3000 
(means 10s test for 100 concurrent connections)

eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2OGFhYWI3Ny1lYmRmLTQwZWMtOGY5Yi02MzkzMjhkYzQ4YjYiLCJzaG9wSWQiOiJmZWY3MDgzNi1kNjU2LTQyY2EtOGMzMi03YTFmOWYzYjg4ZjAifQ.xN9WnfOb0WfVrBqerr8427Q-QJztZevxCTt0EJJLCaI
my auth_token = 

// testing via autocannon

npx autocannon -c 50 -d 10 \
  -H "Cookie: auth_token= eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2OGFhYWI3Ny1lYmRmLTQwZWMtOGY5Yi02MzkzMjhkYzQ4YjYiLCJzaG9wSWQiOiJmZWY3MDgzNi1kNjU2LTQyY2EtOGMzMi03YTFmOWYzYjg4ZjAifQ.xN9WnfOb0WfVrBqerr8427Q-QJztZevxCTt0EJJLCaI" \
  http://localhost:3000/protected-route


// testing with ab
ab -n 100 -c 10 -H "Cookie: auth_token= eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2OGFhYWI3Ny1lYmRmLTQwZWMtOGY5Yi02MzkzMjhkYzQ4YjYiLCJzaG9wSWQiOiJmZWY3MDgzNi1kNjU2LTQyY2EtOGMzMi03YTFmOWYzYjg4ZjAifQ.xN9WnfOb0WfVrBqerr8427Q-QJztZevxCTt0EJJLCaI" http://localhost:3000/categories


// testing route:
curl -H "Cookie: auth_token= eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2OGFhYWI3Ny1lYmRmLTQwZWMtOGY5Yi02MzkzMjhkYzQ4YjYiLCJzaG9wSWQiOiJmZWY3MDgzNi1kNjU2LTQyY2EtOGMzMi03YTFmOWYzYjg4ZjAifQ.xN9WnfOb0WfVrBqerr8427Q-QJztZevxCTt0EJJLCaI" http://localhost:3000/categories


// to reach even blaziest speed and extreme performance on db
- use in-memory for first cache (most reads) but set max cache size based on ram size.(<10ms)
- if missing go to redis (<200ms)
- if missing/ writes go to postgres. (slow but powerful) (up to 1.5s)

## you can do both local and online development 
using conditional rendering like if .env has dev set secure none and domain undefined in cookie
and remove cors, ratelimiting and more.

## use binary in product for maximum speed especially bun. Node also has pkg.

## with neon don't use pg at all and uninstall it 
- it will kill u if u didnt recognize because it uses tcp port 5432 and connect url to it
- so it will always fail when trying to update schema to remote neon database 
- because it assumes it runs with local postgres
- you will not neon db at all even if string is correct
- use bun remove @types/pg and bun remove pg 
- but they are useful for local postgres db
- then use drizzle to use neon http

# version is very important ? sometimes wrong version can kill projects

# i do have one cron job when user visit index.tsx remove it when traffic is high.

# always set cookie as lax if in localhost and have diff port
# protect SPA pages like dashboard with SSR cookie.get and send for auth

# checksum is digital fingerprint to ensure data is not forged, use crypto and HMAC
# to receive payment in clickpesa activate tigo and airtel
# bun without server cant read process.env.something

# when you can't push changes to database with drizzle-orm , then neon is idle it will make errors
try to ping first or warmup (wakeup database) by making req using server then you can push changes easily.

# you can use neon read replica for max speed of reading only from mainDb. (best for scaling)
# Migrate to Dublin (eu-west-1) — it's closer and more stable than Virginia for East Africa.
use new neon AWS af-south-1 (Cape Town, South Africa)	very low latency of about 80ms only (blazing fastest) but new so no enough report for its downtime trend
use AWS eu-central-1	(Frankfurt, Germany	) for medium latency of 120ms but low downtime (BEST)

check if your database is not down from https://neonstatus.com/.


# Qwik famous libs
 visit [https://qwik.dev/ecosystem/#libraries] click here. 

 # vercel is now supports bun!

 # always use Promise.all instead of async await for many promises like fetching different datas in database for max speed

  # most big tech companies use this format
 1. mvp website
  - then make WPA and offline (manifest is responsible here ...)
 2. scaling they add mobile apps
 3. enterprice level, desktop apps and more.

 ## how to turn website to wpa ??
 1. a clear manifest like i have implemented
 2. to make works offline you need a service worker
 3. make it save data details in indexed DB
 4. sync when online
 5. cache static files
 6. app update with service worker

 i was wpa offline for qwik in github! please check out.

 # total hours of neon db to work in dev mode is just 5h use production sever for dev.

 # rough estimation cost is 70,000 Tsh per month for 100 users  and 92,000 for clickpesa 10k of 100 users. so, for 10k in 100 user profit is 800k


# left neon for its latency and hit limit on 5h computation on branch but still good
# for local postgres use pg and not postgres in drizzle orm