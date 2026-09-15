CREATE TABLE "product" (
	"id" text PRIMARY KEY,
	"user_id" text,
	"name" text NOT NULL,
	"product_type" text DEFAULT 'product' NOT NULL,
	"unit" text NOT NULL,
	"base_price" integer DEFAULT 0 NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "product_userId_idx" ON "product" ("user_id");--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;