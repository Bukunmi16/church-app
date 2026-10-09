import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import authorizeUserOwner from '../../middleware/userauth.middleware.js'
import { changeUserRole, changeUserStatus, deleteUser, getAllUsers, getOneUser, update, updatePassword } from './user.controller.js'
import upload from '../../middleware/upload.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/', getAllUsers)
router.patch('/me',  upload.single("profileImage"), update)
router.patch('/me/password', updatePassword)
router.get('/:id', getOneUser)
router.delete('/:id', authorize('admin'), deleteUser)
router.patch('/:id/role', authorize('admin'), changeUserRole)
router.patch('/:id/status', authorize('admin'), changeUserStatus)


export default router