import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import * as ctrl from '../controllers/incomeController.js'

const router = Router()

router.get('/',         authenticate, ctrl.getRecords)
router.post('/',        authenticate, validate(schemas.addIncomeRecord), ctrl.addRecord)
router.put('/:id',      authenticate, ctrl.updateRecord)
router.delete('/:id',   authenticate, ctrl.deleteRecord)
router.get('/summary',  authenticate, ctrl.getSummary)

export default router
