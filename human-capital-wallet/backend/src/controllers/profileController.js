import { v4 as uuid } from 'uuid'
import { query } from '../config/database.js'

export async function getMyProfile(req, res, next) {
  try {
    const userId = req.user.id
    const { rows: profiles } = await query(
      'SELECT * FROM profiles WHERE user_id = $1', [userId]
    )
    const { rows: skills } = await query(
      'SELECT * FROM skills WHERE user_id = $1 ORDER BY created_at DESC', [userId]
    )
    const { rows: education } = await query(
      'SELECT * FROM education WHERE user_id = $1 ORDER BY start_year DESC', [userId]
    )
    const { rows: experience } = await query(
      'SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC', [userId]
    )
    const { rows: certifications } = await query(
      'SELECT * FROM certifications WHERE user_id = $1 ORDER BY issue_date DESC', [userId]
    )
    const { rows: projects } = await query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [userId]
    )

    res.json({
      success: true,
      data: {
        user: req.user,
        profile: profiles[0] || null,
        skills,
        education,
        experience,
        certifications,
        projects,
      },
    })
  } catch (err) { next(err) }
}

export async function getPublicProfile(req, res, next) {
  try {
    const { id } = req.params
    const { rows: users } = await query(
      'SELECT id, name, email, role, avatar, created_at FROM users WHERE id = $1 AND is_suspended = FALSE',
      [id]
    )
    if (!users.length) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const { rows: profiles } = await query('SELECT * FROM profiles WHERE user_id = $1', [id])
    const { rows: skills } = await query('SELECT * FROM skills WHERE user_id = $1', [id])
    const { rows: ts } = await query('SELECT overall FROM trust_scores WHERE user_id = $1', [id])

    res.json({
      success: true,
      data: {
        user: users[0],
        profile: profiles[0] || null,
        skills,
        trustScore: ts[0]?.overall ?? 0,
      },
    })
  } catch (err) { next(err) }
}

export async function updateProfile(req, res, next) {
  try {
    const { bio, headline, location, website } = req.body
    const userId = req.user.id

    const { rows } = await query(
      `UPDATE profiles
         SET bio=$1, headline=$2, location=$3, website=$4, updated_at=NOW()
       WHERE user_id=$5
       RETURNING *`,
      [bio ?? null, headline ?? null, location ?? null, website ?? null, userId]
    )
    if (!rows.length) {
      await query('INSERT INTO profiles (id, user_id, bio, headline, location, website) VALUES ($1,$2,$3,$4,$5,$6)',
        [uuid(), userId, bio ?? null, headline ?? null, location ?? null, website ?? null])
    }

    res.json({ success: true, data: rows[0] ?? { user_id: userId, bio, headline, location, website } })
  } catch (err) { next(err) }
}

export async function addSkill(req, res, next) {
  try {
    const { name, category } = req.body
    const { rows } = await query(
      'INSERT INTO skills (id, user_id, name, category) VALUES ($1,$2,$3,$4) RETURNING *',
      [uuid(), req.user.id, name, category ?? null]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params
    const { rowCount } = await query(
      'DELETE FROM skills WHERE id=$1 AND user_id=$2', [id, req.user.id]
    )
    if (!rowCount) return res.status(404).json({ success: false, message: 'Skill not found' })
    res.json({ success: true, message: 'Skill removed' })
  } catch (err) { next(err) }
}

export async function addEducation(req, res, next) {
  try {
    const { institution, degree, field, start_year, end_year, is_current } = req.body
    const { rows } = await query(
      `INSERT INTO education (id, user_id, institution, degree, field, start_year, end_year, is_current)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [uuid(), req.user.id, institution, degree ?? null, field ?? null,
       start_year ?? null, end_year ?? null, is_current ?? false]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function addExperience(req, res, next) {
  try {
    const { company, title, start_date, end_date, is_current, description } = req.body
    const { rows } = await query(
      `INSERT INTO experience (id, user_id, company, title, start_date, end_date, is_current, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [uuid(), req.user.id, company, title, start_date ?? null,
       end_date ?? null, is_current ?? false, description ?? null]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function addCertification(req, res, next) {
  try {
    const { name, issuer, issue_date, expiry_date, credential_url } = req.body
    const { rows } = await query(
      `INSERT INTO certifications (id, user_id, name, issuer, issue_date, expiry_date, credential_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [uuid(), req.user.id, name, issuer ?? null, issue_date ?? null,
       expiry_date ?? null, credential_url ?? null]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function addProject(req, res, next) {
  try {
    const { title, description, technologies, url, image_url } = req.body
    const { rows } = await query(
      `INSERT INTO projects (id, user_id, title, description, technologies, url, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [uuid(), req.user.id, title, description ?? null,
       technologies ?? [], url ?? null, image_url ?? null]
    )
    res.status(201).json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }
    const avatarUrl = req.file.path || req.file.filename
    await query('UPDATE users SET avatar=$1, updated_at=NOW() WHERE id=$2', [avatarUrl, req.user.id])
    res.json({ success: true, data: { avatar: avatarUrl } })
  } catch (err) { next(err) }
}
