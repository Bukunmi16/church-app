import express from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'
import authorize from '../../middleware/roleMiddleware.js'
import { create, getAll, getOne, update, deleteDepartment } from './department.controller.js'



const router = express.Router()

router.post('/', authMiddleware, authorize("admin"), create)
router.get('/', authMiddleware, authorize("admin"), getAll)
router.get('/:id',authMiddleware, authorize("admin"), getOne)
router.patch('/:id', authMiddleware, authorize("admin"), update)
router.delete('/:id', authMiddleware, authorize("admin"), deleteDepartment)

// Relationships
router.patch('/:id/leader', authMiddleware, authorize("admin"), assignLeader)

export default router