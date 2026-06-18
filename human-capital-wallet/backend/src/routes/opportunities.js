import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import * as ctrl from '../controllers/opportunityController.js'

const router = Router()

router.get('/',          authenticate, ctrl.getAll)
router.get('/:id',       authenticate, ctrl.getById)
router.post('/',         authenticate, validate(schemas.addOpportunity), ctrl.create)
router.post('/:id/save', authenticate, ctrl.saveOpportunity)
router.delete('/:id/save', authenticate, ctrl.unsaveOpportunity)
router.post('/:id/apply',  authenticate, ctrl.apply)

export default router
