import { query } from "./db.js";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  "originalPrice" DOUBLE PRECISION,
  rating DOUBLE PRECISION DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  description TEXT,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  stock INTEGER DEFAULT 0,
  badge TEXT,
  specs JSONB DEFAULT '{}',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  addresses JSONB DEFAULT '[]',
  wishlist JSONB DEFAULT '[]',
  banned BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  items JSONB DEFAULT '[]',
  total DOUBLE PRECISION DEFAULT 0,
  shipping DOUBLE PRECISION DEFAULT 0,
  tax DOUBLE PRECISION DEFAULT 0,
  coupon JSONB,
  "shippingMethod" TEXT,
  "giftWrap" BOOLEAN DEFAULT false,
  notes TEXT,
  address JSONB,
  status TEXT DEFAULT 'confirmed',
  "statusHistory" JSONB DEFAULT '[]',
  "trackingNumber" TEXT,
  "estimatedDelivery" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  "userId" TEXT,
  "userName" TEXT,
  rating INTEGER NOT NULL,
  title TEXT DEFAULT '',
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  discount DOUBLE PRECISION DEFAULT 0,
  type TEXT DEFAULT 'percent',
  "minOrder" DOUBLE PRECISION DEFAULT 0,
  "maxUses" INTEGER DEFAULT 100,
  used INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  "expiresAt" DATE
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  "bgGradient" TEXT,
  cta TEXT,
  link TEXT,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS stock_log (
  id TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  note TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  amount DOUBLE PRECISION NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  recurring BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'text'
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  published BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_productId ON reviews("productId");
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_stock_log_productId ON stock_log("productId");
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
`;

const DEFAULTS = `
INSERT INTO settings (key, value, type) VALUES
  ('store_name', 'RT ELECTRONICS', 'text'),
  ('store_email', 'support@rtelectronics.com', 'text'),
  ('store_phone', '+1 (555) 123-4567', 'text'),
  ('store_address', '123 Tech Street, Silicon Valley, CA 94025', 'text'),
  ('currency', 'USD', 'text'),
  ('tax_rate', '0.08', 'number'),
  ('free_shipping_min', '100', 'number'),
  ('shipping_rate', '10', 'number'),
  ('low_stock_threshold', '5', 'number'),
  ('order_prefix', 'RT-', 'text'),
  ('facebook_url', '', 'text'),
  ('twitter_url', '', 'text'),
  ('instagram_url', '', 'text'),
  ('about_text', 'RT Electronics is your premier destination for cutting-edge technology and electronics.', 'textarea'),
  ('announcement', '', 'text'),
  ('announcement_active', 'false', 'boolean'),
  ('maintenance_mode', 'false', 'boolean')
ON CONFLICT (key) DO NOTHING;

INSERT INTO pages (id, slug, title, content, published) VALUES
  ('about-page', 'about', 'About Us', '', true),
  ('faq-page', 'faq', 'Frequently Asked Questions', '', true),
  ('privacy-page', 'privacy', 'Privacy Policy', '', true),
  ('terms-page', 'terms', 'Terms of Service', '', true)
ON CONFLICT (slug) DO NOTHING;
`;

export async function migrate() {
  try {
    const statements = SCHEMA.split(";").filter((s) => s.trim());
    for (const stmt of statements) {
      try { await query(stmt); } catch (e) { /* skip if already exists */ }
    }
    const defaultStatements = DEFAULTS.split(";").filter((s) => s.trim());
    for (const stmt of defaultStatements) {
      try { await query(stmt); } catch (e) { /* skip conflicts */ }
    }
    console.log(" Migration complete");
  } catch (e) {
    console.error(" Migration error:", e.message);
  }
}
