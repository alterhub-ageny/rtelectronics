import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { query } from "./db.js";
import { generateToken, authMiddleware, adminMiddleware } from "./middleware/auth.js";

// Auto-migrate and seed on cold start
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL, description TEXT, icon TEXT, image TEXT, featured BOOLEAN DEFAULT false, "order" INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price DOUBLE PRECISION NOT NULL, "originalPrice" DOUBLE PRECISION, rating DOUBLE PRECISION DEFAULT 0, reviews INTEGER DEFAULT 0, description TEXT, features JSONB DEFAULT '[]', images JSONB DEFAULT '[]', stock INTEGER DEFAULT 0, badge TEXT, specs JSONB DEFAULT '{}', "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT DEFAULT 'user', avatar TEXT, addresses JSONB DEFAULT '[]', wishlist JSONB DEFAULT '[]', banned BOOLEAN DEFAULT false, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, "userId" TEXT NOT NULL, items JSONB DEFAULT '[]', total DOUBLE PRECISION DEFAULT 0, shipping DOUBLE PRECISION DEFAULT 0, tax DOUBLE PRECISION DEFAULT 0, coupon JSONB, "shippingMethod" TEXT, "giftWrap" BOOLEAN DEFAULT false, notes TEXT, address JSONB, status TEXT DEFAULT 'confirmed', "statusHistory" JSONB DEFAULT '[]', "trackingNumber" TEXT, "estimatedDelivery" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, "productId" TEXT NOT NULL, "userId" TEXT, "userName" TEXT, rating INTEGER NOT NULL, title TEXT DEFAULT '', comment TEXT NOT NULL, verified BOOLEAN DEFAULT false, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS coupons (id TEXT PRIMARY KEY, code TEXT NOT NULL, discount DOUBLE PRECISION DEFAULT 0, type TEXT DEFAULT 'percent', "minOrder" DOUBLE PRECISION DEFAULT 0, "maxUses" INTEGER DEFAULT 100, used INTEGER DEFAULT 0, active BOOLEAN DEFAULT true, "expiresAt" DATE);
CREATE TABLE IF NOT EXISTS contacts (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT, message TEXT NOT NULL, read BOOLEAN DEFAULT false, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS subscribers (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS promotions (id TEXT PRIMARY KEY, title TEXT NOT NULL, subtitle TEXT, description TEXT, "bgGradient" TEXT, cta TEXT, link TEXT, active BOOLEAN DEFAULT true);
CREATE TABLE IF NOT EXISTS stock_log (id TEXT PRIMARY KEY, "productId" TEXT NOT NULL, type TEXT NOT NULL, quantity INTEGER NOT NULL, note TEXT, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS expenses (id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'other', amount DOUBLE PRECISION NOT NULL, description TEXT, date DATE NOT NULL, recurring BOOLEAN DEFAULT false, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS suppliers (id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT, email TEXT, phone TEXT, address TEXT, notes TEXT, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, type TEXT DEFAULT 'text');
CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, type TEXT NOT NULL DEFAULT 'info', title TEXT NOT NULL, message TEXT, read BOOLEAN DEFAULT false, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS pages (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, content TEXT DEFAULT '', published BOOLEAN DEFAULT false, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS chat_conversations (id TEXT PRIMARY KEY, "userId" TEXT, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT, status TEXT DEFAULT 'open', unread INTEGER DEFAULT 0, "lastMessage" TEXT, "lastMessageAt" TIMESTAMPTZ, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS chat_messages (id TEXT PRIMARY KEY, "conversationId" TEXT NOT NULL, sender TEXT NOT NULL DEFAULT 'user', name TEXT NOT NULL, message TEXT NOT NULL, "createdAt" TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_stock_log_productId ON stock_log("productId");
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages("conversationId");
`;

async function initDb() {
  try {
    const stmts = SCHEMA_SQL.split(";").filter(Boolean);
    for (const s of stmts) { try { await query(s); } catch {} }
    await seedSettings();
    // Seed full data synchronously (serverless can't rely on setTimeout)
    await seedFull();
    console.log("DB initialized");
  } catch (e) { console.error("DB init error:", e.message); }
}

async function seedSettings() {
  try {
    await query("INSERT INTO settings (key, value, type) VALUES ('store_name','RT ELECTRONICS','text'),('store_email','support@rtelectronics.com','text'),('store_phone','+1 (555) 123-4567','text'),('store_address','123 Tech Street, Silicon Valley, CA 94025','text'),('currency','USD','text'),('tax_rate','0.08','number'),('free_shipping_min','100','number'),('shipping_rate','10','number'),('low_stock_threshold','5','number'),('order_prefix','RT-','text'),('facebook_url','','text'),('twitter_url','','text'),('instagram_url','','text'),('about_text','RT Electronics is your premier destination for cutting-edge technology and electronics.','textarea'),('announcement','','text'),('announcement_active','false','boolean'),('maintenance_mode','false','boolean'),('chart_revenue_color','#22c55e','text'),('chart_expenses_color','#f97316','text'),('chart_profit_color','#a855f7','text'),('chart_bar_animated','true','boolean') ON CONFLICT (key) DO NOTHING");
    await query("INSERT INTO pages (id, slug, title, content, published) VALUES ('about-page','about','About Us','',true),('faq-page','faq','Frequently Asked Questions','',true),('privacy-page','privacy','Privacy Policy','',true),('terms-page','terms','Terms of Service','',true) ON CONFLICT (slug) DO NOTHING");
  } catch {}
}

async function seedFull() {
  try {
    // Skip if seed already complete (25+ orders)
    const { rows: existing } = await query("SELECT COUNT(*) FROM orders");
    if (parseInt(existing[0].count) >= 25) return;

    // Clear partial seed data from any previous failed run
    await query("DELETE FROM stock_log").catch(()=>{});
    await query("DELETE FROM orders").catch(()=>{});
    await query("DELETE FROM expenses").catch(()=>{});
    await query("DELETE FROM coupons").catch(()=>{});
    await query("DELETE FROM suppliers").catch(()=>{});

    const now = new Date().toISOString();
    const hashedPw = await bcrypt.hash("password123", 10);

    // Batch insert test users
    const testUsers = [
      { name: "John Smith", email: "john@example.com" },
      { name: "Sarah Johnson", email: "sarah@example.com" },
      { name: "Mike Chen", email: "mike@example.com" },
    ];
    const userInserts = [], userParams = [];
    for (const u of testUsers) {
      const ex = await query("SELECT id FROM users WHERE email = $1", [u.email]);
      if (!ex.rows.length) {
        const idx = userParams.length;
        userParams.push(uuidv4(), u.name, u.email, hashedPw, "user",
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`, '[]', '[]', now);
        userInserts.push(`($${idx+1},$${idx+2},$${idx+3},$${idx+4},$${idx+5},$${idx+6},$${idx+7}::jsonb,$${idx+8}::jsonb,$${idx+9})`);
      }
    }
    if (userInserts.length) {
      await query(`INSERT INTO users (id,name,email,password,role,avatar,addresses,wishlist,"createdAt") VALUES ${userInserts.join(",")} ON CONFLICT DO NOTHING`, userParams);
    }

    const { rows: userRows } = await query("SELECT id FROM users LIMIT 10");
    if (!userRows.length) return;
    const { rows: prodRows } = await query("SELECT id, name, price FROM products");
    if (!prodRows.length) return;

    // Batch orders + stock_log
    const statuses = ["confirmed", "processing", "shipped", "delivered", "delivered"];
    const orderValParts = [], orderParams = [];
    const stockValParts = [], stockParams = [];
    for (let i = 0; i < 25; i++) {
      const userId = userRows[i % userRows.length].id;
      const items = [];
      let total = 0;
      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
        const prod = prodRows[Math.floor(Math.random() * prodRows.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        items.push({ id: prod.id, name: prod.name, price: prod.price, quantity: qty });
        total += prod.price * qty;
      }
      const shipping = total > 100 ? 0 : 9.99;
      const date = new Date(Date.now() - i * 86400000);
      const status = statuses[Math.min(i, statuses.length - 1)];
      const oid = `ord-${uuidv4().slice(0, 8)}`;
      const oi = orderParams.length;
      orderParams.push(oid, userId, JSON.stringify(items), Math.round(total * 100) / 100, shipping, Math.round(total * 0.08 * 100) / 100,
        JSON.stringify({ name: "Test User", city: "San Francisco", state: "CA" }), status,
        JSON.stringify([{ status, date: date.toISOString() }]), date.toISOString());
      orderValParts.push(`($${oi+1},$${oi+2},$${oi+3}::jsonb,$${oi+4},$${oi+5},$${oi+6},$${oi+7}::jsonb,$${oi+8},$${oi+9}::jsonb,$${oi+10})`);
      for (const item of items) {
        const si = stockParams.length;
        stockParams.push(uuidv4(), item.id, "out", item.quantity, `Order ${oid}`, date.toISOString());
        stockValParts.push(`($${si+1},$${si+2},$${si+3},$${si+4},$${si+5},$${si+6})`);
      }
    }
    await query(`INSERT INTO orders (id,"userId",items,total,shipping,tax,address,status,"statusHistory","createdAt") VALUES ${orderValParts.join(",")}`, orderParams);
    await query(`INSERT INTO stock_log (id,"productId",type,quantity,note,"createdAt") VALUES ${stockValParts.join(",")}`, stockParams);

    // Batch expenses
    const eTemplates = [
      { title: "Office Rent", category: "rent", amount: 4500, r: true },
      { title: "Cloud & Hosting", category: "software", amount: 1200, r: true },
      { title: "Marketing Ads", category: "marketing", amount: 3500, r: false },
      { title: "Supplier Payment", category: "supplier", amount: 12000, r: false },
      { title: "Salaries", category: "salary", amount: 18000, r: true },
      { title: "Shipping", category: "shipping", amount: 2000, r: false },
      { title: "Utilities", category: "utilities", amount: 900, r: true },
    ];
    const expValParts = [], expParams = [];
    for (let d = 0; d < 30; d++) {
      const date = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
      for (const e of eTemplates) {
        if (e.r || d % 5 === 0) {
          const ei = expParams.length;
          expParams.push(uuidv4(), e.title, e.category,
            Math.round(e.amount * (0.85 + Math.random() * 0.3) * 100) / 100, "", date, e.r, now);
          expValParts.push(`($${ei+1},$${ei+2},$${ei+3},$${ei+4},$${ei+5},$${ei+6},$${ei+7},$${ei+8})`);
        }
      }
    }
    if (expValParts.length) {
      await query(`INSERT INTO expenses (id,title,category,amount,description,date,recurring,"createdAt") VALUES ${expValParts.join(",")}`, expParams);
    }

    // Batch coupons
    const coupons = [
      { code: "WELCOME10", discount: 10, type: "percent", minOrder: 50, maxUses: 100, expiresAt: "2026-12-31" },
      { code: "SAVE50", discount: 50, type: "flat", minOrder: 200, maxUses: 50, expiresAt: "2026-09-30" },
      { code: "FREESHIP", discount: 0, type: "free_shipping", minOrder: 0, maxUses: 200, expiresAt: "2026-08-31" },
    ];
    const coupValParts = [], coupParams = [];
    for (const c of coupons) {
      const ex = await query("SELECT id FROM coupons WHERE code = $1", [c.code]);
      if (!ex.rows.length) {
        const ci = coupParams.length;
        coupParams.push(uuidv4(), c.code, c.discount, c.type, c.minOrder, c.maxUses, 0, true, c.expiresAt);
        coupValParts.push(`($${ci+1},$${ci+2},$${ci+3},$${ci+4},$${ci+5},$${ci+6},$${ci+7},$${ci+8},$${ci+9})`);
      }
    }
    if (coupValParts.length) {
      await query(`INSERT INTO coupons (id,code,discount,type,"minOrder","maxUses",used,active,"expiresAt") VALUES ${coupValParts.join(",")}`, coupParams);
    }

    // Batch suppliers
    const suppliers = [
      { name: "TechSupply Global", contact: "David Park", email: "david@techsupply.com" },
      { name: "AudioCraft Pro", contact: "Lisa Martinez", email: "lisa@audiocraft.com" },
      { name: "GameRig Systems", contact: "Tom Nguyen", email: "tom@gamerig.com" },
    ];
    const supValParts = [], supParams = [];
    for (const s of suppliers) {
      const ex = await query("SELECT id FROM suppliers WHERE name = $1", [s.name]);
      if (!ex.rows.length) {
        const si = supParams.length;
        supParams.push(uuidv4(), s.name, s.contact, s.email, now);
        supValParts.push(`($${si+1},$${si+2},$${si+3},$${si+4},$${si+5})`);
      }
    }
    if (supValParts.length) {
      await query(`INSERT INTO suppliers (id,name,contact,email,"createdAt") VALUES ${supValParts.join(",")}`, supParams);
    }

    console.log("Full seed complete");
  } catch (e) { console.error("Seed error:", e.message); }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Ensure DB tables + seed complete before handling first request
let dbReady = initDb();
app.use(async (req, res, next) => {
  if (dbReady) { await dbReady; dbReady = null; }
  next();
});

app.use(helmet({ crossOriginResourcePolicy: false, contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
app.use(limiter);

/* ─────── CATEGORIES ─────── */
app.get("/api/categories", async (req, res) => {
  try {
    const { rows } = await query('SELECT c.*, COALESCE(p."count",0) as "productCount" FROM categories c LEFT JOIN (SELECT category, COUNT(*) as "count" FROM products GROUP BY category) p ON c.slug = p.category ORDER BY c."order" ASC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── PRODUCTS ─────── */
app.get("/api/products", async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, minRating, maxRating, id, ids, page, limit, featured } = req.query;

    if (id) {
      const { rows } = await query("SELECT * FROM products WHERE id = $1", [id]);
      return res.json(rows[0] || null);
    }

    if (ids) {
      const list = ids.split(",");
      const { rows } = await query("SELECT * FROM products WHERE id = ANY($1)", [list]);
      return res.json(rows);
    }

    if (featured === "true") {
      const { rows } = await query("SELECT * FROM products WHERE badge IS NOT NULL AND badge != '' ORDER BY rating DESC LIMIT 8");
      return res.json(rows);
    }

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];
    let idx = 1;

    if (category && category !== "all") { sql += ` AND category = $${idx++}`; params.push(category); }
    if (search) { sql += ` AND (LOWER(name) LIKE $${idx} OR LOWER(description) LIKE $${idx} OR LOWER(category) LIKE $${idx})`; params.push(`%${search.toLowerCase()}%`); idx++; }
    if (minPrice) { sql += ` AND price >= $${idx++}`; params.push(Number(minPrice)); }
    if (maxPrice) { sql += ` AND price <= $${idx++}`; params.push(Number(maxPrice)); }
    if (minRating) { sql += ` AND rating >= $${idx++}`; params.push(Number(minRating)); }
    if (maxRating) { sql += ` AND rating <= $${idx++}`; params.push(Number(maxRating)); }

    if (sort === "price-asc") sql += " ORDER BY price ASC";
    else if (sort === "price-desc") sql += " ORDER BY price DESC";
    else if (sort === "rating") sql += " ORDER BY rating DESC";
    else if (sort === "popular") sql += " ORDER BY reviews DESC";
    else sql += " ORDER BY name ASC";

    const p = Number(page) || 1;
    const l = Number(limit) || 20;
    const offset = (p - 1) * l;

    const { rows: items } = await query(sql, params);
    const total = items.length;
    const paginated = items.slice(offset, offset + l);

    res.json({ items: paginated, total, page: p, totalPages: Math.ceil(total / l) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── AUTH ─────── */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

    const { rows: existing } = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.length) return res.status(409).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
    const now = new Date().toISOString();

    await query(
      `INSERT INTO users (id, name, email, password, role, avatar, addresses, wishlist, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,'[]'::jsonb,'[]'::jsonb,$7)`,
      [id, name, email, hashed, "user", avatar, now]
    );

    const user = { id, name, email, role: "user", avatar, addresses: [], wishlist: [], createdAt: now };
    res.status(201).json({ user, token: generateToken(user) });
  } catch (e) { res.status(500).json({ error: "Registration failed" }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: "Invalid credentials" });
    const { password: _, ...safe } = user;
    res.json({ user: safe, token: generateToken(user) });
  } catch (e) { res.status(500).json({ error: "Login failed" }); }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT id, name, email, role, avatar, addresses, wishlist, \"createdAt\" FROM users WHERE id = $1", [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/auth/profile", authMiddleware, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = [];
    const params = [];
    let idx = 1;
    if (name !== undefined) { updates.push(`name = $${idx++}`); params.push(name); }
    if (avatar !== undefined) { updates.push(`avatar = $${idx++}`); params.push(avatar); }
    if (!updates.length) return res.status(400).json({ error: "Nothing to update" });
    params.push(req.user.id);
    const { rows } = await query(`UPDATE users SET ${updates.join(", ")} WHERE id = $${idx} RETURNING id, name, email, role, avatar, addresses, wishlist, "createdAt"`, params);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/auth/addresses", authMiddleware, async (req, res) => {
  try {
    const addr = { id: uuidv4(), ...req.body };
    const { rows } = await query(
      `UPDATE users SET addresses = addresses || $1::jsonb WHERE id = $2 RETURNING addresses`,
      [JSON.stringify(addr), req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    const addresses = rows[0].addresses || [];
    res.status(201).json(addresses.find((a) => a.id === addr.id) || addr);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/auth/addresses/:addrId", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      `UPDATE users SET addresses = (SELECT jsonb_agg(a) FROM jsonb_array_elements(addresses) a WHERE a->>'id' != $1) WHERE id = $2 RETURNING addresses`,
      [req.params.addrId, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ORDERS ─────── */
app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders WHERE "userId" = $1 ORDER BY "createdAt" DESC', [req.user.id]);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    res.json(rows[0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { items, total, shipping, tax, coupon, shippingMethod, giftWrap, notes, address } = req.body;
    if (!items?.length) return res.status(400).json({ error: "Cart is empty" });

    const id = uuidv4();
    const now = new Date().toISOString();
    const estimatedDelivery = new Date(Date.now() + 7 * 86400000).toISOString();
    const statusHistory = JSON.stringify([{ status: "confirmed", date: now }]);

    await query(
      `INSERT INTO orders (id, "userId", items, total, shipping, tax, coupon, "shippingMethod", "giftWrap", notes, address, status, "statusHistory", "estimatedDelivery", "createdAt")
       VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7::jsonb,$8,$9,$10,$11::jsonb,$12,$13::jsonb,$14,$15)`,
      [id, req.user.id, JSON.stringify(items), total, shipping, tax,
       JSON.stringify(coupon), shippingMethod, giftWrap, notes, JSON.stringify(address),
       "confirmed", statusHistory, estimatedDelivery, now]
    );

    for (const item of items) {
      await query("UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2", [item.quantity, item.id]);
      await query(
        `INSERT INTO stock_log (id, "productId", type, quantity, note, "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [uuidv4(), item.id, "out", item.quantity, `Order ${id}`, now]
      );
    }

    const { rows } = await query("SELECT * FROM orders WHERE id = $1", [id]);
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/orders/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders WHERE id = $1 AND "userId" = $2', [req.params.id, req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "Order not found" });
    if (rows[0].status !== "confirmed" && rows[0].status !== "processing") return res.status(400).json({ error: "Order cannot be cancelled" });

    const statusHistory = [...(rows[0].statusHistory || []), { status: "cancelled", date: new Date().toISOString() }];

    for (const item of rows[0].items || []) {
      await query("UPDATE products SET stock = stock + $1 WHERE id = $2", [item.quantity, item.id]);
      await query(
        `INSERT INTO stock_log (id, "productId", type, quantity, note, "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [uuidv4(), item.id, "return", item.quantity, `Cancelled order ${rows[0].id}`, new Date().toISOString()]
      );
    }

    const { rows: updated } = await query(
      'UPDATE orders SET status = $1, "statusHistory" = $2::jsonb WHERE id = $3 RETURNING *',
      ["cancelled", JSON.stringify(statusHistory), req.params.id]
    );
    res.json(updated[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ALL ORDERS (ADMIN) ─────── */
app.get("/api/admin/orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const p = Number(req.query.page) || 1;
    const l = Number(req.query.limit) || 20;
    const offset = (p - 1) * l;
    const { rows: items } = await query('SELECT * FROM orders ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2', [l, offset]);
    const { rows: count } = await query("SELECT COUNT(*) FROM orders");
    const total = parseInt(count[0].count);
    res.json({ items, total, page: p, totalPages: Math.ceil(total / l) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/orders/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status required" });

    const { rows: existing } = await query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: "Order not found" });

    const statusHistory = [...(existing[0].statusHistory || []), { status, date: new Date().toISOString() }];
    const trackingNumber = status === "shipped" ? (req.body.trackingNumber || `RT${Date.now()}`) : existing[0].trackingNumber;

    const { rows } = await query(
      'UPDATE orders SET status = $1, "statusHistory" = $2::jsonb, "trackingNumber" = $3 WHERE id = $4 RETURNING *',
      [status, JSON.stringify(statusHistory), trackingNumber, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── REVIEWS ─────── */
app.get("/api/reviews", async (req, res) => {
  try {
    const { rows } = req.query.productId
      ? await query('SELECT * FROM reviews WHERE "productId" = $1 ORDER BY "createdAt" DESC', [req.query.productId])
      : await query('SELECT * FROM reviews ORDER BY "createdAt" DESC');
    const reviews = rows;

    let stats = {};
    if (req.query.productId) {
      const { rows: agg } = await query(
        'SELECT AVG(rating)::float as average, COUNT(*) as total FROM reviews WHERE "productId" = $1',
        [req.query.productId]
      );
      const { rows: dist } = await query(
        'SELECT rating as star, COUNT(*) as count FROM reviews WHERE "productId" = $1 GROUP BY rating ORDER BY rating DESC',
        [req.query.productId]
      );
      stats.average = agg[0].average ? agg[0].average.toFixed(1) : "0";
      stats.total = parseInt(agg[0].total);
      const distMap = {};
      for (const d of dist) distMap[d.star] = parseInt(d.count);
      stats.distribution = [5, 4, 3, 2, 1].map((s) => ({ star: s, count: distMap[s] || 0 }));
    }
    res.json({ reviews, stats });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/reviews", authMiddleware, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    if (!productId || !rating || !comment) return res.status(400).json({ error: "Missing required fields" });

    const { rows: users } = await query("SELECT name FROM users WHERE id = $1", [req.user.id]);
    const userName = users[0]?.name || "Anonymous";
    const id = uuidv4();
    const now = new Date().toISOString();

    await query(
      `INSERT INTO reviews (id, "productId", "userId", "userName", rating, title, comment, verified, "createdAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, productId, req.user.id, userName, Math.min(5, Math.max(1, rating)), title || "", comment, true, now]
    );

    const { rows } = await query("SELECT * FROM reviews WHERE id = $1", [id]);
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── WISHLIST ─────── */
app.get("/api/wishlist", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT wishlist FROM users WHERE id = $1", [req.user.id]);
    res.json(rows[0]?.wishlist || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/wishlist/:productId", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "UPDATE users SET wishlist = CASE WHEN NOT (wishlist @> $1::jsonb) THEN wishlist || $1::jsonb ELSE wishlist END WHERE id = $2 RETURNING wishlist",
      [JSON.stringify([req.params.productId]), req.user.id]
    );
    res.json(rows[0]?.wishlist || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/wishlist/:productId", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "UPDATE users SET wishlist = (SELECT jsonb_agg(v) FROM jsonb_array_elements_text(wishlist) v WHERE v != $1) WHERE id = $2 RETURNING wishlist",
      [req.params.productId, req.user.id]
    );
    res.json(rows[0]?.wishlist || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── COUPONS ─────── */
app.post("/api/coupons/validate", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const { rows } = await query("SELECT * FROM coupons WHERE UPPER(code) = UPPER($1) AND active = true", [code]);
    const coupon = rows[0];
    if (!coupon) return res.status(404).json({ error: "Invalid coupon code" });
    if (new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ error: "Coupon has expired" });
    if (coupon.used >= coupon.maxUses) return res.status(400).json({ error: "Coupon usage limit reached" });
    if (orderTotal < coupon.minOrder) return res.status(400).json({ error: `Minimum order amount is $${coupon.minOrder}` });
    let discount = 0;
    if (coupon.type === "percent") discount = orderTotal * (coupon.discount / 100);
    else if (coupon.type === "flat") discount = coupon.discount;
    else if (coupon.type === "free_shipping") discount = 0;
    res.json({ valid: true, coupon: { ...coupon, discount: Math.min(discount, orderTotal) } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/coupons", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM coupons ORDER BY code");
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/coupons", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const coupon = { id: uuidv4(), ...req.body, used: 0 };
    await query(
      `INSERT INTO coupons (id, code, discount, type, "minOrder", "maxUses", used, active, "expiresAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [coupon.id, coupon.code, coupon.discount, coupon.type, coupon.minOrder || 0, coupon.maxUses || 100, 0, coupon.active !== false, coupon.expiresAt]
    );
    res.status(201).json(coupon);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── CONTACT ─────── */
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: "All fields required" });
    await query(
      `INSERT INTO contacts (id, name, email, subject, message, read, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [uuidv4(), name, email, subject || null, message, false, new Date().toISOString()]
    );
    res.status(201).json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── CHAT ─────── */
app.post("/api/chat/conversations", async (req, res) => {
  try {
    const { name, email, subject } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email required" });
    const existing = await query(`SELECT * FROM chat_conversations WHERE email=$1 AND status='open' ORDER BY "createdAt" DESC LIMIT 1`, [email]);
    if (existing.rows.length) return res.json(existing.rows[0]);
    const id = uuidv4();
    await query(`INSERT INTO chat_conversations (id, name, email, subject, status, "createdAt") VALUES ($1,$2,$3,$4,'open',$5)`, [id, name, email, subject || null, new Date().toISOString()]);
    res.status(201).json({ id, name, email, subject, status: "open" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/chat/messages", async (req, res) => {
  try {
    const { conversationId, message, name } = req.body;
    if (!conversationId || !message || !name) return res.status(400).json({ error: "conversationId, name, and message required" });
    const id = uuidv4();
    await query(`INSERT INTO chat_messages (id, "conversationId", sender, name, message, "createdAt") VALUES ($1,$2,'user',$3,$4,$5)`, [id, conversationId, name, message, new Date().toISOString()]);
    await query(`UPDATE chat_conversations SET "lastMessage"=$1, "lastMessageAt"=$2, unread=unread+1 WHERE id=$3`, [message, new Date().toISOString(), conversationId]);
    res.status(201).json({ id, message, sender: "user" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/chat/messages/:conversationId", async (req, res) => {
  try {
    const r = await query(`SELECT c.*, COALESCE(json_agg(json_build_object('id',m.id,'sender',m.sender,'name',m.name,'message',m.message,'createdAt',m."createdAt")) FILTER (WHERE m.id IS NOT NULL), '[]'::json) AS messages FROM chat_conversations c LEFT JOIN chat_messages m ON m."conversationId"=c.id WHERE c.id=$1 GROUP BY c.id`, [req.params.conversationId]);
    if (!r.rows.length) return res.status(404).json({ error: "Not found" });
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/chat/conversations", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const r = await query(`SELECT * FROM chat_conversations ORDER BY "lastMessageAt" DESC NULLS LAST, "createdAt" DESC`);
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/chat/messages/:conversationId", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [conv, msgs] = await Promise.all([
      query(`SELECT * FROM chat_conversations WHERE id=$1`, [req.params.conversationId]),
      query(`SELECT * FROM chat_messages WHERE "conversationId"=$1 ORDER BY "createdAt" ASC`, [req.params.conversationId])
    ]);
    if (!conv.rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ ...conv.rows[0], messages: msgs.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/chat/reply", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    if (!conversationId || !message) return res.status(400).json({ error: "conversationId and message required" });
    const id = uuidv4();
    await query(`INSERT INTO chat_messages (id, "conversationId", sender, name, message, "createdAt") VALUES ($1,$2,'admin','Support',$3,$4)`, [id, conversationId, message, new Date().toISOString()]);
    await query(`UPDATE chat_conversations SET "lastMessage"=$1, "lastMessageAt"=$2 WHERE id=$3`, [message, new Date().toISOString(), conversationId]);
    res.status(201).json({ id, message, sender: "admin" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: PRODUCTS ─────── */
app.get("/api/admin/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const p = Number(req.query.page) || 1;
    const l = Number(req.query.limit) || 20;
    const offset = (p - 1) * l;
    const { rows: items } = await query("SELECT * FROM products ORDER BY name ASC LIMIT $1 OFFSET $2", [l, offset]);
    const { rows: count } = await query("SELECT COUNT(*) FROM products");
    const total = parseInt(count[0].count);
    res.json({ items, total, page: p, totalPages: Math.ceil(total / l) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/products", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = { id: uuidv4(), ...req.body, reviews: 0, rating: 0, createdAt: new Date().toISOString() };
    await query(
      `INSERT INTO products (id, name, category, price, "originalPrice", rating, reviews, description, features, images, stock, badge, specs, "createdAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11,$12,$13::jsonb,$14)`,
      [product.id, product.name, product.category, product.price, product.originalPrice || null,
       product.rating, product.reviews, product.description || null,
       JSON.stringify(product.features || []), JSON.stringify(product.images || []),
       product.stock || 0, product.badge || null, JSON.stringify(product.specs || {}), product.createdAt]
    );
    res.status(201).json(product);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows: existing } = await query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: "Product not found" });

    const updated = { ...existing[0], ...req.body, id: req.params.id };
    await query(
      `UPDATE products SET name=$1, category=$2, price=$3, "originalPrice"=$4, rating=$5, reviews=$6,
       description=$7, features=$8::jsonb, images=$9::jsonb, stock=$10, badge=$11, specs=$12::jsonb
       WHERE id=$13`,
      [updated.name, updated.category, updated.price, updated.originalPrice || null, updated.rating,
       updated.reviews, updated.description || null, JSON.stringify(updated.features || []),
       JSON.stringify(updated.images || []), updated.stock || 0, updated.badge || null,
       JSON.stringify(updated.specs || {}), req.params.id]
    );
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/products/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/products/bulk-delete", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids?.length) return res.status(400).json({ error: "No IDs provided" });
    await query("DELETE FROM products WHERE id = ANY($1)", [ids]);
    res.json({ success: true, deleted: ids.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: CATEGORIES ─────── */
app.post("/api/admin/categories", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const cat = { id: uuidv4(), ...req.body };
    await query(
      'INSERT INTO categories (id, name, slug, description, icon, image, featured, "order") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [cat.id, cat.name, cat.slug, cat.description || null, cat.icon || null, cat.image || null, cat.featured || false, cat.order || 0]
    );
    res.status(201).json(cat);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/categories/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE categories SET name=$1, slug=$2, description=$3, icon=$4, image=$5, featured=$6, "order"=$7 WHERE id=$8 RETURNING *',
      [req.body.name, req.body.slug, req.body.description || null, req.body.icon || null, req.body.image || null, req.body.featured || false, req.body.order || 0, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/categories/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM categories WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── PROMOTIONS ─────── */
app.get("/api/promotions", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM promotions WHERE active = true");
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── DASHBOARD STATS (Admin) ─────── */
async function safeQuery(q, params = [], fallback = 0) {
  try { const { rows } = await query(q, params); return rows; } catch { return [{ count: fallback, total: fallback, revenue: fallback, avg: fallback }]; }
}

app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [orders, weeklyRevenue, products, users, pending, shipped, delivered, cancelled,
           categories, reviews, subscribers, contacts, avgOrder, expenses, lowStock, outOfStock, todayOrders] = await Promise.all([
      safeQuery("SELECT COALESCE(SUM(total),0) as \"totalRevenue\", COUNT(*) as \"totalOrders\" FROM orders"),
      safeQuery("SELECT COALESCE(SUM(total),0) as revenue FROM orders WHERE \"createdAt\" >= NOW() - INTERVAL '7 days'"),
      safeQuery("SELECT COUNT(*) FROM products"),
      safeQuery("SELECT COUNT(*) FROM users"),
      safeQuery("SELECT COUNT(*) FROM orders WHERE status IN ('confirmed','processing')"),
      safeQuery("SELECT COUNT(*) FROM orders WHERE status = 'shipped'"),
      safeQuery("SELECT COUNT(*) FROM orders WHERE status = 'delivered'"),
      safeQuery("SELECT COUNT(*) FROM orders WHERE status = 'cancelled'"),
      safeQuery("SELECT COUNT(*) FROM categories"),
      safeQuery("SELECT COUNT(*) FROM reviews"),
      safeQuery("SELECT COUNT(*) FROM subscribers"),
      safeQuery("SELECT COUNT(*) FROM contacts WHERE read = false"),
      safeQuery("SELECT COALESCE(AVG(total),0) as avg FROM orders"),
      safeQuery("SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE date >= '2024-01-01'"),
      safeQuery("SELECT COUNT(*) FROM products WHERE stock > 0 AND stock <= 5"),
      safeQuery("SELECT COUNT(*) FROM products WHERE stock = 0"),
      safeQuery("SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders WHERE \"createdAt\"::date = CURRENT_DATE"),
    ]);

    res.json({
      totalOrders: parseInt(orders[0]?.totalOrders || 0),
      totalRevenue: parseFloat(orders[0]?.totalRevenue || 0),
      weeklyRevenue: parseFloat(weeklyRevenue[0]?.revenue || 0),
      totalProducts: parseInt(products[0]?.count || 0),
      totalUsers: parseInt(users[0]?.count || 0),
      pendingOrders: parseInt(pending[0]?.count || 0),
      shippedOrders: parseInt(shipped[0]?.count || 0),
      deliveredOrders: parseInt(delivered[0]?.count || 0),
      cancelledOrders: parseInt(cancelled[0]?.count || 0),
      totalCategories: parseInt(categories[0]?.count || 0),
      totalReviews: parseInt(reviews[0]?.count || 0),
      totalSubscribers: parseInt(subscribers[0]?.count || 0),
      unreadContacts: parseInt(contacts[0]?.count || 0),
      averageOrderValue: parseFloat(avgOrder[0]?.avg || 0),
      totalExpenses: parseFloat(expenses[0]?.total || 0),
      lowStockProducts: parseInt(lowStock[0]?.count || 0),
      outOfStockProducts: parseInt(outOfStock[0]?.count || 0),
      todayOrders: parseInt(todayOrders[0]?.count || 0),
      todayRevenue: parseFloat(todayOrders[0]?.revenue || 0),
      netProfit: parseFloat(orders[0]?.totalRevenue || 0) - parseFloat(expenses[0]?.total || 0),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── NEWSLETTER ─────── */
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const { rows } = await query("SELECT id FROM subscribers WHERE email = $1", [email]);
    if (!rows.length) {
      await query('INSERT INTO subscribers (id, email, "createdAt") VALUES ($1,$2,$3)', [uuidv4(), email, new Date().toISOString()]);
    }
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: USERS ─────── */
app.get("/api/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const p = Number(req.query.page) || 1;
    const offset = (p - 1) * 50;
    const { rows: items } = await query('SELECT id, name, email, role, avatar, addresses, wishlist, banned, "createdAt" FROM users ORDER BY "createdAt" DESC LIMIT 50 OFFSET $1', [offset]);
    const { rows: count } = await query("SELECT COUNT(*) FROM users");
    const total = parseInt(count[0].count);
    res.json({ items, total, page: p, totalPages: Math.ceil(total / 50) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role, name, banned } = req.body;
    const sets = [];
    const params = [];
    let idx = 1;
    if (role) { sets.push(`role = $${idx++}`); params.push(role); }
    if (name) { sets.push(`name = $${idx++}`); params.push(name); }
    if (banned !== undefined) { sets.push(`banned = $${idx++}`); params.push(banned); }
    if (!sets.length) return res.status(400).json({ error: "Nothing to update" });
    params.push(req.params.id);
    const { rows } = await query(`UPDATE users SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id, name, email, role, avatar, addresses, wishlist, banned, "createdAt"`, params);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: CONTACTS ─────── */
app.get("/api/admin/contacts", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM contacts ORDER BY "createdAt" DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/contacts/:id/read", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query("UPDATE contacts SET read = true WHERE id = $1 RETURNING *", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/contacts/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM contacts WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: SUBSCRIBERS ─────── */
app.get("/api/admin/subscribers", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM subscribers ORDER BY "createdAt" DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: REVIEWS ─────── */
app.get("/api/admin/reviews", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const p = Number(req.query.page) || 1;
    const offset = (p - 1) * 50;
    const { rows: items } = await query('SELECT * FROM reviews ORDER BY "createdAt" DESC LIMIT 50 OFFSET $1', [offset]);
    const { rows: count } = await query("SELECT COUNT(*) FROM reviews");
    const total = parseInt(count[0].count);
    res.json({ items, total, page: p, totalPages: Math.ceil(total / 50) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/reviews/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM reviews WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: COUPONS ─────── */
app.put("/api/admin/coupons/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows: existing } = await query("SELECT * FROM coupons WHERE id = $1", [req.params.id]);
    if (!existing.length) return res.status(404).json({ error: "Coupon not found" });
    const updated = { ...existing[0], ...req.body, id: req.params.id };
    await query(
      `UPDATE coupons SET code=$1, discount=$2, type=$3, "minOrder"=$4, "maxUses"=$5, used=$6, active=$7, "expiresAt"=$8 WHERE id=$9`,
      [updated.code, updated.discount, updated.type, updated.minOrder, updated.maxUses, updated.used, updated.active, updated.expiresAt, req.params.id]
    );
    res.json(updated);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/coupons/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM coupons WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: SALES HISTORY ─────── */
app.get("/api/admin/sales-history", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const { rows: orders } = await query("SELECT * FROM orders");
    let allExpenses = [];
    try { const { rows } = await query("SELECT * FROM expenses"); allExpenses = rows; } catch {};

    const history = Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - i * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      const dayOrders = orders.filter((o) => { try { return o.createdAt?.toISOString().startsWith(dayStr); } catch { return false; } });
      const dayExpenses = allExpenses.filter((e) => { try { return e.date?.toISOString().startsWith(dayStr); } catch { return false; } });
      const revenue = dayOrders.reduce((s, o) => s + (o.total || 0), 0);
      const cost = dayExpenses.reduce((s, e) => s + (e.amount || 0), 0);
      return { date: dayStr, revenue, expenses: cost, profit: revenue - cost, orders: dayOrders.length };
    }).reverse();

    res.json(history);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: STOCK ─────── */
app.get("/api/admin/stock/low", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const { rows } = await query("SELECT * FROM products WHERE stock <= $1 ORDER BY stock ASC", [threshold]);
    res.json(rows);
  } catch { res.json([]); }
});

app.get("/api/admin/stock/log", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM stock_log ORDER BY "createdAt" DESC LIMIT 200');
    res.json(rows);
  } catch { res.json([]); }
});

app.post("/api/admin/stock/adjust", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { productId, quantity, type, note } = req.body;
    if (!productId || quantity === undefined) return res.status(400).json({ error: "productId and quantity required" });

    const { rows: existing } = await query("SELECT * FROM products WHERE id = $1", [productId]);
    if (!existing.length) return res.status(404).json({ error: "Product not found" });

    if (type === "set") {
      await query("UPDATE products SET stock = $1 WHERE id = $2", [Math.max(0, quantity), productId]);
    } else if (type === "add") {
      await query("UPDATE products SET stock = stock + $1 WHERE id = $2", [quantity, productId]);
    } else if (type === "remove") {
      await query("UPDATE products SET stock = GREATEST(0, stock - $1) WHERE id = $2", [quantity, productId]);
    }

    const logId = uuidv4();
    await query(
      `INSERT INTO stock_log (id, "productId", type, quantity, note, "createdAt") VALUES ($1,$2,$3,$4,$5,$6)`,
      [logId, productId, type, quantity, note || `${type} adjustment`, new Date().toISOString()]
    );

    const { rows: updated } = await query("SELECT * FROM products WHERE id = $1", [productId]);
    res.json({ product: updated[0], log: { id: logId, productId, type, quantity, note } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: EXPENSES ─────── */
app.get("/api/admin/expenses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM expenses ORDER BY date DESC, "createdAt" DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/expenses", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const exp = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
    await query(
      'INSERT INTO expenses (id, title, category, amount, description, date, recurring, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [exp.id, exp.title, exp.category || "other", exp.amount, exp.description || null, exp.date, exp.recurring || false, exp.createdAt]
    );
    res.status(201).json(exp);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/expenses/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE expenses SET title=$1, category=$2, amount=$3, description=$4, date=$5, recurring=$6 WHERE id=$7 RETURNING *',
      [req.body.title, req.body.category || "other", req.body.amount, req.body.description || null, req.body.date, req.body.recurring || false, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/expenses/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM expenses WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: SUPPLIERS ─────── */
app.get("/api/admin/suppliers", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM suppliers ORDER BY name');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/suppliers", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sup = { id: uuidv4(), ...req.body, createdAt: new Date().toISOString() };
    await query(
      'INSERT INTO suppliers (id, name, contact, email, phone, address, notes, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [sup.id, sup.name, sup.contact || null, sup.email || null, sup.phone || null, sup.address || null, sup.notes || null, sup.createdAt]
    );
    res.status(201).json(sup);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/suppliers/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE suppliers SET name=$1, contact=$2, email=$3, phone=$4, address=$5, notes=$6 WHERE id=$7 RETURNING *',
      [req.body.name, req.body.contact || null, req.body.email || null, req.body.phone || null, req.body.address || null, req.body.notes || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/admin/suppliers/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await query("DELETE FROM suppliers WHERE id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: SETTINGS ─────── */
app.get("/api/admin/settings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM settings ORDER BY key");
    const obj = {};
    for (const row of rows) obj[row.key] = { value: row.value, type: row.type };
    res.json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/settings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const entries = Object.entries(req.body);
    for (const [key, val] of entries) {
      await query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', [key, String(val)]);
    }
    const { rows } = await query("SELECT * FROM settings ORDER BY key");
    const obj = {};
    for (const row of rows) obj[row.key] = { value: row.value, type: row.type };
    res.json(obj);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: PAGES ─────── */
app.get("/api/pages/:slug", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM pages WHERE slug = $1 AND published = true", [req.params.slug]);
    res.json(rows[0] || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/pages", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM pages ORDER BY slug");
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/pages/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      'UPDATE pages SET title=$1, slug=$2, content=$3, published=$4 WHERE id=$5 RETURNING *',
      [req.body.title, req.body.slug, req.body.content || "", req.body.published !== false, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── ADMIN: NOTIFICATIONS ─────── */
app.get("/api/admin/notifications", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const unreadFirst = req.query.unread === "true";
    const { rows } = await query(
      unreadFirst
        ? 'SELECT * FROM notifications ORDER BY read ASC, "createdAt" DESC LIMIT 50'
        : 'SELECT * FROM notifications ORDER BY "createdAt" DESC LIMIT 50'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/admin/notifications", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const notif = { id: uuidv4(), ...req.body, read: false, createdAt: new Date().toISOString() };
    await query(
      'INSERT INTO notifications (id, type, title, message, read, "createdAt") VALUES ($1,$2,$3,$4,$5,$6)',
      [notif.id, notif.type || "info", notif.title, notif.message || null, false, notif.createdAt]
    );
    res.status(201).json(notif);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/admin/notifications/:id/read", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query("UPDATE notifications SET read = true WHERE id = $1 RETURNING *", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── SEED ADMIN USER ─────── */
app.post("/api/admin/seed", async (req, res) => {
  try {
    const { rows: existing } = await query("SELECT id FROM users WHERE role = 'admin'");
    if (existing.length) return res.json({ message: "Admin already exists" });
    const hashed = await bcrypt.hash("admin123", 10);
    const now = new Date().toISOString();
    await query(
      `INSERT INTO users (id, name, email, password, role, avatar, addresses, wishlist, "createdAt")
       VALUES ($1,$2,$3,$4,$5,$6,'[]'::jsonb,'[]'::jsonb,$7)`,
      ["admin-root", "Admin RT", "admin@rtelectronics.com", hashed, "admin",
       "https://api.dicebear.com/7.x/avataaars/svg?seed=admin", now]
    );
    res.json({ message: "Admin created. Email: admin@rtelectronics.com / Password: admin123" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

/* ─────── HEALTH CHECK ─────── */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

/* ─────── SERVE STATIC FILES (PRODUCTION) ─────── */
const DIST_DIR = join(__dirname, "..", "dist");
if (existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) return res.status(404).json({ error: "API route not found" });
    res.sendFile(join(DIST_DIR, "index.html"));
  });
}

export default app;
