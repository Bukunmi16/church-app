import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import { create, getAll, getOne, update, deleteTeaching } from './teaching.controllers.js'
const router = express.Router()

router.post('/', create)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/:id', update)
router.delete('/:id', deleteTeaching)

export default router