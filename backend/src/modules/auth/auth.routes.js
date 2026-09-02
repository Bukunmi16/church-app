import express from 'express'
import { login, register } from './auth.controller.js'
import upload from '../../middleware/upload.js'

const route = express.Router()

route.post('/register', upload.single('profileImage'), register)
route.post('/login', login)

export default route