import { Router } from 'express'
import { getTags, createTag, updateTag, deleteTag } from '../controllers/tags'
import { authenticate } from '../middleware/auth'

const router = Router()

router.get('/', getTags)
router.post('/', authenticate, createTag)
router.put('/:id', authenticate, updateTag)
router.delete('/:id', authenticate, deleteTag)

export default router