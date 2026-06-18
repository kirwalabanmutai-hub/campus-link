import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import * as ctrl from '../controllers/reputationController.js'

const router = Router()

router.get('/me',             authenticate, ctrl.getMyScore)
router.get('/:id',            authenticate, ctrl.getUserScore)
router.get('/:id/reviews',    authenticate, ctrl.getReviews)
router.post('/:id/reviews',   authenticate, validate(schemas.addReview), ctrl.addReview)

export default router
