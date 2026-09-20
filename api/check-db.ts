import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { content } from './src/schemas'

async function main() {
  const client = createClient({ url: 'file:../database.sqlite' })
  const db = drizzle(client)
  const data = await db.select().from(content)
  console.log('Content:', JSON.stringify(data, null, 2))
}

main().catch(console.error)