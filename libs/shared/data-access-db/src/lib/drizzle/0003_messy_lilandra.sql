CREATE TABLE "api_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"user_id" text,
	"name" text DEFAULT 'Api Key' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "api_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;