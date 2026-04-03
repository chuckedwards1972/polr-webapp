-- ═══════════════════════════════════════════════════════════
-- POLR NETWORK — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS (extended profile, links to auth.users) ──
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  level       INTEGER NOT NULL DEFAULT 5 CHECK (level BETWEEN 0 AND 6),
  campus      TEXT,
  role        TEXT DEFAULT 'member',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── MEMBERS ──
CREATE TABLE IF NOT EXISTS members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  campus          TEXT,
  status          TEXT DEFAULT 'Active',
  step_num        INTEGER DEFAULT 1,
  sobriety_date   DATE,
  join_date       DATE DEFAULT CURRENT_DATE,
  pipeline_stage  INTEGER DEFAULT 1,
  employment_status TEXT,
  court_ordered   BOOLEAN DEFAULT FALSE,
  sponsor_id      UUID,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── HOUSING ──
CREATE TABLE IF NOT EXISTS housing (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  campus      TEXT,
  capacity    INTEGER DEFAULT 6,
  house_id    TEXT UNIQUE,
  gender      TEXT DEFAULT 'M',
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── HOUSING RESIDENTS ──
CREATE TABLE IF NOT EXISTS housing_residents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id       UUID REFERENCES members(id),
  name            TEXT NOT NULL,
  house_id        TEXT,
  campus          TEXT,
  status          TEXT DEFAULT 'Active',
  entry_date      DATE,
  program_end     DATE,
  payment         TEXT DEFAULT 'Pending',
  step_num        INTEGER DEFAULT 1,
  attendance_count INTEGER DEFAULT 0,
  employment_status TEXT,
  court_ordered   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── PIPELINE ──
CREATE TABLE IF NOT EXISTS pipeline (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id   UUID REFERENCES members(id) ON DELETE CASCADE,
  stage       INTEGER DEFAULT 1,
  notes       TEXT,
  updated_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── MEETINGS ──
CREATE TABLE IF NOT EXISTS meetings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  campus      TEXT,
  day         TEXT,
  time        TEXT,
  location    TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── GRANTS ──
CREATE TABLE IF NOT EXISTS grants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  agency      TEXT,
  amount      NUMERIC(12,2),
  status      TEXT DEFAULT 'pending',
  deadline    DATE,
  notes       TEXT,
  campus      TEXT,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── MISSIONS ──
CREATE TABLE IF NOT EXISTS missions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  campus      TEXT,
  status      TEXT DEFAULT 'active',
  progress    INTEGER DEFAULT 0,
  target      INTEGER DEFAULT 100,
  due_date    DATE,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── TASKS ──
CREATE TABLE IF NOT EXISTS tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  assigned_to UUID,
  status      TEXT DEFAULT 'pending',
  notes       TEXT,
  due_date    DATE,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── JOURNAL ──
CREATE TABLE IF NOT EXISTS journal (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(auth_id),
  type        TEXT DEFAULT 'reflection',
  content     TEXT NOT NULL,
  step        INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── NOTIFICATIONS ──
CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID,
  title           TEXT NOT NULL,
  body            TEXT,
  type            TEXT DEFAULT 'info',
  read            BOOLEAN DEFAULT FALSE,
  require_response BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── AUDIT LOG ──
CREATE TABLE IF NOT EXISTS audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  meta        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── ALERTS ──
CREATE TABLE IF NOT EXISTS alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id   UUID REFERENCES members(id),
  title       TEXT NOT NULL,
  body        TEXT,
  severity    TEXT DEFAULT 'low',
  status      TEXT DEFAULT 'active',
  campus      TEXT,
  resolution  TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── LICENSING PARTNERS ──
CREATE TABLE IF NOT EXISTS licensing_partners (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  type        TEXT,
  status      TEXT DEFAULT 'active',
  revenue_share NUMERIC(5,2),
  contact     TEXT,
  created_by  UUID,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── LICENSING REVENUE ──
CREATE TABLE IF NOT EXISTS licensing_revenue (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id  UUID REFERENCES licensing_partners(id),
  amount      NUMERIC(12,2),
  period      TEXT,
  recorded_by UUID,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── ACTIVITY FEED ──
CREATE TABLE IF NOT EXISTS activity_feed (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor       TEXT,
  action      TEXT NOT NULL,
  target      TEXT,
  campus      TEXT,
  meta        JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

ALTER TABLE members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE housing_residents ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal         ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;

-- Members: users see their campus only (level 2-3), L0-L1 see all
-- NOTE: The backend enforces this in application logic using JWT level.
-- These policies allow the service role key (used by backend) full access.
CREATE POLICY "service_role_all" ON members       FOR ALL USING (true);
CREATE POLICY "service_role_all" ON housing_residents FOR ALL USING (true);
CREATE POLICY "service_role_all" ON journal       FOR ALL USING (true);
CREATE POLICY "service_role_all" ON notifications FOR ALL USING (true);

-- ═══════════════════════════════════════════════════════════
-- SEED: Default admin user (POLRHQ / ACTS2:38)
-- Run AFTER creating the user in Supabase Auth dashboard
-- Replace 'YOUR-AUTH-UUID' with the UUID from auth.users
-- ═══════════════════════════════════════════════════════════
-- INSERT INTO users (auth_id, username, name, level, role)
-- VALUES ('YOUR-AUTH-UUID', 'POLRHQ', 'POLR HQ Admin', 0, 'admin');
