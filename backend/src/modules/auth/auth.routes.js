import express from 'express'
import { getCurrentUser, login, logout, refreshToken, register } from './auth.controller.js'
import upload from '../../middleware/upload.js'
import authMiddleware from '../../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', upload.single('profileImage'), register)
router.post('/login', login)
router.get('/me', authMiddleware, getCurrentUser)
router.post("/refresh", refreshToken)
router.post('/logout', logout)

export default router