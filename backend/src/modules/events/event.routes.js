import express from 'express'
import { create, deleteEvent, getAll, getOne, update } from './event.controllers.js'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import upload from '../../middleware/upload.js'

const router = express.Router()


router.get('/' , getAll)
router.post('/', upload.single('image'), authMiddleware, authorize("admin"), create)
router.get('/:id',authMiddleware, getOne)
router.post('/:id', upload.single('image'), authMiddleware, authorize("admin"), update)
router.delete('/:id',authMiddleware, authorize("admin"), deleteEvent)

export default router