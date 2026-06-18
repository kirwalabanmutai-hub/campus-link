import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { subscribe, mpesaStk, getHistory } from '../controllers/paymentController.js'

const router = Router()

router.use(authenticate)

router.post('/subscribe',   subscribe)
router.post('/mpesa/stk',   mpesaStk)
router.get('/history',      getHistory)

export default router
