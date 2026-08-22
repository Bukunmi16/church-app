import express from 'express'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/user/user.routes.js'
import departmentRoutes from './modules/departments/department.routes.js'

const PORT = 3000
dotenv.config()

const app = express()


app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/departments', departmentRoutes)


connectDB().then(() => {
    app.listen(PORT, () =>{
        console.log(`Server running on PORT ${PORT}`);  
    }) 
    })