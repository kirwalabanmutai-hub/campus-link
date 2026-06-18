import { v4 as uuid } from 'uuid'
import { query } from '../config/database.js'

export async function getAll(req, res, next) {
  try {
    const { type, search, limit = 20, page = 1 } = req.query
    const offset = (page - 1) * limit
    const params = []
    let where = []

    if (type && type !== 'all') { params.push(type); where.push(`o.type = $${params.length}`) }
    if (search) { params.push(`%${search}%`); where.push(`(o.title ILIKE $${params.length} OR o.provider ILIKE $${params.length})`) }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : ''
    params.push(limit, offset)

    const { rows } = await query(
      `SELECT o.*,
        (SELECT COUNT(*) FROM applications a WHERE a.opportunity_id = o.id) AS applicants,
        EXISTS(SELECT 1 FROM saved_opportunities s WHERE s.opportunity_id = o.id AND s.user_id = $${params.length + 1}) AS is_saved,
        EXISTS(SELECT 1 FROM applications a WHERE a.opportunity_id = o.id AND a.user_id = $${params.length + 1}) AS has_applied
       FROM opportunities o ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      [...params, req.user?.id || null]
    )

    const total = await query(`SELECT COUNT(*) FROM opportunities o ${whereClause}`, params.slice(0, -2))

    res.json({
      success: true,
      data: rows,
      pagination: { total: parseInt(total.rows[0].count), page: +page, limit: +limit, pages: Math.ceil(total.rows[0].count / limit) },
    })
  } catch (err) { next(err) }
}

export async function getById(req, res, next) {
  try {
    const { rows } = await query('SELECT * FROM opportunities WHERE id = $1', [req.params.id])
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function create(req, res, next) {
  try {
    const { title, description, type, location, deadline, compensation, requirements = [], tags = [] } = req.body
    const { rows } = await query(
      `INSERT INTO opportunities (id, title, description, type, provider, provider_id, location, deadline, compensation, requirements, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [uuid(), title, description, type, req.user.name, req.user.id, location, deadline, compensation, requirements, tags]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function saveOpportunity(req, res, next) {
  try {
    await query(
      'INSERT INTO saved_opportunities (id, user_id, opportunity_id) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [uuid(), req.user.id, req.params.id]
    )
    res.json({ success: true, message: 'Opportunity saved' })
  } catch (err) { next(err) }
}

export async function unsaveOpportunity(req, res, next) {
  try {
    await query('DELETE FROM saved_opportunities WHERE user_id=$1 AND opportunity_id=$2', [req.user.id, req.params.id])
    res.json({ success: true, message: 'Opportunity unsaved' })
  } catch (err) { next(err) }
}

export async function apply(req, res, next) {
  try {
    const exists = await query(
      'SELECT id FROM applications WHERE user_id=$1 AND opportunity_id=$2',
      [req.user.id, req.params.id]
    )
    if (exists.rows.length) return res.status(409).json({ success: false, message: 'Already applied' })
    await query(
      'INSERT INTO applications (id, user_id, opportunity_id, cover_letter) VALUES ($1,$2,$3,$4)',
      [uuid(), req.user.id, req.params.id, req.body.coverLetter || '']
    )
    res.status(201).json({ success: true, message: 'Application submitted' })
  } catch (err) { next(err) }
}
