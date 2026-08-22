import express from 'express'
import { login, register } from './auth.controller.js'


const route = express.Router()

route.post('/register', register)
route.post('/login', login)

export default route