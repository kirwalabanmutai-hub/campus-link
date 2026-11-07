// CampusLink server: accounts, seller verification, seller products and recruiter gigs.
//   npm run server        → API on http://localhost:3001 (run `npm run dev` alongside for the site)
//   npm start             → builds nothing; serves dist/ + API together (run `npm run build` first)
// Settings come from .env (see .env.example). ADMIN_EMAIL / ADMIN_PASSWORD create the admin account.
import express from 'express';
import multer from 'multer';
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDb } from './db.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = process.env.DATA_DIR ? resolve(process.env.DATA_DIR) : join(ROOT, 'server', 'data');
const DOCS_DIR = join(DATA_DIR, 'uploads', 'docs');          // private: verification documents
const PRODUCT_DIR = join(DATA_DIR, 'uploads', 'products');   // public: product photos
const DIST_DIR = join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 3001;
const PROD = process.env.NODE_ENV === 'production';
const SESSION_DAYS = 30;
const COOKIE = 'cl_session';

[DOCS_DIR, PRODUCT_DIR].forEach(d => mkdirSync(d, { recursive: true }));
const db = openDb(join(DATA_DIR, 'campuslink.db'));

/* ── Reference lists (single source of truth; the site loads them from /api/meta) ── */
const CAMPUSES = [
  'Kabarak University', 'University of Nairobi', 'Kenyatta University', 'JKUAT', 'Moi University',
  'Egerton University', 'Strathmore University', 'USIU-Africa', 'Technical University of Kenya',
  'Maseno University', 'Masinde Muliro University (MMUST)', 'Dedan Kimathi University of Technology',
  'Daystar University', 'Mount Kenya University', 'KCA University', 'Catholic University of Eastern Africa',
  'Multimedia University of Kenya', 'Technical University of Mombasa', 'Laikipia University',
  'Chuka University', 'Karatina University', 'Meru University of Science and Technology',
  'Kisii University', 'Pwani University',
];
const BUSINESS_TYPES = ['Jerseys & sportswear', 'Clothing & fashion', 'Food & groceries', 'Ready meals & snacks',
  'Printing & stationery', 'Laundry & cleaning', 'Moving & storage', 'Phones & electronics', 'Other'];
const CLOTHING_TYPES = ['Jerseys', 'T-Shirts', 'Jeans', 'Hoodies', 'Shorts', 'Dresses', 'Blouses', 'Skirts'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const FOOD_SUBCATS = ['Groceries', 'Ready Meals', 'Snacks', 'Beverages'];
const GIG_CATS = ['Academic', 'Tech', 'Creative', 'Admin', 'Physical'];

/* ── Validation ── */
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '');
const isStudentEmail = e => /^[^\s@]+@[^\s@]+\.(ac\.ke|edu)$/i.test(e || '');
const isKraPin = p => /^[AP]\d{9}[A-Z]$/i.test(p || '');
const isKenyanPhone = p => /^(\+?254|0)(7|1)\d{8}$/.test((p || '').replace(/[\s-]/g, ''));
const isUrl = u => /^https?:\/\/\S+\.\S+/.test(u || '');
const str = (v, max = 200) => String(v ?? '').trim().slice(0, max);

/* ── Passwords (scrypt) and sessions (random token in an HttpOnly cookie, hash stored) ── */
function hashPassword(pw) {
  const salt = randomBytes(16);
  return 'scrypt$' + salt.toString('hex') + '$' + scryptSync(pw, salt, 64).toString('hex');
}
function verifyPassword(pw, stored) {
  const [, saltHex, hashHex] = String(stored).split('$');
  if (!saltHex || !hashHex) return false;
  const want = Buffer.from(hashHex, 'hex');
  const got = scryptSync(pw, Buffer.from(saltHex, 'hex'), want.length);
  return timingSafeEqual(want, got);
}
const sha256 = s => createHash('sha256').update(s).digest('hex');

function startSession(res, userId) {
  const token = randomBytes(32).toString('base64url');
  const expires = Date.now() + SESSION_DAYS * 864e5;
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(sha256(token), userId, expires);
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: PROD, maxAge: SESSION_DAYS * 864e5, path: '/' });
}
function readCookie(req, name) {
  const m = (req.headers.cookie || '').split(/;\s*/).find(c => c.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}

/* ── Public shape of a user (never includes the password hash) ── */
function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id, type: u.type, email: u.email, firstName: u.first_name, lastName: u.last_name,
    campus: u.campus, phone: u.phone, orgName: u.org_name, category: u.category, kraPin: u.kra_pin,
    landmark: u.landmark, mapLink: u.map_link, status: u.status, reviewNote: u.review_note,
    reviewedAt: u.reviewed_at, createdAt: u.created_at,
  };
}

/* ── Uploads: kept in memory, checked by their actual bytes, then written to disk ── */
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 3 } });
function sniff(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf.subarray(0, 4).toString('latin1') === '%PDF') return { mime: 'application/pdf', ext: '.pdf' };
  if (buf[0] === 0x89 && buf.subarray(1, 4).toString('latin1') === 'PNG') return { mime: 'image/png', ext: '.png' };
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mime: 'image/jpeg', ext: '.jpg' };
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') return { mime: 'image/webp', ext: '.webp' };
  return null;
}
function saveFile(dir, file, { imagesOnly = false } = {}) {
  const kind = sniff(file.buffer);
  if (!kind || (imagesOnly && kind.mime === 'application/pdf')) return null;
  const name = randomBytes(16).toString('hex') + kind.ext;
  writeFileSync(join(dir, name), file.buffer);
  return { name, mime: kind.mime };
}

/* ── App ── */
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); next(); });

// Attach the signed-in user (if any) to every request.
app.use((req, _res, next) => {
  const token = readCookie(req, COOKIE);
  if (token) {
    const row = db.prepare('SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?')
      .get(sha256(token), Date.now());
    req.user = row || null;
  }
  next();
});
const need = (...types) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Please sign in first.' });
  if (types.length && !types.includes(req.user.type)) return res.status(403).json({ error: "Your account can't do that." });
  next();
};
const needApprovedSeller = (req, res, next) => {
  if (!req.user || req.user.type !== 'business') return res.status(403).json({ error: 'Only business accounts can list products.' });
  if (req.user.status !== 'approved') return res.status(403).json({ error: 'Your business must be approved by an admin before you can list products.' });
  next();
};

app.get('/api/meta', (_req, res) => res.json({ campuses: CAMPUSES, businessTypes: BUSINESS_TYPES, clothingTypes: CLOTHING_TYPES, genders: GENDERS, foodSubcats: FOOD_SUBCATS, gigCats: GIG_CATS }));

/* ── Auth ── */
app.post('/api/auth/register', upload.fields([{ name: 'kra', maxCount: 1 }, { name: 'permit', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), (req, res) => {
  const b = req.body || {};
  const type = ['student', 'business', 'recruiter'].includes(b.type) ? b.type : null;
  const errors = {};
  const email = str(b.email, 120).toLowerCase();
  const firstName = str(b.firstName, 60), lastName = str(b.lastName, 60);
  const password = String(b.password || '');
  if (!type) errors.type = 'Choose an account type.';
  if (!firstName || !lastName) errors.name = 'Enter your first and last name.';
  if (!isEmail(email)) errors.email = 'Enter a valid email address.';
  else if (type === 'student' && !isStudentEmail(email)) errors.email = 'Use your university email (ending in .ac.ke).';
  if (password.length < 8) errors.password = 'Use at least 8 characters.';
  const campus = str(b.campus, 80);
  if (!CAMPUSES.includes(campus)) errors.campus = 'Choose a campus from the list.';

  const extra = {};
  if (type === 'business' || type === 'recruiter') {
    extra.phone = str(b.phone, 20);
    extra.org_name = str(b.orgName, 100);
    if (!isKenyanPhone(extra.phone)) errors.phone = 'Enter a Kenyan number, e.g. 0712 345 678.';
    if (!extra.org_name) errors.orgName = type === 'business' ? 'Enter your business name.' : 'Enter your organisation name.';
  }
  if (type === 'business') {
    extra.category = str(b.category, 60);
    extra.kra_pin = str(b.kraPin, 11).toUpperCase();
    extra.landmark = str(b.landmark, 200);
    extra.map_link = str(b.mapLink, 300);
    if (!BUSINESS_TYPES.includes(extra.category)) errors.category = 'Choose what you sell.';
    if (!isKraPin(extra.kra_pin)) errors.kraPin = 'A KRA PIN is a letter, 9 digits and a letter, e.g. A012345678Z.';
    if (extra.landmark.length < 5) errors.landmark = 'Describe where your shop is.';
    if (extra.map_link && !isUrl(extra.map_link)) errors.mapLink = 'That link should start with https://';
    const f = req.files || {};
    if (!f.kra) errors.kra = 'Upload your KRA PIN certificate.';
    if (!f.permit) errors.permit = 'Upload your business permit.';
  }
  if (!errors.email && db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) errors.email = 'An account with this email already exists. Sign in instead.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  // Save documents first, so a bad file stops the whole registration.
  const saved = [];
  if (type === 'business') {
    for (const kind of ['kra', 'permit', 'photo']) {
      const file = req.files?.[kind]?.[0];
      if (!file) continue;
      const s = saveFile(DOCS_DIR, file, { imagesOnly: kind === 'photo' });
      if (!s) { saved.forEach(x => unlinkSync(join(DOCS_DIR, x.name))); return res.status(400).json({ errors: { [kind]: `"${file.originalname}" isn't a real PDF or image file.` } }); }
      saved.push({ kind, ...s, orig: file.originalname, size: file.size });
    }
  }

  const info = db.prepare(`INSERT INTO users (type, email, password_hash, first_name, last_name, campus, phone, org_name, category, kra_pin, landmark, map_link, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    type, email, hashPassword(password), firstName, lastName, campus,
    extra.phone || null, extra.org_name || null, extra.category || null, extra.kra_pin || null,
    extra.landmark || null, extra.map_link || null, type === 'business' ? 'pending' : null);
  const userId = Number(info.lastInsertRowid);
  for (const d of saved) db.prepare('INSERT INTO documents (user_id, kind, file, orig_name, mime, size) VALUES (?, ?, ?, ?, ?, ?)').run(userId, d.kind, d.name, d.orig, d.mime, d.size);

  startSession(res, userId);
  res.status(201).json({ user: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(userId)) });
});

// Simple brute-force guard: 10 failed sign-ins per IP + email in 15 minutes.
const failures = new Map();
app.post('/api/auth/login', (req, res) => {
  const email = str(req.body?.email, 120).toLowerCase();
  const password = String(req.body?.password || '');
  const key = req.ip + '|' + email;
  const f = failures.get(key);
  if (f && f.count >= 10 && f.until > Date.now()) return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!u || !verifyPassword(password, u.password_hash)) {
    const n = f && f.until > Date.now() ? f.count + 1 : 1;
    failures.set(key, { count: n, until: Date.now() + 15 * 60e3 });
    return res.status(401).json({ error: 'Wrong email or password.' });
  }
  failures.delete(key);
  startSession(res, u.id);
  res.json({ user: publicUser(u) });
});

app.post('/api/auth/logout', (req, res) => {
  const token = readCookie(req, COOKIE);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(sha256(token));
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => res.json({ user: publicUser(req.user) }));

/* ── Public: shops, products and gigs ── */
const productOut = p => ({
  id: p.id, sellerId: p.seller_id, sellerName: p.org_name, campus: p.campus,
  name: p.name, dept: p.dept, type: p.type, gender: p.gender, subcat: p.subcat, price: p.price,
  description: p.description, sizes: p.sizes ? JSON.parse(p.sizes) : [], inStock: !!p.in_stock,
  imageUrl: p.image ? '/uploads/products/' + p.image : null, createdAt: p.created_at,
});

app.get('/api/shops', (req, res) => {
  const campus = str(req.query.campus, 80);
  const rows = db.prepare(`SELECT id, org_name, category, campus, landmark, map_link, phone FROM users
    WHERE type = 'business' AND status = 'approved' AND campus = ? ORDER BY org_name`).all(campus);
  res.json({ shops: rows.map(r => ({ id: r.id, name: r.org_name, category: r.category, campus: r.campus, landmark: r.landmark, mapLink: r.map_link, phone: r.phone })) });
});

// Only products from approved sellers near the chosen campus.
app.get('/api/products', (req, res) => {
  const campus = str(req.query.campus, 80);
  const rows = db.prepare(`SELECT p.*, u.org_name, u.campus FROM products p JOIN users u ON u.id = p.seller_id
    WHERE u.status = 'approved' AND u.campus = ? AND p.in_stock = 1 ORDER BY p.created_at DESC`).all(campus);
  res.json({ products: rows.map(productOut) });
});

const gigOut = g => ({
  id: g.id, title: g.title, desc: g.description, cat: g.cat, budget: g.budget,
  skills: g.skills ? JSON.parse(g.skills) : [], campus: g.campus, poster: g.org_name, createdAt: g.created_at,
});
app.get('/api/gigs', (_req, res) => {
  const rows = db.prepare('SELECT g.*, u.org_name FROM gigs g JOIN users u ON u.id = g.poster_id ORDER BY g.created_at DESC').all();
  res.json({ gigs: rows.map(gigOut) });
});

/* ── Approved sellers: manage their own products ── */
function readProduct(b, errors) {
  const p = {
    name: str(b.name, 100), dept: b.dept === 'Food' ? 'Food' : b.dept === 'Clothes' ? 'Clothes' : null,
    price: Math.round(Number(b.price)), description: str(b.description, 1000), inStock: b.inStock !== 'false',
  };
  if (!p.name) errors.name = 'Enter a product name.';
  if (!p.dept) errors.dept = 'Choose clothing or food.';
  if (!Number.isFinite(p.price) || p.price < 1 || p.price > 1e6) errors.price = 'Enter a price in Ksh.';
  if (p.dept === 'Clothes') {
    p.type = CLOTHING_TYPES.includes(b.type) ? b.type : null;
    p.gender = GENDERS.includes(b.gender) ? b.gender : null;
    let sizes = [];
    try { sizes = JSON.parse(b.sizes || '[]'); } catch { /* ignore */ }
    p.sizes = Array.isArray(sizes) ? sizes.map(s => str(s, 10)).filter(Boolean).slice(0, 12) : [];
    if (!p.type) errors.type = 'Choose the clothing type.';
    if (!p.gender) errors.gender = 'Choose who it is for.';
    if (!p.sizes.length) errors.sizes = 'Add at least one size.';
  }
  if (p.dept === 'Food') {
    p.subcat = FOOD_SUBCATS.includes(b.subcat) ? b.subcat : null;
    if (!p.subcat) errors.subcat = 'Choose a food category.';
  }
  return p;
}

app.get('/api/my/products', need('business'), (req, res) => {
  const rows = db.prepare('SELECT p.*, u.org_name, u.campus FROM products p JOIN users u ON u.id = p.seller_id WHERE p.seller_id = ? ORDER BY p.created_at DESC').all(req.user.id);
  res.json({ products: rows.map(productOut) });
});

app.post('/api/my/products', needApprovedSeller, upload.single('image'), (req, res) => {
  const errors = {};
  const p = readProduct(req.body || {}, errors);
  if (!req.file) errors.image = 'Add a photo of the product.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const img = saveFile(PRODUCT_DIR, req.file, { imagesOnly: true });
  if (!img) return res.status(400).json({ errors: { image: 'The photo must be a JPG, PNG or WebP image.' } });
  const info = db.prepare(`INSERT INTO products (seller_id, name, dept, type, gender, subcat, price, description, sizes, image, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(req.user.id, p.name, p.dept, p.type || null, p.gender || null, p.subcat || null,
    p.price, p.description, p.sizes ? JSON.stringify(p.sizes) : null, img.name, p.inStock ? 1 : 0);
  const row = db.prepare('SELECT p.*, u.org_name, u.campus FROM products p JOIN users u ON u.id = p.seller_id WHERE p.id = ?').get(Number(info.lastInsertRowid));
  res.status(201).json({ product: productOut(row) });
});

app.put('/api/my/products/:id', needApprovedSeller, upload.single('image'), (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ? AND seller_id = ?').get(Number(req.params.id), req.user.id);
  if (!existing) return res.status(404).json({ error: 'Product not found.' });
  const errors = {};
  const p = readProduct(req.body || {}, errors);
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  let image = existing.image;
  if (req.file) {
    const img = saveFile(PRODUCT_DIR, req.file, { imagesOnly: true });
    if (!img) return res.status(400).json({ errors: { image: 'The photo must be a JPG, PNG or WebP image.' } });
    if (existing.image && existsSync(join(PRODUCT_DIR, existing.image))) unlinkSync(join(PRODUCT_DIR, existing.image));
    image = img.name;
  }
  db.prepare(`UPDATE products SET name=?, dept=?, type=?, gender=?, subcat=?, price=?, description=?, sizes=?, image=?, in_stock=? WHERE id=?`)
    .run(p.name, p.dept, p.type || null, p.gender || null, p.subcat || null, p.price, p.description, p.sizes ? JSON.stringify(p.sizes) : null, image, p.inStock ? 1 : 0, existing.id);
  const row = db.prepare('SELECT p.*, u.org_name, u.campus FROM products p JOIN users u ON u.id = p.seller_id WHERE p.id = ?').get(existing.id);
  res.json({ product: productOut(row) });
});

app.delete('/api/my/products/:id', need('business'), (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ? AND seller_id = ?').get(Number(req.params.id), req.user.id);
  if (!existing) return res.status(404).json({ error: 'Product not found.' });
  db.prepare('DELETE FROM products WHERE id = ?').run(existing.id);
  if (existing.image && existsSync(join(PRODUCT_DIR, existing.image))) unlinkSync(join(PRODUCT_DIR, existing.image));
  res.json({ ok: true });
});

/* ── Businesses: resubmit documents after a rejection (or update them while pending) ── */
app.post('/api/my/documents', need('business'), upload.fields([{ name: 'kra', maxCount: 1 }, { name: 'permit', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), (req, res) => {
  if (req.user.status === 'approved') return res.status(400).json({ error: 'Your business is already approved.' });
  const b = req.body || {}, f = req.files || {}, errors = {};
  const kraPin = b.kraPin ? str(b.kraPin, 11).toUpperCase() : req.user.kra_pin;
  const landmark = b.landmark ? str(b.landmark, 200) : req.user.landmark;
  const mapLink = b.mapLink !== undefined ? str(b.mapLink, 300) : req.user.map_link;
  if (!isKraPin(kraPin)) errors.kraPin = 'A KRA PIN is a letter, 9 digits and a letter, e.g. A012345678Z.';
  if (landmark.length < 5) errors.landmark = 'Describe where your shop is.';
  if (mapLink && !isUrl(mapLink)) errors.mapLink = 'That link should start with https://';
  if (!f.kra && !f.permit && !f.photo) errors.kra = 'Upload at least one new document.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  for (const kind of ['kra', 'permit', 'photo']) {
    const file = f[kind]?.[0];
    if (!file) continue;
    const s = saveFile(DOCS_DIR, file, { imagesOnly: kind === 'photo' });
    if (!s) return res.status(400).json({ errors: { [kind]: `"${file.originalname}" isn't a real PDF or image file.` } });
    const old = db.prepare('SELECT file FROM documents WHERE user_id = ? AND kind = ?').get(req.user.id, kind);
    if (old && existsSync(join(DOCS_DIR, old.file))) unlinkSync(join(DOCS_DIR, old.file));
    db.prepare(`INSERT INTO documents (user_id, kind, file, orig_name, mime, size) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT (user_id, kind) DO UPDATE SET file = excluded.file, orig_name = excluded.orig_name, mime = excluded.mime, size = excluded.size`)
      .run(req.user.id, kind, s.name, file.originalname, s.mime, file.size);
  }
  db.prepare(`UPDATE users SET kra_pin = ?, landmark = ?, map_link = ?, status = 'pending', review_note = NULL, reviewed_at = NULL WHERE id = ?`)
    .run(kraPin, landmark, mapLink || null, req.user.id);
  res.json({ user: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)) });
});
app.get('/api/my/documents', need('business'), (req, res) => {
  const docs = {};
  for (const d of db.prepare('SELECT kind, orig_name, mime, size FROM documents WHERE user_id = ?').all(req.user.id)) docs[d.kind] = { name: d.orig_name, type: d.mime, size: d.size };
  res.json({ docs });
});

/* ── Recruiters: post and remove gigs ── */
app.get('/api/my/gigs', need('recruiter'), (req, res) => {
  const rows = db.prepare('SELECT g.*, u.org_name FROM gigs g JOIN users u ON u.id = g.poster_id WHERE g.poster_id = ? ORDER BY g.created_at DESC').all(req.user.id);
  res.json({ gigs: rows.map(gigOut) });
});
app.post('/api/my/gigs', need('recruiter'), (req, res) => {
  const b = req.body || {}, errors = {};
  const g = {
    title: str(b.title, 100), description: str(b.description, 1000), cat: GIG_CATS.includes(b.cat) ? b.cat : null,
    budget: Math.round(Number(b.budget)), skills: (Array.isArray(b.skills) ? b.skills : String(b.skills || '').split(','))
      .map(s => str(s, 30)).filter(Boolean).slice(0, 8),
  };
  if (g.title.length < 4) errors.title = 'Give the gig a short title.';
  if (g.description.length < 20) errors.description = 'Describe the work in at least 20 characters.';
  if (!g.cat) errors.cat = 'Choose a category.';
  if (!Number.isFinite(g.budget) || g.budget < 100 || g.budget > 1e6) errors.budget = 'Enter the pay in Ksh (at least 100).';
  if (Object.keys(errors).length) return res.status(400).json({ errors });
  const info = db.prepare('INSERT INTO gigs (poster_id, title, description, cat, budget, skills, campus) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(req.user.id, g.title, g.description, g.cat, g.budget, JSON.stringify(g.skills), req.user.campus);
  const row = db.prepare('SELECT g.*, u.org_name FROM gigs g JOIN users u ON u.id = g.poster_id WHERE g.id = ?').get(Number(info.lastInsertRowid));
  res.status(201).json({ gig: gigOut(row) });
});
app.delete('/api/my/gigs/:id', need('recruiter'), (req, res) => {
  const r = db.prepare('DELETE FROM gigs WHERE id = ? AND poster_id = ?').run(Number(req.params.id), req.user.id);
  if (!r.changes) return res.status(404).json({ error: 'Gig not found.' });
  res.json({ ok: true });
});

/* ── Admin: seller verification and gig moderation ── */
app.get('/api/admin/sellers', need('admin'), (_req, res) => {
  const sellers = db.prepare(`SELECT * FROM users WHERE type = 'business' ORDER BY created_at DESC`).all().map(u => {
    const docs = {};
    for (const d of db.prepare('SELECT kind, orig_name, mime, size FROM documents WHERE user_id = ?').all(u.id)) docs[d.kind] = { name: d.orig_name, type: d.mime, size: d.size };
    const productCount = db.prepare('SELECT COUNT(*) n FROM products WHERE seller_id = ?').get(u.id).n;
    return { ...publicUser(u), docs, productCount };
  });
  res.json({ sellers });
});

app.get('/api/admin/sellers/:id/docs/:kind', need('admin'), (req, res) => {
  const d = db.prepare('SELECT * FROM documents WHERE user_id = ? AND kind = ?').get(Number(req.params.id), req.params.kind);
  if (!d) return res.status(404).json({ error: 'Document not found.' });
  res.setHeader('Content-Type', d.mime);
  res.setHeader('Content-Disposition', `inline; filename="${d.orig_name.replace(/[^\w.\- ]/g, '_')}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.sendFile(join(DOCS_DIR, d.file));
});

app.post('/api/admin/sellers/:id/decision', need('admin'), (req, res) => {
  const status = req.body?.status;
  const note = str(req.body?.note, 500);
  if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Choose approve or reject.' });
  if (status === 'rejected' && note.length < 5) return res.status(400).json({ error: 'Write a short reason so the business knows what to fix.' });
  const r = db.prepare(`UPDATE users SET status = ?, review_note = ?, reviewed_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ? AND type = 'business'`)
    .run(status, status === 'rejected' ? note : null, Number(req.params.id));
  if (!r.changes) return res.status(404).json({ error: 'Business not found.' });
  res.json({ seller: publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(Number(req.params.id))) });
});

app.get('/api/admin/gigs', need('admin'), (_req, res) => {
  const rows = db.prepare('SELECT g.*, u.org_name FROM gigs g JOIN users u ON u.id = g.poster_id ORDER BY g.created_at DESC').all();
  res.json({ gigs: rows.map(gigOut) });
});
app.delete('/api/admin/gigs/:id', need('admin'), (req, res) => {
  const r = db.prepare('DELETE FROM gigs WHERE id = ?').run(Number(req.params.id));
  if (!r.changes) return res.status(404).json({ error: 'Gig not found.' });
  res.json({ ok: true });
});

/* ── Files and site ── */
app.use('/uploads/products', express.static(PRODUCT_DIR, { index: false, maxAge: '7d' }));
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { extensions: ['html'] }));
  app.get('/', (_req, res) => res.redirect('/home.html'));
}

// Errors (e.g. a file over 5 MB) come back as JSON the site can show.
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Each file must be 5 MB or smaller.' : 'There was a problem with the upload.';
    return res.status(400).json({ error: msg, errors: { [err.field || 'file']: msg } });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
});

/* ── Start ── */
db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
if (adminEmail && process.env.ADMIN_PASSWORD) {
  if (!db.prepare('SELECT 1 FROM users WHERE email = ?').get(adminEmail)) {
    db.prepare(`INSERT INTO users (type, email, password_hash, first_name, last_name) VALUES ('admin', ?, ?, 'Campus', 'Admin')`)
      .run(adminEmail, hashPassword(process.env.ADMIN_PASSWORD));
    console.log('Created admin account', adminEmail);
  }
} else if (!db.prepare(`SELECT 1 FROM users WHERE type = 'admin'`).get()) {
  console.warn('No admin account yet. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env and restart to create one.');
}

app.listen(PORT, () => console.log(`CampusLink server on http://localhost:${PORT}` + (existsSync(DIST_DIR) ? ' (serving dist/)' : '')));
