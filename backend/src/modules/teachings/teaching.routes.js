import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import { authorizeTeachingDepartment, authorizeTeachingDepartmentCreate } from '../../middleware/teaching.middleware.js'
import { create, getAll, getOne, update, deleteTeaching } from './teaching.controllers.js'
import upload from '../../middleware/upload.js'
const router = express.Router()



router.post('/', upload.single('thumbnail'), authMiddleware, authorizeTeachingDepartmentCreate, create)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/:id', upload.single('thumbnail'), authMiddleware, authorizeTeachingDepartment, update)
router.delete('/:id', authMiddleware, authorizeTeachingDepartment, deleteTeaching)

export default router
