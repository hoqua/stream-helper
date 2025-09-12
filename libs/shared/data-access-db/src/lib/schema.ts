import { boolean, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core';

export const modeEnum = pgEnum('mode', ['realtime', 'batch', 'daily']);
export const streamStatusEnum = pgEnum('stream_status', [
  'active',
  'completed',
  'error',
  'stopped',
]);

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email'),
  teamId: text('teamId'),
  username: text('username'),
});

export const organizations = pgTable('organizations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  providerId: text('providerId').unique().notNull(),
  accessToken: text('access_token').unique(),
  configurationId: text('configuration_id').unique(),
  installationId: text('installation_id').unique(),
});

export const userOrganizations = pgTable(
  'user_organizations',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    orgId: text('org_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.orgId] })],
);

export const apiKeys = pgTable('api_keys', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: text('key').notNull().unique(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('Api Key'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revoked: boolean('revoked').default(false).notNull(),
});

export const projects = pgTable('projects', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orgId: text('orgId')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
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
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Stream = typeof streams.$inferSelect;
export type NewStream = typeof streams.$inferInsert;
export type StreamLog = typeof streamLogs.$inferSelect;
export type NewStreamLog = typeof streamLogs.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
