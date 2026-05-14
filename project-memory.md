# RT Electronics — Project Memory

## Overview
E-commerce store (electronics & gaming) — React (Vite) frontend + Express API + Supabase Postgres. Deployed on Vercel.

## URLs
- **Production:** https://rt-electronics.vercel.app
- **Vercel Dashboard:** https://vercel.com/pathgridagencys-projects/rt-electronics
- **API base:** `/api` (serverless function at `api/index.js`)

## Repo & Commands
- **Directory:** `C:\Users\Admin\Documents\GitHub\rt-electronics`
- **Deploy:** `vercel deploy --prod` (run from project root)
- **Local dev:** `vercel dev` (starts both frontend Vite dev server + API serverless function)
- **Build:** `npm run build` (Vite)
- **Seed:** `node server/seed.js` (populates 258 products, 9 categories, orders, etc.)

## Project Config
- **Framework preset (Vercel):** `vite`
- **Vercel CLI version:** 53.3.2

## Key Files
| File | Purpose |
|------|---------|
| `api/index.js` | Serverless entry point — imports `server/app.js` |
| `server/app.js` | Express app — routes, middleware, CORS, session |
| `server/db.js` | pg Pool connection |
| `server/seed.js` | Seeds 258 products, 9 categories, orders, reviews, etc. |
| `src/services/api.js` | Frontend API client — `BASE = "/api"`, all endpoints |
| `src/App.jsx` | React root — routes, layout, providers |
| `src/main.jsx` | Entry point — wraps App with `I18nextProvider` |
| `src/i18n/index.js` | i18next config — language detector, RTL switching |
| `src/locales/en/translation.json` | English translations (~400 keys) |
| `src/locales/fr/translation.json` | French translations |
| `src/locales/ar/translation.json` | Arabic translations |
| `src/styles/index.css` | Tailwind + fonts + dark/light glass theme + text-white overrides |
| `src/styles/variables.css` | Light/dark CSS custom properties |
| `src/context/ThemeContext.jsx` | Dark/Light toggle, `data-theme` on `<html>`, localStorage `rt-theme` |
| `vercel.json` | Rewrites: `/api/(.*)` → `/api`, `/(.*)` → `/index.html` |

## Design Language
- **Theme:** Dark glass (dark backgrounds, glassmorphism cards, red accent `#DC2626`)
- **Light theme:** Pure white/red/black (`#FFFFFF` bg, `#000000` text, `#DC2626` accents)
- **Fonts:** Syncopate (logo), Space Grotesk (body), Inter (UI), JetBrains Mono (code)
- **All content from SQL database** — no hardcoded products or categories
- **Category icons:** Emoji strings in JSX

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

## What Has Been Done

### Multi-language Support (i18n) — COMPLETED May 14, 2026
- **i18n config:** `src/i18n/index.js` — i18next + react-i18next, language detection (localStorage → browser → `en` fallback), RTL direction switching on `<html>`
- **Translation files:**
  - `src/locales/en/translation.json` — English (400+ keys across 20 sections)
  - `src/locales/fr/translation.json` — French translations
  - `src/locales/ar/translation.json` — Arabic translations
- **Language Switcher:** Globe icon button in Header cycling EN → FR → AR, persisted as `rt-lang` in localStorage
- **RTL:** Arabic sets `dir="rtl"` + `lang="ar"` on `<html>`; EN/FR set `dir="ltr"`
- **Files with `t()` replacements done:**
  - `src/main.jsx` (I18nextProvider wrapper)
  - `src/components/layout/Header.jsx` (brand, nav, user menu, search)
  - `src/components/layout/Footer.jsx` (links, contact, copyright)
  - `src/components/home/HeroSection.jsx` (headings, badges, CTAs, features)
  - `src/components/home/FeaturedProducts.jsx` (section titles)
  - `src/components/home/CategoryShowcase.jsx` (section titles, descriptions)
  - `src/components/product/ProductCard.jsx` (VIEW badge, toast messages)
  - `src/components/product/ProductGrid.jsx` (empty/no-results text)
  - `src/components/product/ProductFilter.jsx` (all filter labels, sort options)
  - `src/components/ui/SearchBar.jsx` (placeholder)
  - `src/components/ui/Breadcrumbs.jsx` (Home link)
  - `src/components/ui/ChatWidget.jsx` (channel UI, form, messages)
  - `src/components/cart/CartSummary.jsx` (order summary, checkout button, trust badges)
  - `src/components/extra/CookieConsent.jsx` (consent banner)
  - `src/components/extra/TrustBadges.jsx` (badge labels)
  - `src/pages/Home.jsx` (newsletter, contact form, section titles, admin button)
  - `src/pages/Products.jsx` (sort options, product count, labels)
  - `src/pages/Cart.jsx` (empty state, order summary, checkout)
  - `src/pages/Checkout.jsx` (entire flow: shipping, payment, coupon, order confirmed)
  - `src/pages/Login.jsx` (title, form labels, buttons, errors)
  - `src/pages/Register.jsx` (title, form labels, buttons, errors)
  - `src/pages/Wishlist.jsx` (empty state, title, buttons)
  - `src/pages/FAQ.jsx` (badge, title, search, all 10 Q&A pairs)
  - `src/pages/Contact.jsx` (form, success state, info section)
  - `src/pages/About.jsx` (stats, values, descriptions, CTA)
  - `src/pages/NotFound.jsx` (404 message, buttons)
  - `src/pages/Account.jsx` (tabs, profile data, orders, addresses)
  - `src/pages/Admin.jsx` (NOT translated — large file, admin-only, lower priority)
  - `index.html` (added `dir="ltr"` initial attribute)

### Light Theme (Pure White/Red/Black) — COMPLETED
- Replaced `[data-theme="light"]` with `:root:not([data-theme="dark"])` for pre-hydration flash fix
- Pure `#FFFFFF` backgrounds, `#000000` text, `#DC2626` red accents
- Updated all CSS variable aliases (`--bg`, `--text`, etc.)
- Enhanced text-white opacity overrides with dark slate values
- Mega-menu background uses CSS variables

## What Still Needs To Be Done

### 1. Admin.jsx Translation — Lower Priority
- `src/pages/Admin.jsx` (~1000+ lines) still has hardcoded English strings
- 15 admin tab labels, ~30+ toast messages, form labels, table headers, buttons
- Can be done by adding `useTranslation()` hook and replacing strings
- Or leave as-is since admin-only section is likely used in English

### 2. Toast/Notification String Gaps
- A few toast messages across the app use hardcoded English strings not yet translated:
  - `Cart.jsx` — some toast for item removal
  - `Checkout.jsx` — "Please fill all required fields", "Coupon applied!", "Order failed. Please try again."
  - `Contact.jsx` — "Fill in required fields", "Failed to send"
  - `Home.jsx` — "Fill in all required fields", "Subscription failed", "Failed to send"
  - `Account.jsx` — "Profile updated", "Update failed", "Address added", etc.
  - `Login.jsx` — "Access granted", "Invalid credentials"
  - `Register.jsx` — "Profile initialized", "Registration failed"
  - These are visible as toast popups — should be translated for full localization

### 3. Missing Translation Keys Check
- Run the app in dev mode, switch to French/Arabic, check all pages for missing `t()` calls that fall back to English
- Look for any hardcoded strings that were missed in the initial pass
- Particularly: placeholder attributes, aria-labels, title attributes, dynamic error messages from API

### 4. Language Preference Persistence on First Visit
- `i18n/index.js` checks `localStorage` then `navigator.language` then falls back to `"en"`
- Currently only `"en"`, `"fr"`, `"ar"` are explicit language codes in the navigator check — extended browser language codes like `"fr-CA"` would fall through to `"en"`
- Optionally add a language detection modal/prompt on first visit to let user choose language

### 5. SEO / Meta Tags
- `index.html` has hardcoded `<title>` and `<meta name="description">` in English
- Should dynamically update based on current language
- Could use `react-helmet-async` or update `document.title` from `useEffect` on language change

### 6. Right-to-Left (RTL) CSS Polish
- The `dir="rtl"` attribute is set on `<html>` for Arabic, but some CSS may need RTL-specific overrides:
  - Flex/grid directions for nav items, header layout, mega-menu positioning
  - Input icon positions (search icon on left vs right)
  - Text alignment in specific sections
  - ChevonRight icons should flip to ChevronLeft in RTL
- Search the codebase for `left-`, `right-`, `ml-`, `mr-`, `pl-`, `pr-` Tailwind classes that may need RTL variants (use `ltr:` / `rtl:` Tailwind prefixes)

### 7. Dynamic Content Translation (Database-driven)
- Product names, descriptions, category names come from the database — these are currently in English
- To fully localize, you'd need:
  - Add language columns to DB tables (e.g. `name_en`, `name_fr`, `name_ar`)
  - Update API to accept `?lang=` parameter and return appropriate column
  - Update frontend to pass current language to API calls
- This is a large effort — defer for now

### 8. Code-Splitting / Bundle Size
- Bundle is 1.9MB (minified) — Vite warns about chunk size
- Could use `React.lazy` + `Suspense` for route-level code splitting
- `three.js` / `@react-three/fiber` are heavy dependencies — consider dynamic import for 3D components
- i18n translation files are imported synchronously — could lazy-load them

## Key Implementation Details

### i18n Pattern Used
```jsx
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation();
  return <div>{t("section.key")}</div>;
}
```

### Translation Key Structure
- Organized by component/page: `header.brand`, `hero.shop_all`, `checkout.place_order`, etc.
- Interpolation: `t("units_found", { count: n })`
- Nested JSON keys for readability

### Theme System
- `:root` = light theme (no `data-theme` attribute needed)
- `:root[data-theme="dark"]` = dark theme
- CSS variables in `src/styles/variables.css`
- Text-white overrides in `src/styles/index.css` (Steps 1-3)

### RTL Implementation
- `i18n.on("languageChanged")` handler sets `document.documentElement.dir`
- Initial dir set synchronously in `src/i18n/index.js` before React renders
- `lang` attribute also updated on `<html>`

## Things Not To Touch
- The theme toggle implementation in `src/context/ThemeContext.jsx` — do not change the localStorage key `rt-theme`
- The CSS text-white override strategy (Steps 1-3 in index.css) — critical for light theme
- Hardcoded categorized text in FAQ component (if you decide not to translate FAQ) — but we've already translated it
- API response format — frontend expects specific shapes
- The `i18n/index.js` language detection order: localStorage → browser → `"en"`

## Handoff Prompt (copy-paste for next session)
```
Continue the RT Electronics project at C:\Users\Admin\Documents\GitHub\rt-electronics.

i18n has been set up (en/fr/ar) with react-i18next. Language switcher in Header cycles EN/FR/AR. RTL dir switching works for Arabic.

What's done: i18n config, translation JSON files (400+ keys), all 27+ page/component files have t() calls replacing hardcoded English strings, I18nextProvider in main.jsx, language switcher in Header.

What remains:
1. Admin.jsx strings (~1000 lines) still hardcoded in English — add useTranslation import and t() calls
2. ~15 toast messages across Cart, Checkout, Contact, Home, Account, Login, Register are still hardcoded — add t() calls
3. Audit for any missed hardcoded strings (placeholders, aria-labels, title attrs, error messages)
4. RTL CSS polish — some left/right Tailwind classes may need ltr:/rtl: variants
5. SEO meta tags should update dynamically per language (react-helmet-async or document.title)
6. Dynamic content (DB-driven product names/categories) — requires DB schema changes, complex
7. Code-splitting for better load performance

Build command: npm run build (works, no errors)
Deploy command: vercel deploy --prod
Production URL: https://rt-electronics.vercel.app
Local dev: vercel dev
```
