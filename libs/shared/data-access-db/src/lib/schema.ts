import { boolean, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const modeEnum = pgEnum('mode', ['realtime', 'batch', 'daily']);
export const streamStatusEnum = pgEnum('stream_status', [
  'active',
  'completed',
  'error',
  'stopped',
]);

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

export const streams = pgTable('streams', {
  id: text('id').primaryKey(),
  status: streamStatusEnum('status').notNull().default('active'),
  streamUrl: text('stream_url').notNull(),
  webhookUrl: text('webhook_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  errorMessage: text('error_message'),
});

export const streamLogs = pgTable('stream_logs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  streamId: text('stream_id')
    .notNull()
    .references(() => streams.id, { onDelete: 'cascade' }),
  content: text('content'),
  metadata: text('metadata'), // JSON string for additional data
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Stream = typeof streams.$inferSelect;
export type NewStream = typeof streams.$inferInsert;
export type StreamLog = typeof streamLogs.$inferSelect;
export type NewStreamLog = typeof streamLogs.$inferInsert;
