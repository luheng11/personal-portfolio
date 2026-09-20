import { Router } from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth'
import { getUploadDir } from '../paths'
import fs from 'fs'

const router = Router()

const uploadDir = getUploadDir()
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

const upload = multer({ storage })

router.post('/upload', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  
  res.json({
    url: `/uploads/${req.file.filename}`
  })
})

export default router