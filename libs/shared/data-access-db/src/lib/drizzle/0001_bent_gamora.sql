CREATE TYPE "public"."stream_status" AS ENUM('active', 'completed', 'error', 'stopped');--> statement-breakpoint
CREATE TABLE "streams" (
	"id" text PRIMARY KEY NOT NULL,
	"status" "stream_status" DEFAULT 'active' NOT NULL,
	"stream_url" text NOT NULL,
	"webhook_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"error_message" text
);
