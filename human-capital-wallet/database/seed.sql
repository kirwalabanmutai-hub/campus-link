-- =============================================================
--  Human Capital Wallet — Sample Seed Data
-- =============================================================

-- Admin user (password: Admin@1234)
INSERT INTO users (id, name, email, password_hash, role, is_verified)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'HCW Admin',
  'admin@hcw.co.ke',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhg3PZi6DvPqxYD0f.7f.2',
  'admin',
  TRUE
) ON CONFLICT DO NOTHING;

-- Sample user (password: User@1234)
INSERT INTO users (id, name, email, password_hash, role, is_verified)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'Brian Mutai',
  'brian@example.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhg3PZi6DvPqxYD0f.7f.2',
  'user',
  TRUE
) ON CONFLICT DO NOTHING;

-- Sample recruiter
INSERT INTO users (id, name, email, password_hash, role, is_verified)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'Safaricom HR',
  'hr@safaricom.co.ke',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhg3PZi6DvPqxYD0f.7f.2',
  'recruiter',
  TRUE
) ON CONFLICT DO NOTHING;

-- Profiles
INSERT INTO profiles (id, user_id, bio, headline, location)
VALUES
  ('p0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'Data Analyst & Full-Stack Developer with 2+ years experience.', 'Data Analyst at Safaricom', 'Nairobi, Kenya'),
  ('p0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001',
   'Talent Acquisition at Safaricom PLC.', 'Senior HR Manager', 'Nairobi, Kenya')
ON CONFLICT DO NOTHING;

-- Trust scores
INSERT INTO trust_scores (id, user_id, overall, review_score, verification_score, activity_score)
VALUES
  ('ts000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 87, 90, 85, 86),
  ('ts000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 72, 70, 80, 66)
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO skills (id, user_id, name, category, is_verified, endorsements)
VALUES
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001', 'Python',         'Tech',  TRUE,  12),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001', 'Data Analysis',  'Data',  TRUE,  8),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001', 'SQL',            'Data',  FALSE, 6),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001', 'React',          'Tech',  FALSE, 5),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001', 'Leadership',     'Soft',  TRUE,  9)
ON CONFLICT DO NOTHING;

-- Opportunities
INSERT INTO opportunities (id, title, description, type, provider, provider_id, location, deadline, compensation, tags, status)
VALUES
  (uuid_generate_v4(), 'Data Analyst', 'Join our data team to drive insights across product lines.', 'job',
   'Safaricom PLC', 'c0000000-0000-0000-0000-000000000001', 'Nairobi, Kenya', '2024-06-30', 'KSh 80K–120K/mo',
   ARRAY['Python','SQL','Tableau'], 'active'),

  (uuid_generate_v4(), 'Google Africa Scholarship 2024', 'Full scholarship for African STEM students.', 'scholarship',
   'Google', NULL, 'Remote', '2024-07-15', '$5,000',
   ARRAY['Computer Science','STEM','AI'], 'active'),

  (uuid_generate_v4(), 'Frontend Developer Intern', 'React + TypeScript internship at a growing fintech startup.', 'internship',
   'StartupHub KE', NULL, 'Nairobi, Kenya', '2024-06-25', 'KSh 25K/mo',
   ARRAY['React','TypeScript','UI/UX'], 'active'),

  (uuid_generate_v4(), 'AWS Build On Africa Hackathon', 'Build innovative cloud solutions for Africa.', 'competition',
   'Amazon Web Services', NULL, 'Virtual', '2024-07-01', '$10,000 prize pool',
   ARRAY['Cloud','AI','Serverless'], 'active'),

  (uuid_generate_v4(), 'SME Digital Transformation Grant', 'Funding for small businesses going digital.', 'grant',
   'USAID Kenya', NULL, 'Kenya', '2024-08-10', 'KSh 500,000',
   ARRAY['Business','Digital','SME'], 'active'),

  (uuid_generate_v4(), 'UI/UX Design Gig', 'Design a mobile app UI for a FinTech product. Figma required.', 'gig',
   'FinTech Startup', NULL, 'Remote', '2024-06-20', 'KSh 40,000',
   ARRAY['Figma','UI/UX','Design'], 'active')
ON CONFLICT DO NOTHING;

-- Income records
INSERT INTO income_records (id, user_id, amount, source, category, type, date)
VALUES
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001',  80000, 'Safaricom Salary',   'Employment', 'income',  '2024-06-01'),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001',  15000, 'Freelance UI Gig',   'Freelance',  'income',  '2024-06-05'),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001', -22000, 'House Rent',          'Housing',    'expense', '2024-06-01'),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001',  -8000, 'Groceries',           'Food',       'expense', '2024-06-10'),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001',  12000, 'Data Analysis Gig',   'Freelance',  'income',  '2024-06-15')
ON CONFLICT DO NOTHING;

-- Reviews
INSERT INTO reviews (id, from_user_id, to_user_id, rating, comment, service_type)
VALUES
  (uuid_generate_v4(), 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   5, 'Exceptional data analyst. Delivered insights on time and exceeded expectations.', 'Data Analysis')
ON CONFLICT DO NOTHING;

-- Notifications
INSERT INTO notifications (id, user_id, title, message, type)
VALUES
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001',
   'Profile Verified', 'Your profile has been verified. Your trust score increased to 87.', 'success'),
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001',
   'New Opportunity Match', 'A new Data Scientist role at KCB matches your profile.', 'opportunity')
ON CONFLICT DO NOTHING;

-- Subscriptions
INSERT INTO subscriptions (id, user_id, plan, status, ends_at)
VALUES
  (uuid_generate_v4(), 'b0000000-0000-0000-0000-000000000001', 'pro', 'active', NOW() + INTERVAL '30 days')
ON CONFLICT DO NOTHING;
