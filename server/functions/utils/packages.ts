import { and, count, eq, lt } from "drizzle-orm"
import { mainDb } from "../../database/schema/connections/mainDb"
import { products, shops } from "../../database/schema/shop";


export type SubscriptionLevel = "Msingi" | "Lite" | "Business" | "Pro" | "AI" | "Trial";

// define limits
export const subscriptionLimits: Record<SubscriptionLevel, number> = {
  "Trial": 50,
  "Msingi": 50,
  "Lite": 300,
  "Business": Infinity, 
  "Pro": 1500,
  "AI": Infinity,
};

// this is used in cronjob (don't delete)

export const retentionPeriods: Record<SubscriptionLevel, number> = {
  "Trial": 1,       //1 month
  "Msingi": 1,      // 1 month
  "Lite": 3,        // 3 months
  "Pro": 6,         // 6 months
  "Business": 12,   // 1 year
  "AI": 24,         // 2 years
};

export const prodCheck = async ({ shopId }: { shopId: string }): Promise<{ success: boolean; message: string; data?: SubscriptionLevel }> => {
  // Use Promise.all to concurrently fetch product count and subscription details
  const [productsResult, subscriptionResult] = await Promise.all([
    mainDb.select({ total: count() }).from(products).where(eq(products.shopId, shopId)),
    mainDb.select({ subscrib: shops.subscription }).from(shops).where(eq(shops.id, shopId))
  ]);

  const prodCount = productsResult[0]?.total;
  const shopSubscription = (subscriptionResult[0]?.subscrib || "Trial") as SubscriptionLevel; // Get subscription, default to "Trial" or handle empty result

  // Get the maximum allowed products for the retrieved subscription level
  const limit = subscriptionLimits[shopSubscription];

  // Check if a limit exists and if the current product count exceeds it
  if (prodCount > limit) {
    return {
      success: false,
      message: `Aina za bidhaa ulizosajili zimetosha, ongeza kifurushi cha juu kufungua aina zaidi ya ${limit}`
    };
  }

  return {
    success: true,
    data: shopSubscription,
    message: `Umesajili bidhaa ${prodCount} kati ya ${limit}`
  }
      // this is young and simple approach.
    // switch(subscription) {
    //     case "Trial":
    //         if (prodCount > 50){
    //             return {
    //                 success: false,
    //                 message: "Aina za bidhaa ulizosajili zimetosha, ongeza kifurushi cha juu kufungua aina zaidi ya 50"
    //             }
    //         }
    //         break;
    //     case "Msingi":
    //         if (prodCount > 50){
    //             return {
    //                 success: false,
    //                 message: "Aina za bidhaa ulizosajili zimetosha, ongeza kifurushi cha juu kufungua aina zaidi ya 50"
    //             }
    //         }
    //         break;
    //     case "Lite":
    //         if (prodCount > 300){
    //             return {
    //                 success: false,
    //                 message: "Aina za bidhaa ulizosajili zimetosha, ongeza kifurushi cha juu kufungua aina zaidi ya 300"
    //             }
    //         }
    //         break; 
    //     case "Pro":
    //         if (prodCount > 1500){
    //             return {
    //                 success: false,
    //                 message: "Aina za bidhaa ulizosajili zimetosha, ongeza kifurushi cha juu kufungua aina zaidi ya 1500"
    //             }
    //         }
    //         break;
    // }

};

// multiple check other services with ease and message only logics
export type ServiceCheck = "customers" | "prdFreqCheck" | "assistant" | "exportCSV";

// Define access rules for each service
const serviceAccessRules: Record<ServiceCheck, {
  minLevel: SubscriptionLevel;
  message: string;
}> = {
  customers: {
    minLevel: "Lite",
    message: "Huwezi kuchagua wateja, chagua kifurushi cha Lite au zaidi"
  },
  prdFreqCheck: {
    minLevel: "Business",
    message: "Ukaguzi wa mara kwa mara unahitaji kifurushi cha Business au juu"
  },
  assistant: {
    minLevel: "Lite",
    message: "Kusajili msaidizi au mfanyakazi, chagua kifurushi cha Lite au zaidi"
  },
  exportCSV: {
    minLevel: "Lite",
    message: "Kuhamisha Taarifa kunahitaji kifurushi cha Lite au juu"
  }
};

// Subscription level hierarchy (for comparison)
const subscriptionHierarchy: Record<SubscriptionLevel, number> = {
  "Msingi": 0,
  "Lite": 1,
  "Business": 2,
  "Pro": 3,
  "AI": 4,
  "Trial": 1 // Trial has Lite-level access
};

export const checkServiceAccess = async ({
  shopId,
  service
}: {
  shopId: string;
  service: ServiceCheck;
}): Promise<{ success: boolean; message?: string }> => {
  // Get shop subscription
  const [shop] = await mainDb
    .select({ subscription: shops.subscription })
    .from(shops)
    .where(eq(shops.id, shopId));

  if (!shop) {
    return { success: false, message: "Duka halijapatikana" };
  }

  const currentSubscription = shop.subscription;
  const requiredLevel = serviceAccessRules[service].minLevel;

  // Compare subscription levels
  if (subscriptionHierarchy[currentSubscription] < subscriptionHierarchy[requiredLevel]) {
    return {
      success: false,
      message: serviceAccessRules[service].message
    };
  }

  return {
    success: true,
    message: "done!"
  }

};
