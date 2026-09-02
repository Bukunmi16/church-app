import express from 'express'
import { create, deleteService, getAll, getOne, update } from './service.controllers.js'
import authorize from '../../middleware/role.middleware.js'
import authMiddleware from '../../middleware/auth.middleware.js'
import upload from '../../middleware/upload.js'

const router = express.Router()

router.post('/', upload.single("serviceImage"), authMiddleware, authorize('admin'), create)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/:id', upload.single("serviceImage"), authMiddleware, authorize('admin'), update)
router.delete('/:id', authMiddleware, authorize('admin'), deleteService)

export default router