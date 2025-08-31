CREATE TABLE "stream_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"stream_id" text NOT NULL,
	"content" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stream_logs" ADD CONSTRAINT "stream_logs_stream_id_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."streams"("id") ON DELETE cascade ON UPDATE no action;