import jwt from 'jsonwebtoken'
import { query } from '../config/database.js'

export async function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }
  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await query('SELECT id, name, email, role, is_verified FROM users WHERE id = $1', [decoded.id])
    if (!rows.length) return res.status(401).json({ success: false, message: 'User not found' })
    req.user = rows[0]
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' })
    }
    next()
  }
}
