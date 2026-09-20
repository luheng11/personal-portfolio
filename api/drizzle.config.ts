import { defineConfig } from 'drizzle-kit'

const dbFile = (process.env.DATABASE_PATH || '../database.sqlite').replace(/\\/g, '/')

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schemas/index.ts',
  dbCredentials: {
    url: dbFile.startsWith('file:') ? dbFile : `file:${dbFile}`,
  },
  out: './drizzle',
})
