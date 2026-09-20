import { Router } from 'express'
import { getContentList, getContentById, createContent, updateContent, deleteContent } from '../controllers/content'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', getContentList)
router.get('/:id', getContentById)
router.post('/', authenticate, createContent)
router.put('/:id', authenticate, updateContent)
router.delete('/:id', authenticate, deleteContent)

export default router