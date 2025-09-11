CREATE TABLE "user_organizations" (
	"userId" text NOT NULL,
	"org_id" text NOT NULL,
	CONSTRAINT "user_organizations_userId_org_id_pk" PRIMARY KEY("userId","org_id")
);
--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "providerId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "teamId" text;--> statement-breakpoint
ALTER TABLE "user_organizations" ADD CONSTRAINT "user_organizations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_organizations" ADD CONSTRAINT "user_organizations_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "organizations" DROP COLUMN "teamId";--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_providerId_unique" UNIQUE("providerId");