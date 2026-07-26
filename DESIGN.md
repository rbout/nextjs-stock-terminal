# Design System

Design reference for Stock Terminal — a portfolio project demonstrating
full-stack engineering skill, styled as a stock trading app. Not a real
brokerage — it uses live market data, but all trades are simulated and no
real money is involved. Users are encouraged to sign up with a fake email.

The values below are documented for readability; `src/app/globals.css` is
the actual source of truth. If they ever drift, trust the CSS.

---

## Typography

- Headings, prices, and large numbers: `Lora` (serif)
- Body, labels, UI text: `Inter` (sans)

Both are loaded via `next/font/google` in `src/app/layout.tsx` and exposed
as the `font-serif` / `font-sans` Tailwind utilities — components should
reach for those classes rather than naming a font directly.

## Color palette

Every color is a CSS custom property in `:root` (light mode) with a `.dark`
override, mapped to Tailwind tokens via `@theme inline`. Use the Tailwind
classes (`bg-background`, `text-primary`, `bg-accent`, `text-positive`,
`border-card-border`, etc.) rather than hardcoding hex values.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `background` | `#F4F1E6` | `#1B1815` | page background |
| `card` | `#FCFAF5` | `#242019` | |
| `card-border` | `#DFD9C4` | `#3A342A` | |
| `text-primary` | `#1E1B18` | `#F2EEE3` | |
| `text-secondary` | `#7A756B` | `#B5AD9C` | labels, secondary text |
| `text-muted` | `#8A8577` | `#948C79` | large or de-emphasized text only |
| `accent` | `#C98A27` | `#E0A54B` | primary CTA, links |
| `positive` | `#556B2F` | `#8CAA63` | gains |
| `positive-strong` | `#3D5636` | `#A6C583` | small P/L text — higher contrast |
| `negative` | `#A04028` | `#D97A5C` | losses |

Dark-mode values aren't just the light values inverted — signal colors in
particular are re-tuned per mode to keep AA contrast against each
background rather than reusing one hue pair for both.

**Background art only** (not for UI or text): `#EFB07A`, `#C9793F`,
`#7C9070`, `#A64B3F`, `#4A6741` — the ribbon illustration on the login page.
These don't have dark-mode variants; the ribbon is only used on the cream
login background today.

## Dark mode

Manual toggle (`ThemeToggle`, fixed bottom-right, global), not just
`prefers-color-scheme` — a `.dark` class on `<html>`, persisted to
`localStorage`, with an inline blocking script in `layout.tsx` that applies
it before first paint to avoid a flash of the wrong theme. Falls back to OS
preference on a first visit with no saved choice.

## Texture

A subtle global grain/paper overlay (`GrainOverlay`, mounted once in
`layout.tsx`) — procedural SVG noise (`feTurbulence`), desaturated, at low
opacity with a blend mode, fixed over every page. Meant to read as a bit of
ink-on-paper texture rather than a flat digital surface; should stay subtle
enough that it's felt more than seen.

## Login page

- **Background**: `RibbonBackground` — flowing wave shapes in the palette
  above, each band with its own slightly different amplitude/frequency/phase
  so they read as hand-drawn rather than mechanically parallel. Hidden below
  `md` until a mobile treatment is designed.
- **Header**: logo lockup only (`Next.js` in accent, `Stock Terminal` in
  primary), serif, bottom border.
- **Card**: sign-in/sign-up toggle in one component (`AuthCard`), spring
  transition between modes. Sign-in: email, password, "remember me",
  "forgot password" link. Sign-up: adds name and confirm-password fields.
- **Footer**: disclaimer text + link to the full disclaimer, border-top to
  separate from the page.

## Home dashboard

- **Stat cards**: Portfolio Value, Today's Change, Buying Power — each with
  a small subtext line (e.g. "+20% year-to-date", "+1.37% today", "$1,200
  available to withdraw")
- **Watchlist** widget (symbol/last/change%) — separate from holdings to
  avoid duplicate widgets
- **Portfolio performance** chart with time-range toggle (1M/3M/1Y/All)
- **Holdings** table (symbol, qty, avg cost, last, market value, P/L)
- **Empty states** (new account, $0 balance): icon + plain headline +
  one-line explainer + single CTA, for watchlist, chart, and holdings
  independently

## Deposit funds modal

- Preset amount chips ($1,000/$10,000/$50,000/$100,000) + custom amount
  field
- CTA button label updates with selection ("Deposit $1,000")
- Repeats the simulated-money disclaimer
- New accounts must go through this mock deposit flow — buying power is not
  auto-granted
- Modal width: 400–480px

## Market page

- Market status pill (open/closed)
- Search bar
- Top Gainers / Top Losers / Most Active — tabbed UI backed by a single API
  call (`TOP_GAINERS_LOSERS` returns all three)
- Market news feed with small source icons (favicon service + letter-avatar
  fallback for unknown sources)
- Economic indicators strip: CPI, Unemployment, Fed Funds Rate, 10Y Treasury
  Yield (4 separate calls, monthly refresh)

## Stock detail page (e.g. AAPL)

- Header: logo/ticker tile, company name, price, $ and % change, Watchlist /
  Buy / Sell buttons
- Sell button disabled when the user owns 0 shares — grayed out (not
  hidden), tooltip on hover, tap-to-reveal equivalent needed for mobile
- Price chart with time-range toggle + "Delayed 15 min" label directly on
  the chart
- Key stats card: open, prev close, day range, 52w range, volume, market
  cap, P/E, dividend yield
- About/company overview blurb + sector/industry/employee count
- Ticker-specific news with bullish/bearish sentiment tags
- "Your position" widget: shares owned, avg cost/share, market value, total
  P/L ($ and %) — own empty state when the user owns 0 shares

## Data: Alpha Vantage API

Free tier = 25 requests/day, 5/minute. Fetch and cache server-side on a
schedule (Next.js fetch cache / ISR revalidation), never live per user
request. See `src/lib/alpha-vantage.ts` for the endpoint list and the cache
window chosen per endpoint.

## Open decisions

- Does "Explore stocks" / "Add a stock" work pre-deposit, or route straight
  into the deposit flow for a $0 account?
- Does "market value" on the position widget use a live-fetched price or
  the last cached price from the scheduled refresh? (Leaning cached, given
  the request budget.)
- Buy and Sell: two separate modals/flows, or one shared order form with a
  toggle?
- Mobile layouts not yet designed for any page.
