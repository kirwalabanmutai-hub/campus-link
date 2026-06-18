import 'dotenv/config'
import express from 'express'
import cors    from 'cors'
import helmet  from 'helmet'
import morgan  from 'morgan'
import rateLimit from 'express-rate-limit'

import authRoutes          from './routes/auth.js'
import profileRoutes       from './routes/profile.js'
import opportunityRoutes   from './routes/opportunities.js'
import incomeRoutes        from './routes/income.js'
import investmentRoutes    from './routes/investments.js'
import reputationRoutes    from './routes/reputation.js'
import notificationRoutes  from './routes/notifications.js'
import aiRoutes            from './routes/ai.js'
import paymentRoutes       from './routes/payments.js'
import adminRoutes         from './routes/admin.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app  = express()
const PORT = process.env.PORT || 5000

/* ── Security & parsing ── */
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

/* ── Logging ── */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
}

/* ── Rate limiting ── */
const limiter = rateLimit({
  windowMs:  15 * 60 * 1000,
  max:       300,
  message:   { success: false, message: 'Too many requests, please try again later.' },
})
const authLimiter = rateLimit({
  windowMs:  15 * 60 * 1000,
  max:       20,
  message:   { success: false, message: 'Too many auth attempts, please try again later.' },
})
app.use('/api', limiter)
app.use('/api/auth', authLimiter)

/* ── Routes ── */
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))
app.use('/api/auth',           authRoutes)
app.use('/api/profile',        profileRoutes)
app.use('/api/opportunities',  opportunityRoutes)
app.use('/api/income',         incomeRoutes)
app.use('/api/investments',    investmentRoutes)
app.use('/api/reputation',     reputationRoutes)
app.use('/api/notifications',  notificationRoutes)
app.use('/api/ai',             aiRoutes)
app.use('/api/payments',       paymentRoutes)
app.use('/api/admin',          adminRoutes)

/* ── Error handling ── */
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 HCW API running on http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
