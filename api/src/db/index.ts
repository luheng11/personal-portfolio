import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { content, setting, tag, adminUser } from '../schemas'
import { sqliteUrl } from '../paths'

const client = createClient({
  url: sqliteUrl()
})

export const db = drizzle(client, { schema: { content, setting, tag, adminUser } })
