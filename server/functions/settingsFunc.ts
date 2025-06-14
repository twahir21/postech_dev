import { eq, sql } from "drizzle-orm";
import { mainDb } from "../database/schema/connections/mainDb";
import { askedProducts, categories, customers, debtPayments, debts, expenses, products, purchases, returns, sales, shops, shopUsers, supplierPriceHistory, suppliers, users } from "../database/schema/shop";
import type { headTypes, pswdType, shopTypes } from "../types/types";
import { sanitizeString } from "./security/xss";
import { hashPassword, verifyPassword } from "./security/hash";
import type { Cookie } from "elysia";

export const shopSettingsFunc = async ({ shopId, userId, headers }: {userId: string, shopId: string, headers: headTypes}) => {

    try {
        // get the concept of shop needed data
        const fetchShop = await mainDb.select({ shopName: shops.name }).from(shops).where(eq(shops.id, shopId));
        const fetchEmail = await mainDb.select({ email: users.email }).from(users).where(eq(users.id, userId));


        if (fetchShop.length === 0 || fetchEmail.length === 0) {
        return {
            success: false,
            message: "Hakuna kilichopatikana"
        }
        }

        return {
        success: true,
        data: [{ shopName: fetchShop[0], email: fetchEmail[0]}],
        message: "Umefanikiwa kupata taarifa"
        }



    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : "Hitilafu imetokea kwenye seva"
        }
    }
}

export const shopSettingsPut = async ({ shopId, userId, headers, body }: {userId: string, shopId: string, headers: headTypes, body: shopTypes}) => {

        try {
    
          let { email, shopName } = body as shopTypes;
    
          email = sanitizeString(email);
          shopName = sanitizeString(shopName);
    
    
          // give the logic of saving to database
         await mainDb.update(users).set({
            email
          }).where(eq(users.id, userId));

    
          await mainDb.update(shops).set({
            name: shopName
          }).where(eq(shops.id, shopId));

          return {
            success: true,
            message: "Umefanikiwa kubadili taarifa zako kiukamilifu"
          }
    
        } catch (error) {
            return {
                success: false,
                message: error instanceof Error
                        ? error.message
                        : "Hitilafu imetokea kwenye seva"
            }
        }
}

export const updatePassword = async ({ shopId, userId, headers, body }: {userId: string, shopId: string, headers: headTypes, body: pswdType}) => {

    try {

    let { currentPassword, newPassword } = body as pswdType;

    // sanitize
    currentPassword = sanitizeString(currentPassword);
    newPassword = sanitizeString(newPassword);

    const res = await mainDb.select({ pswd: users.password }).from(users).where(eq(users.id, userId));

    const fetchedPswd = res[0].pswd;

    const isVerified = await verifyPassword(fetchedPswd, currentPassword);

    if(!isVerified) {
    return {
        success: false,
        message: "Nenosiri la zamani sio sahihi, jaribu tena"
    }
    }

    // hash new password and save
    const hashedNewPassword = await hashPassword(newPassword);

    await mainDb.update(users)
    .set({
    password: hashedNewPassword
    })
    .where(eq(users.id, userId))
    .returning();


    return {
    success: true,
    message: "Umefanikiwa kubadili nenosiri, tafadhali itunze"
    }


    } catch (error) {
        return {
            success: false,
            message: error instanceof Error
                    ? error.message
                    : "Hitilafu kwenye seva"
        }
    }
}

export const deleteShop = async ({ shopId, userId, cookie }: {userId: string, shopId: string,  cookie: Record<string, Cookie<string | undefined>>}) => {

    try {

        // ensure user is Admin 
        const isAdminCheck = await mainDb.select({role: users.role}).from(users).where(eq(users.id, userId));
  
        const isAdmin = isAdminCheck[0].role;
  
  
        if(isAdmin !== 'owner'){
          return {
            success: false,
            message: "Hauna mamlaka ya kufuta duka"
          }
        }
  
        //  get the concept of deleting shop
        const tables = [
          askedProducts, supplierPriceHistory, debtPayments, debts,
          sales, purchases, returns, expenses, products,
          suppliers, customers, categories,
        ];

        await mainDb.transaction(async (tx) => {
          for (const table of tables) {
            await tx.delete(table).where(eq(table.shopId, shopId));
          }
        });

        // await mainDb.delete(shopUsers).where(eq(shopUsers.shopId, shopId));
        // await mainDb.delete(shops).where(eq(shops.id, shopId));
        
        // Delete orphaned users
        // await mainDb.execute(sql`
        //   DELETE FROM users 
        //   WHERE id IN (
        //     SELECT users.id FROM users
        //     LEFT JOIN shop_users ON users.id = shop_users.user_id
        //     WHERE shop_users.id IS NULL
        //   );
        // `);
        
  
        // delete the coookies
        cookie.auth_token.set({
          value: "",
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
          maxAge: 0,
          path: '/',
          domain: process.env.NODE_ENV === 'development' 
                  ? undefined: ".mypostech.store"  
          });

        cookie.username.set({
          value: "",
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development' ? false : true,
          sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
          maxAge: 0,
          path: '/',
          domain: process.env.NODE_ENV === 'development' 
                  ? undefined: ".mypostech.store"  
        });

        return {
          success: true,
          message: "Umefanikiwa kufuta duka"
        }
  
        
      } catch (error) {
          return {
              success: false,
              message: error instanceof Error
                      ? error.message
                      : "Hitilafu kwenye seva"
          }
      }
}