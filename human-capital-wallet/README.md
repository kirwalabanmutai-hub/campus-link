# Human Capital Wallet (HCW)

> Build your verified digital identity, discover opportunities, and grow your career — all in one place.

## Overview

A full-stack platform for professionals, students, freelancers, and entrepreneurs to:

- ✅ Create a **verified digital profile** with skills, experience, and certifications
- ⭐ Build a **trust & reputation score** through reviews and verified credentials
- 🎯 Discover personalized **jobs, internships, scholarships, grants, gigs, and competitions**
- 🤖 Get **AI-powered career guidance**, skill gap analysis, and personalized roadmaps
- 💰 **Track income** from multiple sources with financial analytics
- 📈 Manage an **investment portfolio** with ROI calculations
- 🔔 Stay informed with smart **notifications**
- 🛡️ Full **admin dashboard** for platform management

---

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | Next.js 14 · TypeScript · Tailwind CSS    |
| Backend    | Node.js · Express.js                      |
| Database   | PostgreSQL                                |
| Auth       | JWT · Google OAuth                        |
| Storage    | Cloudinary                                |
| Payments   | M-Pesa Daraja API                         |
| AI         | OpenAI API                                |
| Deploy     | Vercel (frontend) · Railway (backend/DB)  |

---

## Project Structure

```
human-capital-wallet/
├── frontend/                  # Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/        # Login, Register, Forgot Password
│   │   │   ├── (dashboard)/   # Dashboard, Profile, Opportunities, Career, Income, Investments, Notifications, Reputation
│   │   │   ├── admin/         # Admin panel
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx       # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   └── layout/        # Sidebar, Topbar
│   │   ├── lib/               # api.ts, auth.ts
│   │   └── types/             # TypeScript types
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── vercel.json
│
├── backend/                   # Node.js + Express API
│   └── src/
│       ├── config/            # database.js
│       ├── controllers/       # auth, opportunities, income, reputation, admin
│       ├── middleware/        # auth, validate, errorHandler, rateLimiter
│       ├── routes/            # auth, opportunities, income, reputation, admin
│       └── server.js          # Entry point
│
├── database/
│   ├── schema.sql             # Full PostgreSQL schema (16 tables)
│   └── seed.sql               # Sample data
│
├── docker-compose.yml         # Full-stack local development
├── .env.example               # All required environment variables
└── README.md
```

---

## Quick Start

### Option 1 — Docker (Recommended)

```bash
# 1. Clone and enter
cd human-capital-wallet

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your keys

# 3. Start everything
docker-compose up -d

# App: http://localhost:3000
# API: http://localhost:5000
```

### Option 2 — Manual Setup

**Database (PostgreSQL)**
```bash
createdb hcw_db
psql hcw_db < database/schema.sql
psql hcw_db < database/seed.sql
```

**Backend**
```bash
cd backend
npm install
cp ../.env.example .env   # fill in values
npm run dev               # runs on :5000
```

**Frontend**
```bash
cd frontend
npm install
cp ../.env.example .env.local  # fill NEXT_PUBLIC_* vars
npm run dev                    # runs on :3000
```

---

## API Endpoints

### Auth
```
POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me
POST  /api/auth/forgot-password
POST  /api/auth/reset-password
```

### Opportunities
```
GET   /api/opportunities              ?type= &search= &page= &limit=
GET   /api/opportunities/:id
POST  /api/opportunities
POST  /api/opportunities/:id/save
DELETE /api/opportunities/:id/save
POST  /api/opportunities/:id/apply
```

### Income
```
GET   /api/income                     ?type= &category=
POST  /api/income
PUT   /api/income/:id
DELETE /api/income/:id
GET   /api/income/summary
```

### Reputation
```
GET   /api/reputation/me
GET   /api/reputation/:id
GET   /api/reputation/:id/reviews
POST  /api/reputation/:id/reviews
```

### Admin (requires admin role)
```
GET   /api/admin/stats
GET   /api/admin/users
PUT   /api/admin/users/:id/role
PUT   /api/admin/users/:id/suspend
GET   /api/admin/opportunities
PUT   /api/admin/opportunities/:id/approve
GET   /api/admin/payments
GET   /api/admin/reports
```

---

## User Roles

| Role       | Capabilities                                      |
|------------|---------------------------------------------------|
| `user`     | Full profile, opportunities, career, income, investments |
| `recruiter`| Post opportunities, search talent pool           |
| `provider` | Post grants/scholarships/tenders                  |
| `investor` | Investment module + opportunity discovery         |
| `admin`    | Full platform management                          |

---

## Seed Accounts

| Email                    | Password    | Role      |
|--------------------------|-------------|-----------|
| admin@hcw.co.ke          | Admin@1234  | admin     |
| brian@example.com        | User@1234   | user      |
| hr@safaricom.co.ke       | User@1234   | recruiter |

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npx vercel --prod
# Set NEXT_PUBLIC_API_URL in Vercel dashboard
```

### Backend → Railway
```bash
# Connect GitHub repo in Railway
# Set all environment variables from .env.example
# Deploy: railway up
```

---

## Monetization

- **Pro Subscription** — KSh 499/month (AI Career Coach, unlimited opportunities)
- **Recruiter Plan** — KSh 2,499/month (candidate search, unlimited postings)
- **Verification Fees** — KSh 200 per skill/cert verification
- **Sponsored Opportunities** — Featured listings for providers
- **Transaction Fees** — 2% on M-Pesa payments

---

Built with ♥ for African professionals.
