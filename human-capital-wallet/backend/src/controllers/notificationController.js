import { query } from '../config/database.js'

export async function getAll(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.user.id]
    )
    const unread = rows.filter(n => !n.is_read).length
    res.json({ success: true, data: { notifications: rows, unread } })
  } catch (err) { next(err) }
}

export async function markRead(req, res, next) {
  try {
    const { id } = req.params
    const { rowCount } = await query(
      'UPDATE notifications SET is_read=TRUE WHERE id=$1 AND user_id=$2',
      [id, req.user.id]
    )
    if (!rowCount) return res.status(404).json({ success: false, message: 'Notification not found' })
    res.json({ success: true, message: 'Marked as read' })
  } catch (err) { next(err) }
}

export async function markAllRead(req, res, next) {
  try {
    await query('UPDATE notifications SET is_read=TRUE WHERE user_id=$1', [req.user.id])
    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (err) { next(err) }
}

export async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params
    const { rowCount } = await query(
      'DELETE FROM notifications WHERE id=$1 AND user_id=$2',
      [id, req.user.id]
    )
    if (!rowCount) return res.status(404).json({ success: false, message: 'Notification not found' })
    res.json({ success: true, message: 'Notification deleted' })
  } catch (err) { next(err) }
}
