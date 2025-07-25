import {
    pgTable,
    uuid,
    text,
    integer, 
    timestamp,
    uniqueIndex, 
    index,
    boolean,
    doublePrecision,
    decimal
  } from "drizzle-orm/pg-core";


  // -----------------
  // Users Table
  // -----------------
  export const users = pgTable("users", {
      id: uuid("id").defaultRandom().primaryKey(),
      username: text("username").notNull(),
      email: text("email").unique().notNull(),
      password: text("password").notNull(),
      phoneNumber: text("phoneNumber").unique().notNull(),
      role: text("role").notNull().default("owner"), // Default role is "owner"
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date())
  }, (table) => ({
      emailIndex: index("idx_email").on(table.email),
  }));

  // -----------------
  // Shops Table
  // -----------------

  export const shops = pgTable("shops", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").unique().notNull(),

    subscription: text("subscription_type", {
      enum: ["Msingi", "Lite", "Business", "Pro", "AI", "Trial"]
    }).default("Trial").notNull(),

    trialStart: timestamp("trial_start", { mode: "date" }),
    trialEnd: timestamp("trial_end", { mode: "date" }),
    paidUntil: timestamp("paid_until", { mode: "date" }),

    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  });


  // -----------------
  // Shop Users Table (Many-to-Many) multi-users 
  // -----------------
    export const shopUsers = pgTable("shop_users", {
      id: uuid("id").defaultRandom().primaryKey(),
      shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
      userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),      
      role: text("role").notNull().default("assistant"), // Role inside the shop
      isPaid: boolean("is_paid").default(true),
  }, (table) => ({
      uniqueUserRole: uniqueIndex("unique_user_role").on(table.shopId, table.userId), // Unique per shop
      uniqueUsername: uniqueIndex("unique_username_per_shop").on(table.shopId, table.userId)
  }));



  // -----------------
  // Suppliers Table (Updated)
  // -----------------
  export const suppliers = pgTable("suppliers", {
    id: uuid("id").defaultRandom().primaryKey(),
    company: text("company").notNull(),
    contact: text("contact").notNull(),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    mostSoldProduct: uuid("most_sold_product"), // FK to products.id (optional)
    highestProfitProduct: uuid("highest_profit_product"), // FK to products.id (optional)
    createdAt: timestamp("created_at").defaultNow(),
  }, (table) => ({
    // Define index on shopId
    idx_suppliers_shop_id: index('idx_suppliers_shop_id').on(table.shopId),
  }));

  // -----------------
  // Products Table (Updated)
  // -----------------
  export const products = pgTable("products", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    priceSold: decimal("price_sold", { precision: 15, scale: 2}).notNull(), // is string but store up to 999 trillion and support USD dollar
    stock: doublePrecision("stock").notNull().default(0),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    minStock: doublePrecision("min_stock").notNull().default(0),
    status: text("status").notNull().default("available"),
    unit: text("unit"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  }, (table) => ({
    uniqueProductShop: uniqueIndex("unique_product_shop").on(table.name, table.shopId),
  }));

  // -----------------
  // Purchases Table (New)
  // -----------------
  export const purchases = pgTable("purchases", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    quantity: doublePrecision("quantity").notNull().default(0), // Amount added to stock
    priceBought: decimal("price_bought", { precision: 15, scale: 2}).notNull(), // Cost price per unit
    totalCost: decimal("total_cost", { precision: 15, scale: 2}).notNull().default("0"), // quantity * priceBought
    purchaseDate: timestamp("purchase_date").defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  }, (table) => ({
    idxProductShop: index("idx_purchases_product_shop").on(table.productId, table.shopId)
  }));

  
  // ------------------------------
  // Supplier Price History Table
  // ------------------------------
  export const supplierPriceHistory = pgTable("supplier_price_history", {
    id: uuid("id").defaultRandom().primaryKey(),
    supplierId: uuid("supplier_id").notNull().references(() => suppliers.id),
    productId: uuid("product_id").notNull().references(() => products.id, {onDelete: "cascade"}),
    shopId: uuid("shop_id").notNull().references(() => shops.id),
    price: decimal("price", { precision: 15, scale: 2}).notNull(),
    dateAdded: timestamp("date_added").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),

}, (table) => ({
    uniqueSupplierProduct: uniqueIndex("unique_supplier_product").on(table.supplierId, table.productId, table.shopId),
}));

  
  
  // -----------------
  // Sales Table
  // -----------------
  export const sales = pgTable("sales", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, {onDelete: "cascade"}),
    quantity: doublePrecision("quantity").notNull().default(0),
    priceSold: decimal("price_sold", {precision: 15, scale: 2}).notNull(), // this is mandatory for calculating total price
    // total_price and net_price can be computed on the fly in queries
    totalSales: decimal("total_sales", { precision: 15, scale: 2}).notNull(),
    discount: doublePrecision("discount").notNull().default(0),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    saleType: text("sale_type").notNull().default("cash"),
    customerId: uuid("customer_id"), // Nullable for cash sales
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },  (table) => ({
    idxProductShop: index("idx_sales_product_shop").on(table.productId, table.shopId)
  }));
  
  // -----------------
  // Debts Table
  // -----------------
  export const debts = pgTable("debts", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, {onDelete: "cascade"}),
    customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    totalAmount: decimal("total_amount", { precision: 15, scale: 2}).notNull(),
    quantity: doublePrecision("quantity").notNull().default(0), // Amount added to stock
    remainingAmount: decimal("remaining_amount", { precision: 15, scale: 2}).notNull(),
    priceSold: decimal("price_sold", { precision: 15, scale: 2}).notNull(), // is string but store up to 999 trillion and support USD dollar
    totalSales: decimal("total_sales", { precision: 15, scale: 2}).notNull(),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    lastPaymentDate: timestamp("last_payment_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date())

  });
  
  // -------------------------
  // Debt Payments Table
  // -------------------------
  export const debtPayments = pgTable("debt_payments", {
    id: uuid("id").defaultRandom().primaryKey(),
    debtId: uuid("debt_id").references(() => debts.id,{onDelete: "cascade"}),
    customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    amountPaid: decimal("amount_paid", { precision: 15, scale: 2}).notNull(), 
    paymentDate: timestamp("payment_date").defaultNow(),
  });
  
  // -----------------
  // Customers Table
  // -----------------
  export const customers = pgTable("customers", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    shopId: uuid("shop_id").notNull().references(() => shops.id), // NEW: Links product to a shop
    contact: text("contact").notNull(), // index via this
    // total_debt and longest_debt are calculated via queries (aggregated), so they are not stored here
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date())
  }, (table) => ({
    uniqueCustomer: uniqueIndex("unique_customer_name_per_shop").on(table.name, table.shopId),
    uniqueContact: uniqueIndex("unique_customer_contact_per_shop").on(table.contact, table.shopId),
  }));
  
  // -----------------
  // Returns Table
  // -----------------
  export const returns = pgTable("returns", {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, {onDelete: "cascade"}),
    quantity: doublePrecision("quantity").notNull().default(0),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    reason: text("reason").notNull(),
    returnDate: timestamp("return_date").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  });
  
  // -----------------
  // Expenses Table
  // -----------------
  export const expenses = pgTable("expenses", {
    id: uuid("id").defaultRandom().primaryKey(),
    description: text("description").notNull(),
    amount: decimal("amount", { precision: 15, scale: 2}).notNull(),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    date: timestamp("date").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date())

  });
  
  // -----------------------
  // Asked Products Table
  // -----------------------
  export const askedProducts = pgTable("asked_products", {
    id: uuid("id").defaultRandom().primaryKey(),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    productName: text("product_name").notNull(),
    quantityRequested: integer("quantity_requested").notNull().default(0),
    date: timestamp("date").defaultNow(),
  });
  

  // ------------------------------
  // Email Verification Token Table
  // ------------------------------
  export const emailVerifications = pgTable("email_verifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    token: uuid("token").defaultRandom().notNull().unique(), 
    email: text("email").notNull(),
    shopName: text("shop_name").notNull(),
    username: text("username").notNull(),
    phone: text("phone").notNull(),
    password: text("password").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    used: boolean("used").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow()
  });

  // ------------------------------
  // Payment table Table
  // ------------------------------
  export const paymentSaaS = pgTable("payment_saas", {
    id: uuid("id").defaultRandom().primaryKey(),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    token: text("token_clickpesa").notNull(),
    amountToPay: decimal("amount_to_pay", { precision: 15, scale: 2 }).notNull(),
    orderId: text("order_id"),
    createdAt: timestamp("created_At").defaultNow(),
    status: text("status", {
      enum: [ "success", "failed"]
    })
  });

  // ------------------------------
  // Notification Table
  // ------------------------------
  export const notifications = pgTable("notifications", {
    id: uuid("id").defaultRandom().primaryKey(),
    shopId: uuid("shop_id").notNull().references(() => shops.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type", { enum: ["info", "warning", "error", "upgrade"] }).default("info"),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});


  // ----------------------------
  //  Forgot Password
  // ----------------------------
  export const passwordResets = pgTable("password_resets", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
  })