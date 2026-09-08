import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import { countUnreadNotifications, getNotifications, readAllNotifications, readNotification, removeNotification } from './notification.controllers.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getNotifications)
router.get('/unread-count', countUnreadNotifications)
router.patch('/read-all', readAllNotifications)
router.patch('/:id/read', readNotification)
router.delete('/:id', removeNotification)

export default router         