import { boolean, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';

export const modeEnum = pgEnum('mode', ['realtime', 'batch', 'daily']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  teamId: text('team_id').unique(),
  accessToken: text('access_token').unique().notNull(),
  configurationId: text('configuration_id').unique().notNull(),
  installationId: text('installation_id').unique().notNull(),
  webhookUrl: text('webhook_url'),
  processingMode: modeEnum('processing_mode').notNull().default('realtime'),
  automaticProcessing: boolean('automatic_processing').notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
