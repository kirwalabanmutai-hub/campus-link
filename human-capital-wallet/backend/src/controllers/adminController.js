import { query } from '../config/database.js'

export async function getStats(req, res, next) {
  try {
    const [users, opportunities, payments, subs] = await Promise.all([
      query('SELECT COUNT(*) as total FROM users'),
      query('SELECT COUNT(*) as total FROM opportunities'),
      query("SELECT SUM(amount) as total FROM payments WHERE status='completed'"),
      query("SELECT COUNT(*) as total FROM subscriptions WHERE status='active'"),
    ])
    res.json({
      success: true,
      data: {
        users:         parseInt(users.rows[0].total),
        opportunities: parseInt(opportunities.rows[0].total),
        revenue:       parseFloat(payments.rows[0].total || 0),
        subscriptions: parseInt(subs.rows[0].total),
      },
    })
  } catch (err) { next(err) }
}

export async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, role, search } = req.query
    const offset = (page - 1) * limit
    const params = []
    const where  = []

    if (role)   { params.push(role);       where.push(`role = $${params.length}`) }
    if (search) { params.push(`%${search}%`); where.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length})`) }

    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : ''
    params.push(limit, offset)

    const { rows } = await query(
      `SELECT id, name, email, role, is_verified, is_suspended, created_at
       FROM users ${whereClause} ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
}

export async function updateUserRole(req, res, next) {
  try {
    await query('UPDATE users SET role=$1 WHERE id=$2', [req.body.role, req.params.id])
    res.json({ success: true, message: 'Role updated' })
  } catch (err) { next(err) }
}

export async function suspendUser(req, res, next) {
  try {
    await query('UPDATE users SET is_suspended = NOT is_suspended WHERE id=$1', [req.params.id])
    res.json({ success: true, message: 'User status toggled' })
  } catch (err) { next(err) }
}

export async function getOpportunities(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT * FROM opportunities ORDER BY created_at DESC LIMIT 50'
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
}

export async function approveOpportunity(req, res, next) {
  try {
    await query("UPDATE opportunities SET status='approved' WHERE id=$1", [req.params.id])
    res.json({ success: true, message: 'Opportunity approved' })
  } catch (err) { next(err) }
}

export async function getPayments(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT p.*, u.name as user_name, u.email as user_email
       FROM payments p JOIN users u ON u.id = p.user_id
       ORDER BY p.created_at DESC LIMIT 100`
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
}

export async function getReports(req, res, next) {
  try {
    const [usersByRole, revenueByMonth] = await Promise.all([
      query('SELECT role, COUNT(*) as count FROM users GROUP BY role'),
      query(`SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(amount) as revenue
             FROM payments WHERE status='completed' GROUP BY month ORDER BY month DESC LIMIT 12`),
    ])
    res.json({ success: true, data: { usersByRole: usersByRole.rows, revenueByMonth: revenueByMonth.rows } })
  } catch (err) { next(err) }
}
