# Next.js Stock Terminal — Design Summary

**What this is:** A portfolio project demonstrating full-stack engineering skill, styled as a stock trading app. Not a real brokerage — uses live market data, but all trades are simulated and no real money is involved. Users are encouraged to sign up with a fake email.

---

## Design System

**Fonts**
- Headings, prices, and large numbers: `Fraunces` (serif) — weights 500/600
- Body, labels, UI text: `Inter` — weights 400/500/600

**Color palette**

| Role | Hex | Notes |
|---|---|---|
| Page background | `#F5F1E8` | cream |
| Card background | `#FAF8F3` | slightly lighter cream |
| Card border | `#DEDACD` | |
| Primary text | `#2B2B26` | near-black warm |
| Secondary/label text | `#6B6656` | use over `#8A8577` for anything under ~13px — better contrast |
| Muted/tertiary text | `#8A8577` | fine for large text or truly de-emphasized notes only |
| Accent (logo, primary CTA) | `#C9793F` | terracotta/orange |
| Positive/gains | `#4A6741` (UI) / `#3D5636` (small P/L text, higher contrast) | sage/forest green |
| Negative/losses | `#A64B3F` | muted red/rust |
| Background art accent | `#EFB07A` | amber, used in ribbon art only |

These are wired into Tailwind v4 via `src/app/globals.css` (`:root` vars +
`@theme inline`), so use utility classes like `bg-background`, `text-primary`,
`bg-accent`, `text-positive`, `border-card-border`, `font-serif` / `font-sans`
directly rather than hardcoding hex values in components.

**Background art (login/marketing use)**
Flowing ribbon shapes built from flat SVG paths layered with opacity (not true gradients), using: `#EFB07A`, `#C9793F`, `#7C9070`, `#A64B3F`, `#4A6741`. A working animated version (slow transform-based wave, blurred edges, respects `prefers-reduced-motion`) was built as `AnimatedRibbonBackground.jsx` in an earlier chat — needs to be re-added to `src/components/` (not carried over automatically between chats).

---

## Pages Designed So Far

### 1. Home dashboard
- **Stat cards**: Portfolio Value, Today's Change, Buying Power — each with a small subtext line (e.g. "+20% year-to-date", "+1.37% today", "$1,200 available to withdraw")
- **Watchlist** widget (symbol/last/change%) — separate from holdings to avoid duplicate widgets
- **Portfolio performance** chart with time-range toggle (1M/3M/1Y/All)
- **Holdings** table (symbol, qty, avg cost, last, market value, P/L) — replaced the original "market movers" widget on home, since movers vs. watchlist read as duplicates
- **Empty states** (new account, $0 balance): icon + plain headline + one-line explainer + single CTA, for watchlist, chart, and holdings independently

### 2. Deposit funds modal
- Preset amount chips ($1,000/$10,000/$50,000/$100,000) + custom amount field
- CTA button label updates with selection ("Deposit $1,000")
- Repeats the simulated-money disclaimer
- **Decision**: new accounts must go through this mock deposit flow — buying power is not auto-granted
- Modal width: 400–480px is the right range for a form modal like this

### 3. Login / sign-in
- Card with email/password, "remember me," sign-in button, Google/Passkey (dropped SSO — enterprise-only feature)
- Animated ribbon background art (see above)
- Disclaimer footer: *"This is a demo project built for portfolio purposes, not a real brokerage. It uses live market data, but all trades are simulated and no real money changes hands. Feel free to sign up with a fake email to try it out."* + link to full disclaimer

### 4. Market page
- Market status pill (open/closed)
- Search bar
- Top Gainers / Top Losers / Most Active — **tabbed UI backed by a single API call** (`TOP_GAINERS_LOSERS` returns all three)
- Market news feed with small source icons (favicon service + letter-avatar fallback for unknown sources)
- Economic indicators strip: CPI, Unemployment, Fed Funds Rate, 10Y Treasury Yield (4 separate calls, but only needs monthly refresh)

### 5. Stock detail page (e.g. AAPL)
- Header: logo/ticker tile, company name, price, $ and % change, Watchlist / Buy / Sell buttons
- **Sell button disabled state** when user owns 0 shares of that stock — grayed out (not hidden), tooltip on hover: "You don't own any AAPL shares," `cursor: not-allowed`. Needs a tap-to-reveal equivalent for mobile (no hover).
- Price chart with time-range toggle + "Delayed 15 min" label directly on the chart
- Key stats card: open, prev close, day range, 52w range, volume, market cap, P/E, dividend yield
- About/company overview blurb + sector/industry/employee count
- Ticker-specific news with bullish/bearish sentiment tags (from `NEWS_SENTIMENT`)
- **"Your position" widget**: shares owned, avg cost/share, market value, total P/L (shown in both $ and %) — with its own empty state when the user owns 0 shares of that stock

---

## Data: Alpha Vantage API

**Critical constraint**: Free tier = **25 requests/day, 5/minute**. This must shape the architecture:
- Fetch and cache server-side on a schedule (cron job or Next.js ISR revalidation), never fetch live per user request
- Budget requests carefully across widgets — see `src/lib/alpha-vantage.ts` for the per-endpoint cache windows this project uses

**Endpoints identified as relevant (free tier):**
- `GLOBAL_QUOTE` — single-ticker price/volume
- `TIME_SERIES_DAILY` — historical price chart data
- `TOP_GAINERS_LOSERS` — gainers/losers/most-active in one call
- `SYMBOL_SEARCH` — ticker search (consider caching a static symbol list instead of live autocomplete, to avoid burning quota per keystroke)
- `MARKET_STATUS` — open/closed status across multiple global exchanges in one call
- `NEWS_SENTIMENT` — market/ticker news with bullish/bearish/neutral sentiment scores; filterable by ticker or topic
- `OVERVIEW` — company fundamentals (market cap, P/E, sector, dividend yield, description) — cache aggressively, changes rarely
- Economic indicators (`CPI`, `UNEMPLOYMENT`, `FEDERAL_FUNDS_RATE`, `TREASURY_YIELD`, etc.) — monthly cadence, cheap to cache
- `EARNINGS_CALENDAR`, `IPO_CALENDAR` — one call returns a full list, request-efficient

**Not available / avoid on free tier:**
- Index Data APIs (S&P 500, Nasdaq, Dow, VIX) — Premium only
- Realtime Bulk Quotes, Realtime intraday — Premium only
- Options data — Premium-heavy, likely skip entirely for v1

**Data freshness note**: Free tier quote/daily data is end-of-day, not realtime. If using a paid tier for delayed (15-min) data, label it clearly on price displays.

---

## Open Decisions (not yet resolved)

- Does "Explore stocks" / "Add a stock" work pre-deposit, or does it route straight into the deposit flow for a $0 account?
- Ribbon background animation: continuous slow wave (as built) vs. settle-then-still on page load?
- Does "market value" on the position widget use a live-fetched price or the last cached price from the scheduled refresh? (Leaning cached, given the request budget.)
- Buy and Sell: two separate modals/flows, or one shared order form with a toggle?
- Mobile layouts not yet designed for any page — stat cards, key-stats grid, and the economic indicators strip will all need a stacked/2-column fallback.

---

## Setup log

- **2026-07-24**: Ran `create-next-app` (JS, App Router, Tailwind v4, `src/` dir, ESLint). Wired the palette above into `src/app/globals.css`, swapped default fonts for Fraunces + Inter in `src/app/layout.tsx`, stubbed routes for dashboard/login/market/stock detail, and added `src/lib/alpha-vantage.ts` + `src/lib/format.ts`. `AnimatedRibbonBackground.jsx` from the earlier design chat still needs to be brought over.
