ALTER TABLE "debts" ADD COLUMN "quantity" double precision DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "debts" ADD COLUMN "price_sold" numeric(15, 2) NOT NULL;