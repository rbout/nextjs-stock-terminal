# Stock Terminal

A portfolio project styled as a stock trading terminal. Uses live market data
via Alpha Vantage, but all trades are simulated — no real money is involved.

## Stack

- Next.js 16 (App Router), React 19
- Tailwind CSS v4
- Fonts: Fraunces (display/serif) + Inter (body), loaded via `next/font/google`
- Data: [Alpha Vantage](https://www.alphavantage.co/) free tier (25 req/day, 5/min)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add your Alpha Vantage API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    page.tsx              # home dashboard
    login/page.tsx         # sign-in
    market/page.tsx         # market overview
    stock/[symbol]/page.tsx # stock detail, e.g. /stock/AAPL
  components/ui/           # shared primitives (Card, ...)
  lib/
    alpha-vantage.ts       # server-only API client with per-endpoint cache windows
    format.ts              # currency/percent formatting + gain/loss color helpers
```

## Design system

See `DESIGN.md` for the full color palette, typography, and page-by-page
design notes.

## Data budget

Alpha Vantage's free tier is 25 requests/day, 5/minute, shared across all
visitors — not per-user. All API calls are server-side only and go through
Next.js's fetch cache (`next: { revalidate }`) with windows tuned per
endpoint (see `src/lib/alpha-vantage.ts`). Never call these from a client
component or on every page load.
