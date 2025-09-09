CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" text NOT NULL,
	"teamId" text,
	"access_token" text,
	"configuration_id" text,
	"installation_id" text,
	CONSTRAINT "organizations_access_token_unique" UNIQUE("access_token"),
	CONSTRAINT "organizations_configuration_id_unique" UNIQUE("configuration_id"),
	CONSTRAINT "organizations_installation_id_unique" UNIQUE("installation_id")
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_external_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_team_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_access_token_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_configuration_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_installation_id_unique";--> statement-breakpoint
ALTER TABLE "projects" DROP CONSTRAINT "projects_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "orgId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_orgId_organizations_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "team_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "access_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "configuration_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "installation_id";