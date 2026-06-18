import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { getAll, markRead, markAllRead, deleteNotification } from '../controllers/notificationController.js'

const router = Router()

router.use(authenticate)

router.get('/',              getAll)
router.put('/read-all',      markAllRead)
router.put('/:id/read',      markRead)
router.delete('/:id',        deleteNotification)

export default router
