import express from 'express'
import authMiddleware from '../../middleware/authMiddleware.js'
import authorize from '../../middleware/roleMiddleware.js'
import { changeUserRole, changeUserStatus, deleteUser, getAllUsers, getOneUser } from './user.controller.js'

const router = express.Router()

router.get('/', authMiddleware, authorize('admin'), getAllUsers)
router.get('/:id', authMiddleware, authorize('admin'), getOneUser)
router.delete('/:id', authMiddleware, authorize('admin'), deleteUser)
router.patch('/:id/role', authMiddleware, authorize('admin'), changeUserRole)
router.patch('/:id/status', authMiddleware, authorize('admin'), changeUserStatus)


export default router