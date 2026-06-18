-- =============================================================
--  Human Capital Wallet — PostgreSQL Schema
-- =============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 VARCHAR(100) NOT NULL,
  email                VARCHAR(255) UNIQUE NOT NULL,
  password_hash        TEXT NOT NULL,
  role                 VARCHAR(20) NOT NULL DEFAULT 'user'
                         CHECK (role IN ('user','recruiter','provider','investor','admin')),
  avatar               TEXT,
  is_verified          BOOLEAN DEFAULT FALSE,
  is_suspended         BOOLEAN DEFAULT FALSE,
  email_verified_at    TIMESTAMPTZ,
  email_verify_token   TEXT,
  reset_token          TEXT,
  reset_token_expires  TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email  ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role   ON users(role);

-- ── Profiles ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio         TEXT,
  headline    VARCHAR(160),
  location    VARCHAR(120),
  website     VARCHAR(255),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Skills ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(80) NOT NULL,
  category     VARCHAR(60),
  is_verified  BOOLEAN DEFAULT FALSE,
  endorsements INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_skills_user ON skills(user_id);

-- ── Education ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS education (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  institution VARCHAR(200) NOT NULL,
  degree      VARCHAR(100),
  field       VARCHAR(100),
  start_year  INTEGER,
  end_year    INTEGER,
  is_current  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Experience ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS experience (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  company     VARCHAR(200) NOT NULL,
  title       VARCHAR(150) NOT NULL,
  start_date  DATE,
  end_date    DATE,
  is_current  BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Certifications ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  name           VARCHAR(200) NOT NULL,
  issuer         VARCHAR(200),
  issue_date     DATE,
  expiry_date    DATE,
  credential_url TEXT,
  is_verified    BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(200) NOT NULL,
  description  TEXT,
  technologies TEXT[],
  url          TEXT,
  image_url    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Reviews ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  to_user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  service_type VARCHAR(100),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_to_user ON reviews(to_user_id);

-- ── Trust Scores ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trust_scores (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  overall             SMALLINT DEFAULT 0,
  review_score        SMALLINT DEFAULT 0,
  verification_score  SMALLINT DEFAULT 0,
  activity_score      SMALLINT DEFAULT 0,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Opportunities ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         VARCHAR(255) NOT NULL,
  description   TEXT NOT NULL,
  type          VARCHAR(30) NOT NULL
                  CHECK (type IN ('job','internship','scholarship','grant','competition','tender','gig')),
  provider      VARCHAR(200),
  provider_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  location      VARCHAR(200),
  deadline      DATE,
  compensation  VARCHAR(100),
  requirements  TEXT[],
  tags          TEXT[],
  status        VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','approved','closed','draft')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_opp_type   ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opp_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opp_title  ON opportunities USING gin(title gin_trgm_ops);

-- ── Applications ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  cover_letter    TEXT,
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','viewed','shortlisted','rejected','accepted')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- ── Saved Opportunities ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_opportunities (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id  UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, opportunity_id)
);

-- ── Income Records ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS income_records (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  amount      NUMERIC(14,2) NOT NULL,
  source      VARCHAR(200) NOT NULL,
  category    VARCHAR(80),
  type        VARCHAR(10) NOT NULL CHECK (type IN ('income','expense')),
  date        DATE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_income_user ON income_records(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income_records(date);

-- ── Investments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS investments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(200) NOT NULL,
  type          VARCHAR(60),
  amount        NUMERIC(14,2),
  current_value NUMERIC(14,2),
  roi           NUMERIC(6,2),
  risk_level    VARCHAR(10) CHECK (risk_level IN ('low','medium','high')),
  start_date    DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  title      VARCHAR(200) NOT NULL,
  message    TEXT,
  type       VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info','success','warning','opportunity')),
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read);

-- ── Payments ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  amount          NUMERIC(12,2) NOT NULL,
  currency        VARCHAR(5) DEFAULT 'KES',
  type            VARCHAR(30),
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  provider        VARCHAR(30),
  provider_ref    TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Subscriptions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  plan        VARCHAR(30) NOT NULL CHECK (plan IN ('free','pro','recruiter')),
  status      VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','cancelled','expired')),
  starts_at   TIMESTAMPTZ DEFAULT NOW(),
  ends_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
