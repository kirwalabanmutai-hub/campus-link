import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import {
  getCareerMatch, getSkillGap, getRoadmap,
  getResumeAdvice, getInterviewPrep,
} from '../controllers/aiController.js'

const router = Router()

router.use(authenticate)

router.get('/career-match',     getCareerMatch)
router.get('/skill-gap',        getSkillGap)
router.get('/roadmap',          getRoadmap)
router.post('/resume-advice',   getResumeAdvice)
router.post('/interview-prep',  getInterviewPrep)

export default router
