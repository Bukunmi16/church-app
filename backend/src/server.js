import express from 'express'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import authRoutes from './modules/auth/auth.routes.js'
import userRoutes from './modules/user/user.routes.js'
import departmentRoutes from './modules/departments/department.routes.js'
import serviceRoutes from './modules/services/service.routes.js'
import eventRoutes from './modules/events/event.routes.js'
import teachingSeriesRoutes from './modules/teachingSeries/teaching-series.routes.js'
import teachingRoutes from './modules/teachings/teaching.routes.js'
import uploadRoutes from './modules/upload.js' 

const PORT = 3000
dotenv.config()

const app = express()


app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/teaching', teachingRoutes)
app.use('/api/teaching-series', teachingSeriesRoutes)
app.use('/api/upload', uploadRoutes)


connectDB().then(() => {
    app.listen(PORT, () =>{
        console.log(`Server running on PORT ${PORT}`);  
    }) 
    })