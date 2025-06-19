// implement crud

import type { headTypes, ProductQuery, suppTypes } from "../types/types";
import { mainDb } from "../database/schema/connections/mainDb";
import { suppliers } from "../database/schema/shop";
import { and, eq, ilike, sql } from "drizzle-orm";
import { sanitizeString } from "./security/xss";

// post 
export const suppPost = async ({ body, headers, shopId}: { body : suppTypes, headers: headTypes, shopId: string}) => {
    try {

    // now extract
    let { company, contact } = body as suppTypes;

    // remove xss scripts if availabe
    company = sanitizeString(company.trim().toLowerCase());
    contact = sanitizeString(contact.trim());

    // check if already exists
    const checkSupp = await mainDb
        .select()
        .from(suppliers)
        .where(eq(suppliers.company, company));
        
    if (checkSupp.length > 0) {
        return {
            success: false,
            message: "Tayari taarifa zipo"
        }
    }



    // now save to database
    await mainDb.insert(suppliers).values({
        shopId,
        company,
        contact
    });

    return {
        success: true,
        message: "Umefanikiwa kuhifadhi taarifa"
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

// get request

export const suppGet = async ({
  headers,
  shopId,
  userId,
  query
}: {
  headers: headTypes;
  shopId: string;
  userId: string;
  query: ProductQuery;
}) => {
  console.time("fetchSuppliers");


  try {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '5');
    const search = query.search || '';
    const offset = (page - 1) * limit;

    // Build filter condition
    const where = and(
      eq(suppliers.shopId, shopId),
      search ? ilike(suppliers.company, `%${search}%`) : undefined
    );

    // Get total count
    const total = await mainDb
      .select({ count: sql<number>`count(*)` })
      .from(suppliers)
      .where(where || undefined)
      .then((rows) => Number(rows[0].count));

    // Fetch suppliers
    const existingSuppliers = await mainDb
      .select()
      .from(suppliers)
      .where(where)
      .orderBy(suppliers.createdAt)
      .limit(limit)
      .offset(offset);

    if (existingSuppliers.length === 0) {
      return {
        success: false,
        message: "Hakuna kilichopatikana kwenye hifadhi",
        data: [],
        total
      };
    }

    console.timeEnd("fetchSuppliers");

    return {
      success: true,
      message: "umefanikiwa kupata taarifa",
      data: existingSuppliers,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
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

export const suppGetAll = async ({
  shopId,
  userId,
}: {
  shopId: string;
  userId: string;
}) => {
  console.time("fetchSuppliers");


  try {
    console.time("fetchAllSupp")
    // Fetch suppliers
    const existingSuppliers = await mainDb
      .select()
      .from(suppliers)
      .where(eq(suppliers.shopId, shopId))
      .orderBy(suppliers.createdAt)

    if (existingSuppliers.length === 0) {
      return {
        success: false,
        message: "Hakuna kilichopatikana kwenye hifadhi",
        data: [],
      };
    }

    console.timeEnd("fetchAllSupp");

    return {
      success: true,
      message: "umefanikiwa kupata taarifa",
      data: existingSuppliers,
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


// update
export const suppPut = async ({ body, headers, supplierId }: { body : suppTypes, headers: headTypes, supplierId: string}) => {
    try {
      console.time("suppUpdate");
    // now extract
    let { company, contact } = body as suppTypes;

    // sanitize to remove xss
    company = sanitizeString(company.trim().toLowerCase());    
    contact = sanitizeString(contact);


    // Validate ID length before querying (optional)
    if (!supplierId || supplierId.length < 5) {
        return {
            success: false,
            message: "ID sio sahihi"
        };
    }

    // Update the suppliers where id matches
    const updateSupp = await mainDb
        .update(suppliers)
        .set({
            company,
            contact
        })
        .where(eq(suppliers.id, supplierId))
        .returning({ id: suppliers.id, company: suppliers.company, contact: suppliers.contact});

    if (!updateSupp) {
        return {
            success: false,
            message: "Hakuna taarifa iliyopatikana"
        }
    }

    console.timeEnd("suppUpdate")

    return {
        success: true,
        data: updateSupp,
        message: "Umefainikiwa ku-update taarifa"
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

// delete
export const suppDel = async ({ headers, supplierId, shopId }: {headers: headTypes, supplierId: string, shopId: string }) => {

    try { 

        // Validate ID length before querying (optional)
        if (!supplierId || supplierId.length < 5) {
            return {
                success: false,
                message: "id ya msambazaji haipo!"
            };
        }

        // delete from db
        const suppDel = await mainDb.delete(suppliers)
                            .where(
                                and(
                                    eq(suppliers.id, supplierId),
                                    eq(suppliers.shopId, shopId)
                                )
                            );

        if (!suppDel) {
            return {
                success: false,
                message: "Hakuna taarifa ya kufutwa"
            }
        }

        return{
            success: true,
            message: "umefanikiwa kufuta taarifa"
        }
    } catch (error) {
        if (error instanceof Error){
            return {
                success: false,
                message: error instanceof Error 
                        ? error.message
                        : "Hitilafu kwenye seva"
            }
        }
    }
} 
