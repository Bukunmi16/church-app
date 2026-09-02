import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import { create, getAll, getOne, update, deleteDepartment, assignLeader, assignWorker, removeWorker, removeAssistant, assignAssistant } from './department.controller.js'
import authorizeDepartmentLeader from '../../middleware/department.middleware.js'
import upload from '../../middleware/upload.js'


const router = express.Router()

router.use(authMiddleware)

router.post('/', upload.single("image"), authorize("admin"), create)
router.get('/', authorize("admin"), getAll)
router.get('/:id',authorize("admin"), getOne)
router.patch('/:id', upload.single("image"), authorize("admin"), update)
router.delete('/:id', authorize("admin"), deleteDepartment)

// Relationships
router.patch('/:id/leader', authorize("admin"), assignLeader)
router.post('/:id/worker', authorize("admin"), assignWorker)
router.post('/:id/assistant', authorizeDepartmentLeader, assignAssistant)
router.delete('/:id/worker/:userId', authorize("admin"), removeWorker)
router.delete('/:id/assistant/:userId', authorizeDepartmentLeader, removeAssistant)

export default router   