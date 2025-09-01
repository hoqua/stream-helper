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
  email: text('email').notNull(),
  username: text('username'),
  teamId: text('team_id').unique(),
  accessToken: text('access_token').unique().notNull(),
  configurationId: text('configuration_id').unique().notNull(),
  installationId: text('installation_id').unique().notNull(),
  webhookUrl: text('webhook_url'),
  processingMode: modeEnum('processing_mode').notNull().default('realtime'),
  automaticProcessing: boolean('automatic_processing').notNull().default(false),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
});

export const streams = pgTable('streams', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Stream = typeof streams.$inferSelect;
export type NewStream = typeof streams.$inferInsert;
export type StreamLog = typeof streamLogs.$inferSelect;
export type NewStreamLog = typeof streamLogs.$inferInsert;
