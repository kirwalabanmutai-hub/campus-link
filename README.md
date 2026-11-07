# CampusLink

A marketplace for campus life: services, a shop, paid gigs and an M-Pesa wallet.
Students sign up with their university email and campus. Businesses (for example a
jersey shop near Kabarak) are verified by an admin before they can sell, and their
products are shown only to students at the campus they chose.

## First-time setup

1. Install [Node.js](https://nodejs.org) 22.9 or newer.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env` and set `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
   The admin account is created from these the first time the server starts.

## Running it on your computer

Open two terminals in this folder:

| Terminal | Command | What it does |
|---|---|---|
| 1 | `npm run server` | Starts the CampusLink server (accounts, uploads, products, gigs) on port 3001 |
| 2 | `npm run dev` | Starts the website at http://localhost:5173 and forwards `/api` to the server |

Sign in with the admin email and password at `/login.html` to open the admin panel.

## Putting it online

1. `npm run build` creates the finished site in `dist/`.
2. `npm start` runs one server that delivers both the site and the API (port `PORT`, default 3001).
3. Serve it over HTTPS and set `NODE_ENV=production` so the sign-in cookie is marked secure.
4. Keep the data folder (`server/data/` or `DATA_DIR`) on persistent storage and back it up.
   It holds the database, the businesses' KRA certificates and permits, and product photos.

Any host that runs a long-lived Node.js process with a persistent disk works,
for example a small VPS, Railway or Render with a mounted volume.

## How the pieces fit

- `*.html` and `public/`: the website. `public/data.js` has `CampusAPI`, which pages use to talk to the server.
- `server/index.js`: the API. `server/db.js`: the SQLite tables (uses Node's built-in `node:sqlite`).
- Account types: **student** (university email + campus), **business** (verified with KRA PIN
  certificate, business permit and shop location before selling) and **recruiter** (posts gigs).
- Verification documents are private: only a signed-in admin can open them.
  Product photos are public.
