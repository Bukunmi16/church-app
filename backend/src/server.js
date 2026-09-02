import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { connectDB } from './config/db.js'
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/user/user.routes.js'
import departmentRoutes from './modules/departments/department.routes.js'
import serviceRoutes from './modules/services/service.routes.js'
import eventRoutes from './modules/events/event.routes.js'
import teachingSeriesRoutes from './modules/teachingSeries/teaching-series.routes.js'
import teachingRoutes from './modules/teachings/teaching.routes.js'

const PORT = 3000

const app = express()


app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/teaching', teachingRoutes)
app.use('/api/teaching-series', teachingSeriesRoutes)


connectDB().then(() => {
    app.listen(PORT, () =>{
        console.log(`Server running on PORT ${PORT}`);  
    }) 
    })