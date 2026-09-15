CREATE TABLE "invoice" (
	"id" text PRIMARY KEY,
	"user_id" text,
	"customer_id" text,
	"number" integer NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"issue_date" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp,
	"discount" integer DEFAULT 0 NOT NULL,
	"tax_rate" integer DEFAULT 0 NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoice_item" (
	"id" text PRIMARY KEY,
	"invoice_id" text NOT NULL,
	"product_id" text,
	"name" text NOT NULL,
	"unit" text NOT NULL,
	"quantity" numeric(10,2) DEFAULT '1' NOT NULL,
	"unit_price" integer DEFAULT 0 NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "invoice_userId_idx" ON "invoice" ("user_id");--> statement-breakpoint
CREATE INDEX "invoice_customerId_idx" ON "invoice" ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoice_userId_number_idx" ON "invoice" ("user_id","number");--> statement-breakpoint
CREATE INDEX "invoice_item_invoiceId_idx" ON "invoice_item" ("invoice_id");--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_customer_id_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_invoice_id_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invoice_item" ADD CONSTRAINT "invoice_item_product_id_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE SET NULL;