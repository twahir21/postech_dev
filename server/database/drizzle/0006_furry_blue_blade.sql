ALTER TABLE "debt_payments" DROP CONSTRAINT "debt_payments_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "debts" ADD COLUMN "product_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "debts" ADD CONSTRAINT "debts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debt_payments" DROP COLUMN "product_id";