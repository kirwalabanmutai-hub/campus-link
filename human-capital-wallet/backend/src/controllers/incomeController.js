import { v4 as uuid } from 'uuid'
import { query } from '../config/database.js'

export async function getRecords(req, res, next) {
  try {
    const { type, category, limit = 50, page = 1 } = req.query
    const offset = (page - 1) * limit
    const params = [req.user.id]
    const where  = ['user_id = $1']

    if (type)     { params.push(type);     where.push(`type = $${params.length}`) }
    if (category) { params.push(category); where.push(`category = $${params.length}`) }

    params.push(limit, offset)
    const { rows } = await query(
      `SELECT * FROM income_records WHERE ${where.join(' AND ')}
       ORDER BY date DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
}

export async function addRecord(req, res, next) {
  try {
    const { amount, source, category, type, date, description } = req.body
    const { rows } = await query(
      `INSERT INTO income_records (id, user_id, amount, source, category, type, date, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [uuid(), req.user.id, amount, source, category, type, date, description || '']
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function updateRecord(req, res, next) {
  try {
    const { rows } = await query(
      `UPDATE income_records SET amount=$1, source=$2, category=$3, type=$4, date=$5, description=$6
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [req.body.amount, req.body.source, req.body.category, req.body.type,
       req.body.date, req.body.description, req.params.id, req.user.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, message: 'Record not found' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function deleteRecord(req, res, next) {
  try {
    await query('DELETE FROM income_records WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id])
    res.json({ success: true, message: 'Record deleted' })
  } catch (err) { next(err) }
}

export async function getSummary(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT
        SUM(CASE WHEN type='income'  THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS total_expenses,
        SUM(CASE WHEN type='income'  THEN amount ELSE -amount END) AS net_savings
       FROM income_records WHERE user_id = $1`,
      [req.user.id]
    )
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}
