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
import { migrate } from "./migrate.js";
import { seed } from "./seed.js";

// Run migrations and seed on startup (blocking to avoid race with first request)
await migrate();
await seed();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

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
    if (name) { updates.push(`name = $${idx++}`); params.push(name); }
    if (avatar) { updates.push(`avatar = $${idx++}`); params.push(avatar); }
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
app.get("/api/admin/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows: orders } = await query("SELECT COALESCE(SUM(total),0) as \"totalRevenue\", COUNT(*) as \"totalOrders\" FROM orders");
    const { rows: weeklyRevenue } = await query("SELECT COALESCE(SUM(total),0) as revenue FROM orders WHERE \"createdAt\" >= NOW() - INTERVAL '7 days'");
    const { rows: products } = await query("SELECT COUNT(*) FROM products");
    const { rows: users } = await query("SELECT COUNT(*) FROM users");
    const { rows: pending } = await query("SELECT COUNT(*) FROM orders WHERE status IN ('confirmed','processing')");
    const { rows: shipped } = await query("SELECT COUNT(*) FROM orders WHERE status = 'shipped'");
    const { rows: delivered } = await query("SELECT COUNT(*) FROM orders WHERE status = 'delivered'");
    const { rows: cancelled } = await query("SELECT COUNT(*) FROM orders WHERE status = 'cancelled'");
    const { rows: categories } = await query("SELECT COUNT(*) FROM categories");
    const { rows: reviews } = await query("SELECT COUNT(*) FROM reviews");
    const { rows: subscribers } = await query("SELECT COUNT(*) FROM subscribers");
    const { rows: contacts } = await query("SELECT COUNT(*) FROM contacts WHERE read = false");
    const { rows: avgOrder } = await query("SELECT COALESCE(AVG(total),0) as avg FROM orders");
    const { rows: expenses } = await query("SELECT COALESCE(SUM(amount),0) as total FROM expenses WHERE date >= '2024-01-01'");
    const { rows: lowStock } = await query("SELECT COUNT(*) FROM products WHERE stock > 0 AND stock <= 5");
    const { rows: outOfStock } = await query("SELECT COUNT(*) FROM products WHERE stock = 0");
    const { rows: todayOrders } = await query("SELECT COUNT(*) as count, COALESCE(SUM(total),0) as revenue FROM orders WHERE \"createdAt\"::date = CURRENT_DATE");

    res.json({
      totalOrders: parseInt(orders[0].totalOrders),
      totalRevenue: parseFloat(orders[0].totalRevenue),
      weeklyRevenue: parseFloat(weeklyRevenue[0].revenue),
      totalProducts: parseInt(products[0].count),
      totalUsers: parseInt(users[0].count),
      pendingOrders: parseInt(pending[0].count),
      shippedOrders: parseInt(shipped[0].count),
      deliveredOrders: parseInt(delivered[0].count),
      cancelledOrders: parseInt(cancelled[0].count),
      totalCategories: parseInt(categories[0].count),
      totalReviews: parseInt(reviews[0].count),
      totalSubscribers: parseInt(subscribers[0].count),
      unreadContacts: parseInt(contacts[0].count),
      averageOrderValue: parseFloat(avgOrder[0].avg),
      totalExpenses: parseFloat(expenses[0].total),
      lowStockProducts: parseInt(lowStock[0].count),
      outOfStockProducts: parseInt(outOfStock[0].count),
      todayOrders: parseInt(todayOrders[0].count),
      todayRevenue: parseFloat(todayOrders[0].revenue),
      netProfit: parseFloat(orders[0].totalRevenue) - parseFloat(expenses[0].total),
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
    const { rows: allExpenses } = await query("SELECT * FROM expenses");

    const history = Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - i * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      const dayOrders = orders.filter((o) => o.createdAt?.startsWith(dayStr));
      const dayExpenses = allExpenses.filter((e) => e.date?.startsWith(dayStr));
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
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/stock/log", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM stock_log ORDER BY "createdAt" DESC LIMIT 200');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
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
