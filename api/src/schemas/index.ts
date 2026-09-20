import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const content = sqliteTable('content', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  type: text('type').notNull(),
  cover: text('cover'),
  summary: text('summary'),
  content: text('content'),
  tags: text('tags'),
  publish_time: text('publish_time'),
  is_featured: integer('is_featured').default(0),
  status: text('status').default('draft'),
  sort_order: integer('sort_order').default(0),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
})

export const setting = sqliteTable('setting', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull(),
  value: text('value'),
  description: text('description')
})

export const tag = sqliteTable('tag', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  color: text('color').default('#D4A574'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
})

export const adminUser = sqliteTable('admin_user', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  password: text('password').notNull(),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP')
})