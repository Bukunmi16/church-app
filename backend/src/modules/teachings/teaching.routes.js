import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import { authorizeTeachingDepartment, authorizeTeachingDepartmentCreate } from '../../middleware/teaching.middleware.js'
import { create, getAll, getOne, update, deleteTeaching } from './teaching.controllers.js'
import upload from '../../middleware/upload.js'
import { verifyImageFile } from '../../middleware/verifyImage.middeware.js'
import { createTeachingSchema, updateTeachingSchema } from '../../validators/resource.schema.js'
import { validate } from '../../middleware/validation.middleware.js'
const router = express.Router()



router.post('/', 
    authMiddleware, 
    authorizeTeachingDepartmentCreate, 
    upload.single('thumbnail'),
    verifyImageFile,
    validate(createTeachingSchema), 
    create
)

router.get('/', getAll)

router.get('/:id', getOne)

router.post('/:id', 
    authMiddleware, 
    authorizeTeachingDepartment, 
    upload.single('thumbnail'),
    verifyImageFile,
    validate(updateTeachingSchema),
    update)

router.delete('/:id', authMiddleware, authorizeTeachingDepartment, deleteTeaching)

export default router
