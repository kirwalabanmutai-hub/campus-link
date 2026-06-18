import bcrypt from 'bcryptjs'
import jwt    from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { query } from '../config/database.js'

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role = 'user' } = req.body

    const existing = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    const hash = await bcrypt.hash(password, 12)
    const { rows } = await query(
      `INSERT INTO users (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, is_verified, created_at`,
      [uuid(), name, email, hash, role]
    )

    await query(
      'INSERT INTO profiles (id, user_id) VALUES ($1, $2)',
      [uuid(), rows[0].id]
    )
    await query(
      'INSERT INTO trust_scores (id, user_id) VALUES ($1, $2)',
      [uuid(), rows[0].id]
    )

    res.status(201).json({
      success: true,
      data: { user: rows[0], token: signToken(rows[0].id) },
    })
  } catch (err) { next(err) }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const { rows } = await query(
      'SELECT id, name, email, role, password_hash, is_verified FROM users WHERE email = $1',
      [email]
    )
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }
    const user = { ...rows[0] }
    delete user.password_hash

    res.json({ success: true, data: { user, token: signToken(user.id) } })
  } catch (err) { next(err) }
}

export async function getMe(req, res) {
  res.json({ success: true, data: req.user })
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    const { rows } = await query('SELECT id FROM users WHERE email = $1', [email])
    if (!rows.length) {
      return res.json({ success: true, message: 'If that email exists, a reset link was sent.' })
    }
    const token   = uuid()
    const expires = new Date(Date.now() + 3600000)
    await query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
      [token, expires, rows[0].id]
    )
    res.json({ success: true, message: 'Password reset email sent.' })
  } catch (err) { next(err) }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body
    const { rows } = await query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    )
    if (!rows.length) return res.status(400).json({ success: false, message: 'Invalid or expired token' })

    const hash = await bcrypt.hash(password, 12)
    await query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [hash, rows[0].id]
    )
    res.json({ success: true, message: 'Password updated successfully.' })
  } catch (err) { next(err) }
}
