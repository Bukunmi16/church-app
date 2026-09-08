import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import { sendEmail } from './email.service.js'

const router = express.Router()

router.use(authMiddleware)

router.get('/test-email', async (req, res, next) => {
    try {
        await sendEmail({
            to: "bukunmiadigun14@gmail.com",
            subject: "Test Email",
            html: "<h1>Hello, World!</h1><p>This is a test email.</p>"
        })

        res.status(200).json({ message: "Email sent successfully" })
    } catch (error) {
        next(error)
    }
})


export default router