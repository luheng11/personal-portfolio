import { Router } from 'express'
import { login, me, changePassword } from '../controllers/auth'

const router = Router()

router.post('/login', login)
router.get('/me', me)
router.post('/change-password', changePassword)

export default router