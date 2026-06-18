import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getAll, getById, add, update, remove, calcROI } from '../controllers/investmentController.js'

const router = Router()

router.use(authenticate)

router.get('/',                getAll)
router.post('/calculate-roi',  calcROI)
router.get('/:id',             getById)
router.post('/',               add)
router.put('/:id',             update)
router.delete('/:id',          remove)

export default router
