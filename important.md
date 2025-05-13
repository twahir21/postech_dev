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