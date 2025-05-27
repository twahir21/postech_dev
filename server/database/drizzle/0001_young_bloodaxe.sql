ALTER TABLE "shops" ADD COLUMN "subscription" text DEFAULT 'Trial' NOT NULL;--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "trial_start" timestamp;--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "trial_end" timestamp;--> statement-breakpoint
ALTER TABLE "shops" ADD COLUMN "paid_until" timestamp;