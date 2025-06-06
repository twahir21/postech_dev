# how to test a qwik app
1. using lighthouse for seo 
2. using plusible for tracking visitors
3. Playwright for end-to-end testing (optional) is like you provide code and when run it act as a real user who login and do stuffs.

# in backend 
1. using bun test (you define tests files in test folder then you test and define expectations)
it is very good for large scale testing and ci/cd deploy when all tests pass and is automated
rather than manual clicks of postman reqs

2. using logSnag for real-time error tracking and response time (and super easy tracking app)
logSnap can send which user had logged in and what action they did (if defined in every route)

3. plausible for tracking visitors and location (you can host it to your own server) or charged per api call (plausible is not free and not used locally)

use umami with git clone https://github.com/umami-software/umami.git


# in fullstack
1. k6 for api or endpoint testing with thousand of reqs
2. ab for api or endpoint testing with thousand of reqs
3. cannon
4. upptime to check availability of route if it's down (free)
5. drizzle studio for db testing

### when live
1. do not expose drizzle studio port without authentication either by nginx or Caddy or ssh tunnelling

## how to use lighthouse
1. run npm run preview for bilding and pre-production mode
2. then lighthouse http://localhost:4173 --view


#### my realise fixes
1. on first landing imaged dont add loading lazy use loading eager and add decoding async