# RT Electronics — Project Memory

## Overview
E-commerce store (electronics & gaming) — React (Vite) frontend + Express API + Supabase Postgres. Deployed on Vercel.

## URLs
- **Production:** https://rt-electronics.vercel.app
- **Vercel Dashboard:** https://vercel.com/pathgridagencys-projects/rt-electronics
- **API base:** `/api` (serverless function at `api/index.js`)
- **Supabase:** postgresql://postgres.lksyatuvmtstsxvijkwc:HZ3AynYABHQhzn7v@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=require

## Repo & Commands
- **Directory:** `C:\Users\Admin\Documents\GitHub\rt-electronics`
- **Deploy:** `vercel deploy --prod` (run from project root)
- **Local dev:** `vercel dev` (starts both frontend Vite dev server + API serverless function)
- **Build:** `npm run build` (Vite)
- **Seed:** `node server/seed.js` (populates 258 products, 9 categories, orders, etc.)

## Project Config
- **Framework preset (Vercel):** `vite` (was `services`, had to PATCH via API to fix)
- **Vercel project ID:** `prj_rfBc208ifHvKgT9O8cWsi7DgGSFg`
- **Vercel team ID:** `team_pxLegtQQMaxAps4e4zmBklK3`
- **Environment variables set in Vercel:**
  - `DATABASE_URL` (production) — the Supabase connection string
- **Vercel CLI version:** 53.3.2

## Key Files
| File | Purpose |
|------|---------|
| `api/index.js` | Serverless entry point — imports `server/app.js` |
| `server/app.js` | Express app — routes, middleware, CORS, session |
| `server/db.js` | pg Pool connection (strips `?sslmode=require` from DATABASE_URL) |
| `server/seed.js` | Seeds 258 products, 9 categories, orders, reviews, etc. |
| `src/services/api.js` | Frontend API client — `BASE = "/api"`, all endpoints |
| `src/App.jsx` | React root — routes, layout, providers |
| `src/pages/Home.jsx` | Home page — loads all sections from API |
| `src/components/home/HeroSection.jsx` | Hero — fetches featured categories |
| `src/components/home/CategoryShowcase.jsx` | 9-category grid with emoji icons |
| `src/components/home/FeaturedProducts.jsx` | Featured products carousel |
| `src/components/home/PromoSection.jsx` | Promotions from API |
| `src/styles/index.css` | Tailwind + fonts + dark glass theme |
| `vercel.json` | Rewrites: `/api/(.*)` → `/api`, `/(.*)` → `/index.html` |

## Design Language
- **Theme:** Dark glass (dark backgrounds, glassmorphism cards, subtle indigo accents)
- **Fonts:** Syncopate (headings), Space Grotesk (body), Inter (UI), JetBrains Mono (code)
- **Colors:** Indigo accent (`#6366f1`), dark surfaces, white text
- **No "crystal intelligence" / "neural core" / neon gimmicks** — professional tech store tone
- **All content from SQL database** — no hardcoded products or categories
- **Category icons:** Emoji strings in JSX (no dynamic ICON_MAP)

## API Endpoints (key ones)
- `GET /api/categories` — all categories with product counts
- `GET /api/products` — products (supports `?featured=true`, `?ids=...`, pagination)
- `GET /api/products?id=N` — single product
- `GET /api/promotions` — active promotions
- `POST /api/auth/register` / `POST /api/auth/login` — auth
- `GET /api/orders` / `POST /api/orders` — orders
- `GET /api/reviews?productId=N` — reviews
- `POST /api/contact` — contact form
- `POST /api/newsletter` — newsletter subscribe
- `GET /api/admin/stats` — admin dashboard stats
- `POST /api/admin/seed` — re-seed database

## Database (Supabase Postgres)
- **Schema:** ~12 tables (categories, products, users, orders, order_items, reviews, addresses, wishlist, promotions, coupons, contacts, subscribers, settings, pages, chat_conversations, chat_messages, notifications, stock_log, expenses, suppliers)
- **Seed data:** 258 products across 9 categories (laptops, smartphones, gaming PCs, tablets, watches, headphones, accessories, game top-ups, gift cards), plus orders, reviews, users, etc.

## History of Issues Fixed
1. **Seed syntax error** — `server/seed.js` line 96: missing `...[` before 7 category arrays caused `FUNCTION_INVOCATION_FAILED` on Vercel cold start
2. **Framework preset** — Vercel project was set to "services" framework, had to PATCH via `Invoke-RestMethod` to `v2/projects/prj_...` with `{"framework":"vite"}`
3. **DATABASE_URL missing** — env var wasn't set in Vercel production, causing `ECONNREFUSED 127.0.0.1:5432`; added via `vercel env add DATABASE_URL production`
4. **SSL cert error** — `?sslmode=require` in connection string conflicted with explicit `ssl` config; fixed by stripping it in `db.js` with `.replace("?sslmode=require", "")`
5. **Frontend showing blank** — was downstream of API failures; once API returned data, frontend rendered correctly

## Current State (as of May 13, 2026)
- [x] API works — returns 9 categories, 258 products, 8 featured
- [x] Home page renders — Hero, CategoryGrid, FeaturedProducts, PromoSection all load from API
- [x] Deployed to Vercel production — `https://rt-electronics.vercel.app`
- [ ] Remaining pages not yet redesigned: product listing, product detail, cart, account, admin, etc.
- [ ] Bundle size warning — `index.js` is 1.7MB (unminified); could code-split

## Design System (as of May 13, 2026 — v3 "Neo-Luxe")

### Color Palette
| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| Background | `#07070D` | `#F5F5F0` | Page bg |
| Surface | `#0D0D1A` | `#FFFFFF` | Cards, menus |
| Crimson | `#E11D48` | `#E11D48` | Primary accent |
| Cyan | `#00E5FF` | `#00E5FF` | Secondary glow accent |
| Gold | `#D4A843` | `#D4A843` | Tertiary luxury |

### Typography
| Font | Weight | Usage |
|------|--------|-------|
| **Playfair Display** | 700 / 400 italic | Headings, section titles, hero |
| **Syncopate** | 700 | Logo, buttons, eyebrow text |
| **Space Grotesk** | 300-700 | Body text |
| **JetBrains Mono** | 400 | Monospaced / technical text |
| **Inter** | 400-800 | UI elements |

### Theme Toggle
- Dark/Light mode via `ThemeContext` (`data-theme` on `<html>`)
- CSS custom properties swap automatically
- Sun/Moon icon button in header
- Persisted in `localStorage` as `rt-theme`

### Component Architecture
- `card-glass` — glassmorphism card with gradient border glow on hover
- `btn-primary` — pill-shaped crimson gradient button with glow
- `btn-outline` — transparent pill with hover border
- `card-glass-solid` — solid elevated card for dropdowns
- `glass-shine` — animated diagonal shine overlay
- `corner-accent` — subtle corner brackets on cards
- `section-eyebrow` — uppercase badge labels (Syncopate, crimson)
- `.section-title` — Playfair Display heading
- `.section-subtitle` — Playfair Display italic

### Header Mega-Menu
- Hovering over a category nav item reveals a floating dropdown
- Shows emoji icon, category name in Playfair italic, description, product count
- Smooth animation with arrow indicator
- Backdrop blur + elevated shadow

### Animations
- `glow-pulse` — slow opacity pulse for background glow orbs
- `float` — gentle Y-axis floating
- `glass-shine` — diagonal light sweep across glass surfaces
- `shimmer` — gradient position animation for borders

## Next Steps (potential)
1. Redesign remaining pages (product listing, product detail, cart) to match dark glass aesthetic
2. Add search with filters
3. Code-split with lazy loading (`React.lazy` + Suspense) for faster initial load
4. Set up preview deployments for PRs
5. Add `NODE_ENV=production` env var in Vercel
