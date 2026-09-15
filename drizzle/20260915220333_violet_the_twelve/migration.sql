ALTER TABLE "invoice" RENAME COLUMN "document_type" TO "type";--> statement-breakpoint
ALTER TABLE "invoice" DROP COLUMN "status";