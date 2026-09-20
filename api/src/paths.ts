import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config()

const srcDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(srcDir, '../..')

export function getDbPath() {
  return path.resolve(process.env.DATABASE_PATH || path.join(repoRoot, 'database.sqlite'))
}

export function getUploadDir() {
  return path.resolve(process.env.UPLOAD_DIR || path.join(repoRoot, 'uploads'))
}

export function sqliteUrl(filePath = getDbPath()) {
  const normalized = path.resolve(filePath).replace(/\\/g, '/')
  return normalized.startsWith('/') ? `file:${normalized}` : `file:///${normalized}`
}
