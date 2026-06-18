import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate, schemas } from '../middleware/validate.js'
import {
  getMyProfile, getPublicProfile, updateProfile,
  addSkill, deleteSkill,
  addEducation, addExperience, addCertification, addProject,
  uploadAvatar,
} from '../controllers/profileController.js'

const router = Router()

router.use(authenticate)

router.get('/me',                    getMyProfile)
router.get('/:id',                   getPublicProfile)
router.put('/',  validate(schemas.updateProfile), updateProfile)

router.post('/skills',               validate(schemas.addSkill), addSkill)
router.delete('/skills/:id',         deleteSkill)

router.post('/education',            addEducation)
router.post('/experience',           addExperience)
router.post('/certifications',       addCertification)
router.post('/projects',             addProject)

router.post('/avatar',               uploadAvatar)

export default router
