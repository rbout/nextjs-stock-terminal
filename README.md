# Stock Terminal

A full-stack portfolio project styled as a stock trading terminal. It uses
live market data, but every trade is simulated — no real money is ever
involved. Built to demonstrate end-to-end product and engineering work: UI
design, a real Postgres-backed auth system, and a data layer designed around
a hard API rate limit.

Built by [Robert Boutillier](https://www.linkedin.com/in/robert-boutillier-0aa0ba15b/).

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 — design tokens (colors, light/dark values,
  fonts) live in `src/app/globals.css` via `@theme`
- **Fonts**: Lora (display/serif) + Inter (body), loaded via
  `next/font/google`
- **Auth**: Custom session-based auth — `bcryptjs` for password hashing,
  `zod` for input validation, and an httpOnly session cookie backed by a
  `Session` table (no third-party auth provider)
- **Database**: Postgres via [Prisma ORM](https://www.prisma.io/) 7
  (driver-adapter model — `@prisma/adapter-pg` + `pg`)
- **Animation**: [Motion](https://motion.dev/) for animations
- **Icons**: [lucide-react](https://lucide.dev/)
- **Data**: [Alpha Vantage](https://www.alphavantage.co/) free tier
  (25 req/day, 5/min)

## Getting started

\`\`\`bash
npm install               # also runs `prisma generate` via postinstall
cp .env.local.example .env.local   # add your Alpha Vantage API key
\`\`\`

Then set up the database:

1. Get a free Postgres database (e.g. [Neon](https://neon.tech)) and put the
   connection string in `.env` as `DATABASE_URL`.
2. Run migrations: `npx prisma migrate dev --name init`

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Project structure

\`\`\`
prisma/
schema.prisma            # User + Session models (Postgres)
src/
app/
page.tsx                # home dashboard
login/page.tsx          # sign-in / sign-up (toggle)
market/page.tsx         # market overview
stock/[symbol]/page.tsx # stock detail, e.g. /stock/AAPL
api/auth/
signup/route.ts       # POST — hash password, create user, start session
logout/route.ts       # POST — invalidate session, clear cookie
components/
login/
AuthCard.tsx           # sign-in/sign-up form + submit handling
RibbonBackground.tsx   # decorative wave background (login page)
ui/                      # shared primitives (Card, Input, Checkbox,
# ThemeToggle, LogoutButton, GrainOverlay, ...)
lib/
alpha-vantage.ts         # server-only API client with per-endpoint cache windows
format.ts                # currency/percent formatting + gain/loss color helpers
prisma.ts                # Prisma Client singleton (driver adapter)
password.ts              # bcrypt hash/verify helpers
session.ts               # session token creation, cookie set/clear
proxy.ts                   # redirects signed-out visitors to /login
# (Next.js 16's renamed middleware convention)
\`\`\`

## Auth

Sign-up is fully wired: `AuthCard` posts to `/api/auth/signup`, which
validates input with `zod`, hashes the password with `bcrypt`, creates the
`User` row, and starts a session (a random token stored as the `Session`
row's own id, set as an httpOnly cookie). Logout deletes that row
server-side, not just the cookie, so a leaked token stops working
immediately.

Sign-in isn't built yet — the form's toggle UI exists, but submitting it
just shows a "not wired up yet" message. `proxy.ts` currently only checks
that the `session` cookie is *present*, not that it's valid or unexpired;
real validation (a `getCurrentUser()`-style lookup against the `Session`
table) still needs to be added wherever pages need to know who's signed in.

## Design system

See `DESIGN.md` for the full color palette, typography, and page-by-page
design notes.

## Data budget

Alpha Vantage's free tier is 25 requests/day, 5/minute, shared across all
visitors — not per-user. All API calls are server-side only and go through
Next.js's fetch cache (`next: { revalidate }`) with windows tuned per
endpoint (see `src/lib/alpha-vantage.ts`). Never call these from a client
component or on every page load.
