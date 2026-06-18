import { v4 as uuid } from 'uuid'
import { query } from '../config/database.js'

export async function getAll(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT * FROM investments WHERE user_id=$1 ORDER BY created_at DESC',
      [req.user.id]
    )
    const totalInvested = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0)
    const totalValue    = rows.reduce((sum, r) => sum + Number(r.current_value || 0), 0)
    const overallROI    = totalInvested > 0
      ? (((totalValue - totalInvested) / totalInvested) * 100).toFixed(2)
      : 0

    res.json({ success: true, data: { investments: rows, totalInvested, totalValue, overallROI } })
  } catch (err) { next(err) }
}

export async function getById(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT * FROM investments WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, message: 'Investment not found' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function add(req, res, next) {
  try {
    const { name, type, amount, current_value, risk_level, start_date } = req.body
    const roi = amount && current_value
      ? (((current_value - amount) / amount) * 100).toFixed(2)
      : 0
    const { rows } = await query(
      `INSERT INTO investments (id, user_id, name, type, amount, current_value, roi, risk_level, start_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [uuid(), req.user.id, name, type ?? null, amount, current_value ?? amount,
       roi, risk_level ?? 'medium', start_date ?? null]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function update(req, res, next) {
  try {
    const { name, type, amount, current_value, risk_level } = req.body
    const roi = amount && current_value
      ? (((current_value - amount) / amount) * 100).toFixed(2)
      : null
    const { rows } = await query(
      `UPDATE investments
         SET name=$1, type=$2, amount=$3, current_value=$4, roi=$5, risk_level=$6
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [name, type ?? null, amount, current_value, roi, risk_level ?? 'medium',
       req.params.id, req.user.id]
    )
    if (!rows.length) return res.status(404).json({ success: false, message: 'Investment not found' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function remove(req, res, next) {
  try {
    const { rowCount } = await query(
      'DELETE FROM investments WHERE id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    )
    if (!rowCount) return res.status(404).json({ success: false, message: 'Investment not found' })
    res.json({ success: true, message: 'Investment removed' })
  } catch (err) { next(err) }
}

export async function calcROI(req, res, next) {
  try {
    const { amount, current_value, months } = req.body
    if (!amount || !current_value) {
      return res.status(400).json({ success: false, message: 'amount and current_value are required' })
    }
    const roi           = (((current_value - amount) / amount) * 100).toFixed(2)
    const annualizedROI = months
      ? ((Math.pow(current_value / amount, 12 / months) - 1) * 100).toFixed(2)
      : null

    res.json({ success: true, data: { roi: Number(roi), annualizedROI: annualizedROI ? Number(annualizedROI) : null, profit: current_value - amount } })
  } catch (err) { next(err) }
}
