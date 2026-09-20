import { Router } from 'express'
import { getSettings, getSetting, updateSetting } from '../controllers/settings'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', getSettings)
router.get('/:key', getSetting)
router.put('/:key', authenticate, updateSetting)

export default router