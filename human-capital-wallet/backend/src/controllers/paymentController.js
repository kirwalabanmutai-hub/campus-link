import { v4 as uuid } from 'uuid'
import { query } from '../config/database.js'

const PLANS = {
  free:      { price: 0,    currency: 'KES', features: ['Basic profile', '5 applications/month', 'Community access'] },
  pro:       { price: 999,  currency: 'KES', features: ['Full profile', 'Unlimited applications', 'AI career coach', 'Priority support'] },
  recruiter: { price: 2999, currency: 'KES', features: ['Post unlimited jobs', 'Applicant tracking', 'Analytics dashboard', 'Bulk messaging'] },
}

export async function subscribe(req, res, next) {
  try {
    const { plan } = req.body
    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Choose: free, pro, recruiter' })
    }

    await query(
      `UPDATE subscriptions SET status='cancelled' WHERE user_id=$1 AND status='active'`,
      [req.user.id]
    )

    const endsAt = plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const { rows } = await query(
      `INSERT INTO subscriptions (id, user_id, plan, status, ends_at)
       VALUES ($1,$2,$3,'active',$4) RETURNING *`,
      [uuid(), req.user.id, plan, endsAt]
    )

    if (PLANS[plan].price > 0) {
      await query(
        `INSERT INTO payments (id, user_id, amount, currency, type, status, provider)
         VALUES ($1,$2,$3,'KES','subscription','pending','manual')`,
        [uuid(), req.user.id, PLANS[plan].price]
      )
    }

    res.status(201).json({
      success: true,
      data: { subscription: rows[0], plan: { ...PLANS[plan], name: plan } },
    })
  } catch (err) { next(err) }
}

export async function mpesaStk(req, res, next) {
  try {
    const { phone, amount, description } = req.body
    if (!phone || !amount) {
      return res.status(400).json({ success: false, message: 'phone and amount are required' })
    }

    const paymentId  = uuid()
    const providerRef = `HCW-${Date.now()}`

    const { rows } = await query(
      `INSERT INTO payments (id, user_id, amount, currency, type, status, provider, provider_ref, metadata)
       VALUES ($1,$2,$3,'KES','mpesa','pending','mpesa',$4,$5) RETURNING *`,
      [paymentId, req.user.id, amount, providerRef, JSON.stringify({ phone, description: description ?? 'HCW Payment' })]
    )

    res.status(202).json({
      success: true,
      message: 'STK push initiated. Check your phone to complete payment.',
      data: { paymentId: rows[0].id, providerRef, status: 'pending' },
    })
  } catch (err) { next(err) }
}

export async function getHistory(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT * FROM payments WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    )
    const total = rows
      .filter(p => p.status === 'completed')
      .reduce((s, p) => s + Number(p.amount), 0)

    res.json({ success: true, data: { payments: rows, totalPaid: total } })
  } catch (err) { next(err) }
}
