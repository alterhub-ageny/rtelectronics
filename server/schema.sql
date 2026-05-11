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

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_orders_userId ON orders("userId");
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_reviews_productId ON reviews("productId");
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
