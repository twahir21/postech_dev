CREATE TABLE "password_resets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"is_used" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL
);
