import express from 'express'
import { getCurrentUser, login, logout, refreshToken, register } from './auth.controller.js'
import upload from '../../middleware/upload.js'
import authMiddleware from '../../middleware/auth.middleware.js'
import { loginLimiter, registerLimiter, refreshLimiter } from '../../middleware/rate-limit.middleware.js'
import { validate } from '../../middleware/validation.middleware.js'
import { registerSchema, loginSchema } from '../../validators/auth.schema.js'

const router = express.Router()

router.post('/register', registerLimiter, upload.single('profileImage'), validate(registerSchema),   register)
router.post('/login', loginLimiter, validate(loginSchema), login)
router.get('/me', authMiddleware, getCurrentUser)
router.post("/refresh", refreshLimiter, refreshToken)
router.post('/logout', logout)

export default router