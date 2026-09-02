import express from 'express'
import { create, deleteEvent, getAll, getOne, update } from './event.controllers.js'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import upload from '../../middleware/upload.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/' , getAll)
router.post('/', upload.single('image'), authorize("admin"), create)
router.get('/:id', getOne)
router.post('/:id', upload.single('image'), authorize("admin"), update)
router.delete('/:id', authorize("admin"), deleteEvent)

export default router