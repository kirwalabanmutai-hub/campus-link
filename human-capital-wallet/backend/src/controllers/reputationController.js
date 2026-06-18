import { v4 as uuid } from 'uuid'
import { query } from '../config/database.js'

async function recalcTrustScore(userId) {
  const { rows: reviews } = await query(
    'SELECT AVG(rating) as avg_rating, COUNT(*) as total FROM reviews WHERE to_user_id = $1',
    [userId]
  )
  const { rows: skills } = await query(
    'SELECT COUNT(*) as verified FROM skills WHERE user_id = $1 AND is_verified = true',
    [userId]
  )
  const { rows: certs } = await query(
    'SELECT COUNT(*) as verified FROM certifications WHERE user_id = $1 AND is_verified = true',
    [userId]
  )

  const reviewScore   = Math.min(100, (+reviews[0].avg_rating || 0) * 20)
  const verifyScore   = Math.min(100, (+skills[0].verified + +certs[0].verified) * 10)
  const activityScore = 75
  const overall       = Math.round((reviewScore * 0.4) + (verifyScore * 0.35) + (activityScore * 0.25))

  await query(
    `UPDATE trust_scores SET overall=$1, review_score=$2, verification_score=$3, activity_score=$4, updated_at=NOW()
     WHERE user_id=$5`,
    [overall, reviewScore, verifyScore, activityScore, userId]
  )
  return overall
}

export async function getMyScore(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM trust_scores WHERE user_id = $1', [req.user.id])
    res.json({ success: true, data: rows[0] || null })
  } catch (err) { next(err) }
}

export async function getUserScore(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM trust_scores WHERE user_id = $1', [req.params.id])
    res.json({ success: true, data: rows[0] || null })
  } catch (err) { next(err) }
}

export async function getReviews(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT r.*, u.name as from_name, u.avatar as from_avatar
       FROM reviews r JOIN users u ON u.id = r.from_user_id
       WHERE r.to_user_id = $1 ORDER BY r.created_at DESC`,
      [req.params.id]
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
}

export async function addReview(req, res, next) {
  try {
    const toUserId = req.params.id
    if (toUserId === req.user.id) return res.status(400).json({ success: false, message: 'Cannot review yourself' })

    const { rating, comment, serviceType } = req.body
    await query(
      `INSERT INTO reviews (id, from_user_id, to_user_id, rating, comment, service_type)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [uuid(), req.user.id, toUserId, rating, comment, serviceType || '']
    )
    await recalcTrustScore(toUserId)
    res.status(201).json({ success: true, message: 'Review added' })
  } catch (err) { next(err) }
}
