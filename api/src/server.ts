import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'

import authRoutes from './routes/auth'
import contentRoutes from './routes/content'
import tagRoutes from './routes/tags'
import settingRoutes from './routes/settings'
import mediaRoutes from './routes/media'
import { getUploadDir } from './paths'

dotenv.config()

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is required in production')
    process.exit(1)
  }
  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD is required in production')
    process.exit(1)
  }
}

const app = express()
const PORT = process.env.PORT || 3001

const uploadDir = getUploadDir()
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(uploadDir))

app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/settings', settingRoutes)
app.use('/api/media', mediaRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
