import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import * as ctrl from '../controllers/adminController.js'

const router = Router()

router.use(authenticate, authorize('admin'))

router.get('/stats',                       ctrl.getStats)
router.get('/users',                       ctrl.getUsers)
router.put('/users/:id/role',              ctrl.updateUserRole)
router.put('/users/:id/suspend',           ctrl.suspendUser)
router.get('/opportunities',               ctrl.getOpportunities)
router.put('/opportunities/:id/approve',   ctrl.approveOpportunity)
router.get('/payments',                    ctrl.getPayments)
router.get('/reports',                     ctrl.getReports)

export default router
