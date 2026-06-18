import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import * as ctrl from '../controllers/authController.js'

const router = Router()

router.post('/register',         validate(schemas.register), ctrl.register)
router.post('/login',            validate(schemas.login),    ctrl.login)
router.get('/me',                authenticate,               ctrl.getMe)
router.post('/forgot-password',                              ctrl.forgotPassword)
router.post('/reset-password',                               ctrl.resetPassword)

export default router
