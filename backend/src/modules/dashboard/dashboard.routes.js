import express from 'express'
import { getAdminDashboard, getMemberDashboard, getWorkerDashboard } from './dashboard.controller.js'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'

const router = express.Router()

router.get('/admin', authMiddleware, authorize('admin'), getAdminDashboard)
router.get('/worker', authMiddleware, authorize('worker'), getWorkerDashboard)
router.get('/member', authMiddleware, authorize('member'), getMemberDashboard)

export default router