ALTER TABLE "products" ALTER COLUMN "stock" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "min_stock" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "purchases" ALTER COLUMN "quantity" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "returns" ALTER COLUMN "quantity" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "quantity" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "sales" ALTER COLUMN "discount" SET DATA TYPE double precision;