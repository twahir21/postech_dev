// routes/profits.ts
import { Cookie, Elysia } from 'elysia';
import jwt from '@elysiajs/jwt';
import { salesQueryData } from '../functions/security/validators/data';
import { exportSales, getAnalytics, graphFunc, salesAnalytics } from '../functions/analyticsFunc';
import { extractId } from '../functions/security/jwtToken';
import { checkServiceAccess } from '../functions/utils/packages';


const JWT_SECRET = process.env.JWT_TOKEN || "something@#morecomplicated<>es>??><Ess5%";
const analyticsRoute = new Elysia()
  .use(jwt({
      name: 'jwt',
      secret: JWT_SECRET,
  }))

  .get('/analytics', async ({ jwt, cookie }) => {
    const t0 = Date.now()

    const { userId, shopId } = await extractId({ jwt, cookie });
    if (!shopId || !userId) return;

    const result = await getAnalytics({ userId, shopId })

    console.log(`analytics get takes ${Date.now() - t0} ms`)
    return result;
  })


  .get('/sales', async ({ jwt, cookie, query }) => {
    const { userId, shopId } = await extractId({ jwt, cookie });
    if (!shopId || !userId) return;


    return await salesAnalytics({
      userId,
      shopId,
      query
    })
  }, {
    query: salesQueryData
  })

  .get('/export-sales', async ({ jwt, cookie, set }) => {
    const { shopId, userId } = await extractId({ jwt, cookie });
    if (!shopId || !userId) return;

    // check if user is allowed to export
    const serviceResult = await checkServiceAccess({ shopId, service: "exportCSV" });

    if (!serviceResult.success) {
      return {
        success: false,
        message: serviceResult.message
      }
    }

    return await exportSales({
      shopId,
      userId,
      set
    })
  })

  .get("/graph", async ({ jwt, cookie }) => {
    const { userId, shopId } = await extractId({ jwt, cookie });
    if (!shopId || !userId) return;


    return await graphFunc({
      userId, shopId
    })
  })
  

export default analyticsRoute;
