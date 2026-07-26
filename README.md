# Stock Terminal

A full-stack portfolio project styled as a stock trading terminal. It uses
live market data, but every trade is simulated — no real money is ever
involved. Built to demonstrate end-to-end product and engineering work: UI
design, a real Postgres-backed auth system, and a data layer designed around
a hard API rate limit.

Built by [Robert Boutillier](https://www.linkedin.com/in/robert-boutillier-0aa0ba15b/).

## Stack

- **Framework**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS — design tokens (colors, light/dark values,
  fonts) live in `src/app/globals.css` via `@theme`
- **Auth**: Custom session-based auth — `bcryptjs` for password hashing,
  `zod` for input validation, httpOnly session cookies backed by a database
  table (no third-party auth provider)
- **Database**: Postgres via [Prisma ORM](https://www.prisma.io/)
- **Animation**: [Motion](https://motion.dev/)
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
2. Run migrations: `npx prisma migrate dev`

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000).

## Project structure

\`\`\`
prisma/
schema.prisma       # database models
src/
app/                # pages and API routes (Next.js App Router)
components/
login/             # components specific to the sign-in/sign-up page
ui/                # shared primitives used across pages
lib/                 # server-side helpers (Prisma client, auth, formatting,
# the Alpha Vantage client)
proxy.ts             # redirects signed-out visitors to /login
# (Next.js's renamed middleware convention)
\`\`\`

For what's implemented versus still a stub, read the code — routes, models,
and components are named for what they do, and comments cover any
non-obvious tradeoffs at the point they matter rather than being restated
here.

## Design system

See `DESIGN.md` for the full color palette, typography, and page-by-page
design notes.

## Data budget

Alpha Vantage's free tier is 25 requests/day, 5/minute, shared across all
visitors — not per-user. All API calls are server-side only and go through
Next.js's fetch cache (`next: { revalidate }`) with windows tuned per
endpoint (see `src/lib/alpha-vantage.ts`). Never call these from a client
component or on every page load.
