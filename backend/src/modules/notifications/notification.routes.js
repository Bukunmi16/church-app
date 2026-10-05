import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import { countUnreadNotifications, getNotifications, readAllNotifications, readNotification, removeManyNotifications, removeNotification, viewNotification } from './notification.controllers.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getNotifications)
router.get('/unread-count', countUnreadNotifications)
router.delete('/bulk', removeManyNotifications)
router.get('/:id', viewNotification)
router.patch('/read-all', readAllNotifications)
router.patch('/:id/read', readNotification)
router.delete('/:id', removeNotification)

export default router         