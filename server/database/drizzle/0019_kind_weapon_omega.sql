CREATE TABLE "daily_sales" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text,
	"total_sales" text,
	"total_purchases" text,
	"total_expenses" text,
	"net_profit" text,
	"shop_id" uuid
);
