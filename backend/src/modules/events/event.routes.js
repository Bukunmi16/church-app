import express from 'express'
import { create, deleteEvent, getAll, getOne, update } from './event.controllers.js'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import upload from '../../middleware/upload.js'
import { verifyImageFile } from '../../middleware/verifyImage.middeware.js'
import { validate } from '../../middleware/validation.middleware.js'
import { createEventSchema, updateEventSchema } from '../../validators/resource.schema.js'

const router = express.Router()


router.get('/' , getAll)
router.post('/',  
    authMiddleware, 
    authorize("admin"), 
    upload.single('image'), 
    verifyImageFile, 
    validate(createEventSchema),
     create)

router.get('/:id'   , getOne)

router.post('/:id', 
    authMiddleware, 
    authorize("admin"), 
    upload.single('image'),
    verifyImageFile,
    validate(updateEventSchema), 
    update)

router.delete('/:id',authMiddleware, authorize("admin"), deleteEvent)

export default router