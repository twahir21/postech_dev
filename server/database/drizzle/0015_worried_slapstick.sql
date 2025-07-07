ALTER TABLE "products" DROP CONSTRAINT "products_supplier_id_suppliers_id_fk";
--> statement-breakpoint
ALTER TABLE "purchases" DROP CONSTRAINT "purchases_supplier_id_suppliers_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "supplier_id";--> statement-breakpoint
ALTER TABLE "purchases" DROP COLUMN "supplier_id";