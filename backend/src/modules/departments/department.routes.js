import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import { create, getAll, getOne, update, deleteDepartment, assignLeader, assignWorker, removeWorker, removeAssistant, assignAssistant } from './department.controller.js'
import authorizeDepartmentLeader from '../../middleware/department.middleware.js'
import upload from '../../middleware/upload.js'
import { validate } from '../../middleware/validation.middleware.js'
import { createDepartmentSchema, updateDepartmentSchema } from '../../validators/resource.schema.js'
import { verifyImageFile } from '../../middleware/verifyImage.middeware.js'


const router = express.Router()

router.use(authMiddleware)

router.post('/', 
    authorize("admin"), 
    upload.single("image"), 
    verifyImageFile,
    validate(createDepartmentSchema), 
    create
)

router.get('/', getAll)

router.get('/:id', getOne)

router.post('/:id', 
    authorize("admin"),
    upload.single("image"),
    verifyImageFile,
    validate(updateDepartmentSchema),
    update
)

router.delete('/:id', authorize("admin"), deleteDepartment)

// Relationships
router.patch('/:id/leader', authorize("admin"), assignLeader)

router.post('/:id/worker', authorize("admin"), assignWorker)

router.post('/:id/assistant', authorizeDepartmentLeader, assignAssistant)

router.delete('/:id/worker/:userId', authorize("admin"), removeWorker)

router.delete('/:id/assistant/:userId', authorizeDepartmentLeader, removeAssistant)

export default router   