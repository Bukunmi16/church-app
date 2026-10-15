import express from 'express'
import { create, deleteService, getAll, getOne, update } from './service.controllers.js'
import authorize from '../../middleware/role.middleware.js'
import authMiddleware from '../../middleware/auth.middleware.js'
import upload from '../../middleware/upload.js'
import { verifyImageFile } from '../../middleware/verifyImage.middeware.js'
import { validate } from '../../middleware/validation.middleware.js'
import { createServiceSchema, updateServiceSchema } from '../../validators/resource.schema.js'

const router = express.Router()

router.post('/', 
    authMiddleware, 
    authorize('admin'), 
    upload.single("serviceImage"),
    verifyImageFile,
    validate(createServiceSchema),
    create
)

router.get('/', getAll)

router.get('/:id', getOne)

router.post('/:id', 
    authMiddleware, 
    authorize('admin'), 
    upload.single("serviceImage"), 
    verifyImageFile,
    validate(updateServiceSchema),
    update
)

router.delete('/:id', authMiddleware, authorize('admin'), deleteService)

export default router