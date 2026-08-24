import express from 'express'
import { create, deleteService, getAll, getOne, update } from './service.controllers.js'
import authorize from '../../middleware/role.middleware.js'
import authMiddleware from '../../middleware/auth.middleware.js'

const router = express.Router()

router.post('/', authMiddleware, authorize('admin'), create)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/:id', authMiddleware, authorize('admin'), update)
router.delete('/:id', authMiddleware, authorize('admin'), deleteService)

export default router