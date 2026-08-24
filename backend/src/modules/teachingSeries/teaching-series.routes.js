import express from 'express'
import authMiddleware from '../../middleware/auth.middleware.js'
import authorize from '../../middleware/role.middleware.js'
import {create, getAll, getOne, update, deleteSeries} from './teaching-series.controllers.js'

const router = express.Router()

// router.use(authMiddleware)

router.post('/', authMiddleware, authorize("admin"), create)
router.get('/', getAll)
router.get('/:id', getOne)
router.post('/:id', authMiddleware, authorize("admin"), update)
router.delete('/:id', authMiddleware, authorize("admin"), deleteSeries)

export default router