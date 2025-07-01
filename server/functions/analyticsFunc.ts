import { eq, and, sql, lte, asc, desc, ilike, gte, or } from 'drizzle-orm';
import { mainDb } from '../database/schema/connections/mainDb';
import { askedProducts, customers, debts, products, purchases, sales } from '../database/schema/shop';
import { formatDistanceToNow } from "date-fns";
import type { exportSet, SalesQuery } from '../types/types';
import { prodCheck } from './utils/packages';
import { timeRemainingUntil } from './utils/block';



export const getAnalytics = async ({ userId, shopId }: { userId: string, shopId: string }) => {
    try {
      console.time("Analytics");
        // --- Combined Analytics Query (Profit Per Product, Total Sales, Total Cost) ---
        // This query now fetches profit per product, and also provides the totals needed
        // for netProfit calculations, reducing multiple calls.
        const [
            profitData,
            lowestStockProductResult,
            lowStockProductsResult,
            mostSoldByQuantityProductResult,
            debtorData,
            weeklySummaryData
        ] = await Promise.all([
        mainDb.execute(sql`
            SELECT
                p.id AS productId,
                p.name AS productName,
                COALESCE(s.totalSales, 0) AS totalSales,
                COALESCE(pur.totalCost, 0) AS totalCost,
                COALESCE(s.totalSales, 0) - COALESCE(pur.totalCost, 0) AS profit
            FROM products p
            LEFT JOIN (
                SELECT product_id, SUM(quantity * price_sold) AS totalSales
                FROM sales
                WHERE shop_id = ${shopId}
                GROUP BY product_id
            ) s ON s.product_id = p.id
            LEFT JOIN (
                SELECT product_id, SUM(quantity * price_bought) AS totalCost
                FROM purchases
                WHERE shop_id = ${shopId}
                GROUP BY product_id
            ) pur ON pur.product_id = p.id
            WHERE p.shop_id = ${shopId}
            ORDER BY profit DESC
        `),

            // --- Lowest Stock Product ---
            mainDb
                .select()
                .from(products)
                .where(and(
                    eq(products.shopId, shopId),
                    lte(products.stock, products.minStock)
                ))
                .orderBy(asc(products.stock))
                .limit(1),

            // --- Low Stock Products (all) ---
            mainDb
                .select()
                .from(products)
                .where(and(
                    eq(products.shopId, shopId),
                    lte(products.stock, products.minStock)
                ))
                .orderBy(asc(products.stock)),

            // --- Most Sold By Quantity Product ---
            mainDb.execute(sql`
                SELECT
                    p.id AS productId,
                    p.name AS productName,
                    p.unit AS unit,
                    SUM(s.quantity) AS totalQuantitySold,
                    COUNT(*) AS timesSold
                FROM sales s
                INNER JOIN products p ON s.product_id = p.id
                WHERE s.shop_id = ${shopId}
                GROUP BY p.id, p.name, p.unit
                ORDER BY totalQuantitySold DESC
                LIMIT 1
            `),


            // --- Combined Debtors Query (Longest Unpaid and Highest Debt) ---
            // This query fetches both the oldest and highest debt in one go by leveraging window functions or by fetching top N and sorting in application if N is small.
            // For simplicity and typical use cases, two separate queries are often fine if they are distinct and efficient.
            // But we can combine them to get both top oldest and top highest remaining debt from the same query if needed.
            // For now, keeping them separate as `Promise.all` already handles concurrency.
            // Here, we fetch both simultaneously:
            Promise.all([
                mainDb
                    .select({
                        debtId: debts.id,
                        customerId: debts.customerId,
                        remainingAmount: debts.remainingAmount,
                        createdAt: debts.createdAt,
                        name: customers.name,
                    })
                    .from(debts)
                    .where(eq(debts.shopId, shopId))
                    .innerJoin(customers, eq(customers.id, debts.customerId))
                    .orderBy(asc(debts.createdAt))
                    .limit(1),
                mainDb
                    .select({
                        debtId: debts.id,
                        customerId: debts.customerId,
                        remainingAmount: debts.remainingAmount,
                        createdAt: debts.createdAt,
                        name: customers.name,
                    })
                    .from(debts)
                    .where(eq(debts.shopId, shopId))
                    .innerJoin(customers, eq(customers.id, debts.customerId))
                    .orderBy(desc(debts.remainingAmount))
                    .limit(1)
            ]),

            // --- Weekly Sales, Expenses, and Purchases in a single query (more complex but efficient) ---
            // This is the most significant optimization: fetching all three types of data in one go.
            // Requires a more complex SQL query using Common Table Expressions (CTEs) or subqueries.
            mainDb.execute(sql`
                WITH sales_data AS (
                    SELECT
                        TO_CHAR(created_at, 'Dy') AS day,
                        SUM(total_sales) AS daily_sales
                    FROM sales
                    WHERE shop_id = ${shopId} AND created_at >= NOW() - INTERVAL '7 days'
                    GROUP BY 1
                ),
                expenses_data AS (
                    SELECT
                        TO_CHAR(date, 'Dy') AS day,
                        SUM(amount) AS daily_expenses
                    FROM expenses
                    WHERE shop_id = ${shopId} AND date >= NOW() - INTERVAL '7 days'
                    GROUP BY 1
                ),
                purchases_data AS (
                    SELECT
                        TO_CHAR(created_at, 'Dy') AS day,
                        SUM(quantity * price_bought) AS daily_purchases
                    FROM purchases
                    WHERE shop_id = ${shopId} AND created_at >= NOW() - INTERVAL '7 days'
                    GROUP BY 1
                )
                SELECT
                    COALESCE(sd.day, ed.day, pd.day) AS day,
                    COALESCE(sd.daily_sales, 0) AS sales,
                    COALESCE(ed.daily_expenses, 0) AS expenses,
                    COALESCE(pd.daily_purchases, 0) AS purchases
                FROM sales_data sd
                FULL OUTER JOIN expenses_data ed ON sd.day = ed.day
                FULL OUTER JOIN purchases_data pd ON COALESCE(sd.day, ed.day) = pd.day
                ORDER BY
                    CASE COALESCE(sd.day, ed.day, pd.day)
                        WHEN 'Mon' THEN 1
                        WHEN 'Tue' THEN 2
                        WHEN 'Wed' THEN 3
                        WHEN 'Thu' THEN 4
                        WHEN 'Fri' THEN 5
                        WHEN 'Sat' THEN 6
                        WHEN 'Sun' THEN 7
                    END
            `)
        ]);

        // Destructure combined results
        const profitPerProduct = profitData || [];
        const highestProfitProduct = profitPerProduct[0] || null;

        const totalProfitFromProducts = profitPerProduct.reduce((sum, item) => {
            return sum + Number(item.profit || 0);
        }, 0);

        const totalSalesFromProducts = profitPerProduct.reduce((sum, item) => {
            return sum + Number(item.totalsales || 0);
        }, 0);

        const totalPurchasesFromProducts = profitPerProduct.reduce((sum, item) => {
            return sum + Number(item.totalcost || 0);
        }, 0);


        // --- Total Expenses (can be fetched separately or combined if daily summaries are not needed) ---
        // For simplicity and distinctness, keeping this separate if it's a single aggregate.
        const expenseResult = await mainDb.execute(sql`
            SELECT COALESCE(SUM(e.amount), 0) AS totalExpenses
            FROM expenses e
            WHERE e.shop_id = ${shopId}
        `);
        const totalExpenses = Number(expenseResult?.[0]?.totalexpenses || 0);

        const netProfit = {
            totalExpenses,
            totalSales: totalSalesFromProducts,
            totalPurchases: totalPurchasesFromProducts,
            netProfit: totalProfitFromProducts - totalExpenses
        };

        const lowestProduct = lowestStockProductResult[0] || null;
        const lowStockProducts = lowStockProductsResult || [];
        const mostSoldProductByQuantity = mostSoldByQuantityProductResult?.[0]
            ? {
                ...mostSoldByQuantityProductResult[0],
                timesSold: Number(mostSoldByQuantityProductResult[0].timessold || 0),
                unit: mostSoldByQuantityProductResult[0].unit || "kipimo"
            }
            : null;

        const [longTermDebtUserArray, mostDebtUserArray] = debtorData;
        const longTermDebtUser = longTermDebtUserArray[0] || null;
        const mostDebtUser = mostDebtUserArray[0] || null;

        let daysSinceDebt = "Haijulikani";
        if (longTermDebtUser?.createdAt) {
            const rawDate = new Date(longTermDebtUser.createdAt);
            rawDate.setHours(rawDate.getHours() - 3); // For East Africa
            daysSinceDebt = formatDistanceToNow(rawDate, { addSuffix: true });
        }

        // Process weekly summary data
        const salesByDay = [];
        const expensesByDay = [];
        const purchasesPerDay = [];
        const netSalesByDay = [];

        const weekDaysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dailyDataMap = new Map<string, { sales: number, expenses: number, purchases: number }>();

        // Initialize map with all days to ensure consistent order and zero values
        weekDaysOrder.forEach(day => dailyDataMap.set(day, { sales: 0, expenses: 0, purchases: 0 }));

        for (const row of weeklySummaryData) {
            const day = row.day as string;
            if (dailyDataMap.has(day)) {
                dailyDataMap.get(day)!.sales = Number(row.sales || 0);
                dailyDataMap.get(day)!.expenses = Number(row.expenses || 0);
                dailyDataMap.get(day)!.purchases = Number(row.purchases || 0);
            }
        }

        for (const [day, data] of dailyDataMap.entries()) {
            salesByDay.push({ day, sales: data.sales });
            expensesByDay.push({ day, expenses: data.expenses });
            purchasesPerDay.push({ day, purchases: data.purchases });

            const netSales = data.sales - data.expenses - data.purchases;
            netSalesByDay.push({ day, netSales });
        }

        // return product data
        const result = await prodCheck({ shopId });
        const trialData = result.data?.trialEnd?.toString();
        if (!trialData) return;
        const trialEnd = timeRemainingUntil(trialData);

        const mostAsked = await mainDb
          .select({ name: askedProducts.productName })
          .from(askedProducts)
          .where(eq(askedProducts.shopId, shopId))
          .orderBy(desc(askedProducts.quantityRequested))
          .limit(1).then(rows => rows[0].name);


        console.timeEnd("Analytics");

        return {
            success: true,
            data: [{
                  profitPerProduct,
                  mostAsked,
                  highestProfitProduct,
                  netProfit,
                  lowestProduct,
                  lowStockProducts,
                  mostSoldProductByQuantity,
                  longTermDebtUser,
                  mostDebtUser,
                  daysSinceDebt,
                  salesByDay,
                  expensesByDay,
                  netSalesByDay,
                  purchasesPerDay,
                  prodMessage: result.message,
                  subscription: result.data?.shopSubscription, // Include subscription level
                  trialEnd // Include trial end date
                }]
        };

    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "Hitilafu kwenye seva"
        };
    }
};

export const salesAnalytics = async ({ userId, shopId, query}: {userId: string, shopId: string, query: SalesQuery}) => {
            try {

          // Extract query parameters or set defaults
          const {
            search = '',
            date = 'Leo',  // Default to 'Leo' if not provided
            from = '',
            to = '',
            page = '1',
            limit = '10',
          } = query;
    
          const pageNum = parseInt(page as string) || 1;
          const perPage = parseInt(limit as string) || 10;
          const offset = (pageNum - 1) * perPage;
      
          // Initialize filters array
          const filters = [];
      
          // Ensure shop filter is always applied
          filters.push(eq(sales.shopId, shopId));
      
          // Handle search query
          const searchTrimmed = (search as string).trim();
    
          if (searchTrimmed) {
            filters.push(
              or(
                ilike(customers.name, `%${searchTrimmed}%`),
                ilike(products.name, `%${searchTrimmed}%`)
              )
            );
          }
    
          // Handle date filtering (today, week, month, or custom)
          if (date && date !== 'Tarehe_maalumu') {
            const today = new Date();
            today.setHours(today.getHours() + 3);  // Add +3 to UTC -> EAT for East Africa
            let start: Date, end: Date;
      
            switch (date) {
              case 'Leo':
                start = new Date(today.toDateString());
                end = new Date(start);
                end.setDate(end.getDate() + 1);
                break;
              case 'Wiki_hii':
                start = new Date(today);
                start.setDate(start.getDate() - 7);
                end = today;
                break;
              case 'Mwezi_huu':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                end = today;
                break;
              case 'Jana': 
                start = new Date(today);
                start.setDate(today.getDate() - 1);
                end = new Date(start);
                end.setDate(end.getDate() + 1);  // **⚡You missed this line in your 'Jana'**
                break;
              default:
                start = end = today;
            }
      
            filters.push(and(gte(sales.createdAt, start), lte(sales.createdAt, end)));
          }
      
          // Handle custom date range filtering
          if (date === 'Tarehe_maalumu' && from && to) {
            filters.push(and(gte(sales.createdAt, new Date(from)), lte(sales.createdAt, new Date(to))));
          }

      
      
          // Construct where clause from filters
          const whereClause = filters.length ? and(...filters) : undefined;
      
          // Get total count of sales matching the filters
          const totalResult = await mainDb
            .select({ count: sql<number>`COUNT(*)` })
            .from(sales)
            .leftJoin(customers, eq(sales.customerId, customers.id))
            .leftJoin(products, eq(sales.productId, products.id))
            .where(
              and(
                whereClause,
                eq(sales.shopId, shopId)
              )
            );
      
          const total = totalResult[0].count;
      
          // Get the sales data based on filters, pagination, and ordering
          const results = await mainDb
            .select({
              date: sales.createdAt,
              name: products.name,
              total: sales.totalSales,
              priceBought: purchases.priceBought,
              quantity: sales.quantity
            })
            .from(sales)
            .leftJoin(customers, eq(sales.customerId, customers.id))
            .leftJoin(products, eq(sales.productId, products.id))
            .leftJoin(purchases, eq(sales.productId, purchases.productId))
            .where(
              and (
              whereClause,
              eq(sales.shopId, shopId)
              )
            )
            .limit(perPage)
            .offset(offset)
            .orderBy(desc(sales.createdAt));    
    
          // Return the sales data and total count
          return {
            success: true,
            data: results,
            total,
          };
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : "Hitilafu imetokea kwenye seva"
          }
        }
}

export const exportSales = async ({ userId, shopId, set } : { shopId: string, userId: string, set: exportSet }) => {
    try {
      
          // 🔥 Fetch sales for this shop
          const salesData = await mainDb
            .select({
              date: sales.createdAt,
              productName: products.name,
              total: sales.totalSales,
              priceBought: purchases.priceBought,
              quantity: sales.quantity
            })
            .from(sales)
            .leftJoin(customers, eq(sales.customerId, customers.id))
            .leftJoin(products, eq(sales.productId, products.id))
            .leftJoin(purchases, eq(sales.productId, purchases.productId))
            .where(eq(sales.shopId, shopId))
            .orderBy(desc(sales.createdAt));
      
          // 🔥 Build CSV manually
          const csvHeader = "Tarehe,Jina la Bidhaa,Jumla,Faida,Idadi\n";
          const csvRows = salesData.map(row => {
            const dateObj = new Date(row.date);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:${String(dateObj.getSeconds()).padStart(2, '0')}`;

            const profit = Number(row.total) - (Number(row.priceBought) * row.quantity);
                
            return `${formattedDate},"${row.productName}",${row.total},${profit},"${row.quantity}"`;
          });
          const csvContent = csvHeader + csvRows.join("\n");
      
          // 🔥 Set headers for file download
          set.headers = {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="Mauzo.csv"',
          };
      
          return new Response(csvContent);
      
        } catch (error) {
          return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : "Hitilafu imetokea kwenye seva"
          }
        }
}

export const graphFunc = async ({ shopId, userId }: { shopId: string; userId: string }) => {
  try {
    const weekDaysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // 1. Total stocks added per day
    const stocksByDay = await mainDb
      .select({
        day: sql`TO_CHAR(${products.createdAt}, 'Dy')`.as('day_of_week'),
        totalStock: sql`SUM(${products.stock})`.as('total_stock'),
      })
      .from(products)
      .where(eq(products.shopId, shopId))
      .groupBy(sql`day_of_week`)
      .orderBy(sql`day_of_week`);

    const stocksByDayMap = new Map<string, number>();
    weekDaysOrder.forEach(day => stocksByDayMap.set(day, 0));

    for (const row of stocksByDay) {
      const day = row.day as string;
      if (stocksByDayMap.has(day)) {
        stocksByDayMap.set(day, Number(row.totalStock || 0));
      }
    }

    const dailyStockTrend = Array.from(stocksByDayMap).map(([day, totalStock]) => ({
      day,
      totalStock
    }));

    // 2. Debt by customer
    const DebtsByCustomer = await mainDb
      .select({
        customerName: customers.name,
        totalDebts: sql`SUM(${debts.remainingAmount})`.as('total_debts'),
      })
      .from(debts)
      .innerJoin(customers, eq(debts.customerId, customers.id))
      .where(eq(debts.shopId, shopId))
      .groupBy(customers.name)
      .orderBy(sql`total_debts DESC`);

    // 3. Cash vs debt sales
    const cashDebtData = await mainDb
      .select({
        type: sales.saleType,
        amount: sql`SUM(${sales.priceSold} * ${sales.quantity})`.as('amount')
      })
      .from(sales)
      .where(eq(sales.shopId, shopId))
      .groupBy(sales.saleType);

    return {
      success: true,
      data: [{
        stockTrend: dailyStockTrend,
        DebtsByCustomer,
        cashDebtData
      }],
      message: "Taarifa za mauzo zimepatikana kwa mafanikio"
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Hitilafu imetokea kwenye seva"
    };
  }
};