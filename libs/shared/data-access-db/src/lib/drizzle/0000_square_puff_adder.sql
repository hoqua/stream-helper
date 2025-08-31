CREATE TYPE "public"."mode" AS ENUM('realtime', 'batch', 'daily');--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text,
	"access_token" text NOT NULL,
	"configuration_id" text NOT NULL,
	"installation_id" text NOT NULL,
	"webhook_url" text,
	"processing_mode" "mode" DEFAULT 'realtime' NOT NULL,
	"automatic_processing" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_team_id_unique" UNIQUE("team_id"),
	CONSTRAINT "users_access_token_unique" UNIQUE("access_token"),
	CONSTRAINT "users_configuration_id_unique" UNIQUE("configuration_id"),
	CONSTRAINT "users_installation_id_unique" UNIQUE("installation_id")
);
