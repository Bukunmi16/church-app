import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import {create, getAll, getOne, update, deleteSeries} from './teaching-series.controllers.js'
import upload from '../../middleware/upload.js'
import { verifyImageFile } from '../../middleware/verifyImage.middeware.js'
import { validate } from '../../middleware/validation.middleware.js'
import { createTeachingSeriesSchema, updateTeachingSeriesSchema } from '../../validators/resource.schema.js'


const router = express.Router()

// router.use(authMiddleware)

router.post('/', 
    authMiddleware, 
    authorize("admin"), 
    upload.single("thumbnail"), 
    verifyImageFile,
    validate(createTeachingSeriesSchema),
    create
)

router.get('/', getAll)

router.get('/:id', getOne)

router.post('/:id', 
    authMiddleware, 
    authorize("admin"), 
    upload.single("thumbnail"), 
    verifyImageFile,
    validate(updateTeachingSeriesSchema),
    update
)

router.delete('/:id', authMiddleware, authorize("admin"), deleteSeries)

export default router