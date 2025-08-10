CREATE TABLE "graph_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text,
	"sales" text,
	"purchases" text,
	"expenses" text,
	"profit" text,
	"shop_id" uuid,
	"created_At" timestamp DEFAULT now()
);
