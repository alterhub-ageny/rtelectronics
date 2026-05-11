import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { query } from "./db.js";

export async function seed() {
  try {
    const now = new Date().toISOString();

    /* ─── Categories ─── */
    const categories = [
      { name: "Laptops", slug: "laptops", icon: "Monitor", description: "High-performance laptops for work, gaming, and creation", featured: true, order: 1 },
      { name: "Smartphones", slug: "phones", icon: "Smartphone", description: "Latest smartphones with cutting-edge technology", featured: true, order: 2 },
      { name: "Gaming PCs", slug: "gaming-pcs", icon: "Gamepad2", description: "Ultimate gaming rigs for every budget", featured: true, order: 3 },
      { name: "Tablets", slug: "tablets", icon: "Tablet", description: "Versatile tablets for productivity and entertainment", featured: true, order: 4 },
      { name: "Headphones & Audio", slug: "headphones", icon: "Headphones", description: "Premium audio gear from top brands", featured: true, order: 5 },
      { name: "Accessories", slug: "accessories", icon: "Mouse", description: "Essential accessories to complete your setup", featured: true, order: 6 },
      { name: "Game Top-Ups", slug: "game-topup", icon: "Gem", description: "Digital game credits and in-game currency", featured: false, order: 7 },
      { name: "Gift Cards", slug: "gift-cards", icon: "Gift", description: "Digital gift cards for all occasions", featured: false, order: 8 },
    ];

    for (const c of categories) {
      const exists = await query("SELECT id FROM categories WHERE slug = $1", [c.slug]);
      if (exists.rows.length > 0) continue;
      const id = uuidv4();
      await query(
        'INSERT INTO categories (id, name, slug, description, icon, featured, "order") VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [id, c.name, c.slug, c.description, c.icon, c.featured, c.order]
      );
    }
    console.log(" Categories seeded");

    /* ─── Products ─── */
    const products = [
      { name: "Alienware m18 R2 Gaming Laptop", category: "laptops", price: 2499.99, originalPrice: 2899.99, stock: 15, badge: "Featured", rating: 4.8, reviews: 124, description: "18-inch QHD+ 165Hz display, Intel Core i9-14900HX, NVIDIA RTX 4080, 32GB DDR5, 1TB SSD. The ultimate gaming laptop with mechanical keyboard and advanced cooling.", features: ["18-inch QHD+ 165Hz G-Sync display", "Intel Core i9-14900HX (24 cores)", "NVIDIA GeForce RTX 4080 12GB", "32GB DDR5-5600 RAM", "1TB NVMe SSD + extra slot", "CherryMX mechanical keyboard", "Alienware Cryo-tech cooling"], images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"] },
      { name: "MacBook Pro 16 M3 Max", category: "laptops", price: 3499.99, stock: 8, badge: "Best Seller", rating: 4.9, reviews: 231, description: "Apple M3 Max chip with 16-core CPU and 40-core GPU, 48GB unified memory, 1TB SSD, 16.2-inch Liquid Retina XDR display. Up to 22 hours of battery life.", features: ["Apple M3 Max (16-core CPU, 40-core GPU)", "48GB unified memory", "1TB SSD storage", "16.2-inch Liquid Retina XDR display", "22-hour battery life", "Thunderbolt 4 ports", "1080p FaceTime HD camera"], images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400"] },
      { name: "ThinkPad X1 Carbon Gen 12", category: "laptops", price: 1899.99, originalPrice: 2199.99, stock: 22, rating: 4.6, reviews: 89, description: "14-inch 2.8K OLED, Intel Core Ultra 7 155H, 16GB RAM, 512GB SSD. Ultralight at 2.42 lbs with MIL-STD-810H durability.", features: ["14-inch 2.8K OLED display", "Intel Core Ultra 7 155H", "16GB LPDDR5x RAM", "512GB PCIe Gen 4 SSD", "2.42 lbs ultra-light", "MIL-STD-810H certified", "Full HDMI 2.1 & Thunderbolt 4"], images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400"] },
      { name: "ROG Zephyrus G14", category: "laptops", price: 1599.99, stock: 12, badge: "Sale", rating: 4.7, reviews: 178, description: "14-inch QHD 120Hz, AMD Ryzen 9 8940HS, RTX 4060, 16GB DDR5, 1TB SSD. Compact gaming powerhouse with AniMe Matrix LED.", features: ["14-inch QHD 120Hz display", "AMD Ryzen 9 8940HS", "NVIDIA RTX 4060 8GB", "16GB DDR5 RAM", "1TB PCIe SSD", "AniMe Matrix LED array", "Dolby Atmos speakers"], images: ["https://images.unsplash.com/photo-1603302576837-37561b5b0e7d?w=400"] },
      { name: "iPhone 16 Pro Max", category: "phones", price: 1499.99, stock: 25, badge: "New", rating: 4.9, reviews: 456, description: "6.9-inch Super Retina XDR display, A18 Pro chip, 48MP main + 5x telephoto, titanium design, 48-hour battery life.", features: ["6.9-inch Super Retina XDR OLED", "A18 Pro (3nm) chip", "48MP main + 48MP ultra + 12MP 5x telephoto", "Titanium frame", "48-hour video playback", "USB-C with Thunderbolt 4", "iOS 18 with Apple Intelligence"], images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"] },
      { name: "Samsung Galaxy S25 Ultra", category: "phones", price: 1399.99, stock: 18, badge: "Featured", rating: 4.8, reviews: 312, description: "6.8-inch Dynamic AMOLED 2X 120Hz, Snapdragon 8 Gen 4, 200MP camera with AI, S Pen included, titanium frame.", features: ["6.8-inch Dynamic AMOLED 2X 120Hz", "Snapdragon 8 Gen 4", "200MP + 50MP + 12MP + 10MP quad camera", "S Pen built-in", "5000mAh battery", "IP68 water resistance", "One UI 7 with Galaxy AI"], images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400"] },
      { name: "Google Pixel 10 Pro", category: "phones", price: 1099.99, stock: 30, rating: 4.7, reviews: 198, description: "6.7-inch LTPO OLED 120Hz, Tensor G5 chip, 50MP main with AI photography, 7 years of updates.", features: ["6.7-inch LTPO OLED 120Hz", "Google Tensor G5 chip", "50MP + 48MP + 48MP camera", "AI-powered photo editing", "5050mAh battery", "7 years of OS & security updates", "Pure Android experience"], images: ["https://images.unsplash.com/photo-1570443340136-9edc5e2de4f0?w=400"] },
      { name: "OnePlus 13", category: "phones", price: 899.99, stock: 20, rating: 4.6, reviews: 145, description: "6.82-inch AMOLED 120Hz, Snapdragon 8 Gen 4, 50MP Hasselblad triple camera, 100W charging.", features: ["6.82-inch AMOLED 120Hz", "Snapdragon 8 Gen 4", "50MP Hasselblad triple camera", "100W SUPERVOOC charging", "5400mAh battery", "IP65 rating", "OxygenOS 15"], images: ["https://images.unsplash.com/photo-1553481180-5e3a6a2fe839?w=400"] },
      { name: "ROG G22CH Gaming Desktop", category: "gaming-pcs", price: 2999.99, stock: 5, badge: "Best Seller", rating: 4.9, reviews: 67, description: "Compact 10L chassis. Intel Core i9-14900K, NVIDIA RTX 4090, 64GB DDR5, 2TB SSD. Liquid-cooled for extreme performance.", features: ["Compact 10L chassis design", "Intel Core i9-14900K (24 cores)", "NVIDIA RTX 4090 24GB", "64GB DDR5-6000 RAM", "2TB NVMe SSD", "Custom 240mm AIO liquid cooling", "Wi-Fi 7 + 2.5G LAN"], images: ["https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400"] },
      { name: "Corsair Vengeance Gaming PC", category: "gaming-pcs", price: 2199.99, originalPrice: 2499.99, stock: 7, rating: 4.7, reviews: 43, description: "Mid-tower with AMD Ryzen 7 7800X3D, RTX 4070 Ti Super, 32GB DDR5, 1TB SSD. Perfect for 1440p gaming.", features: ["AMD Ryzen 7 7800X3D", "NVIDIA RTX 4070 Ti Super 16GB", "32GB DDR5-6000 RAM", "1TB NVMe SSD", "Corsair 5000D Airflow case", "Fully modular PSU", "Windows 11 Home"], images: ["https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400"] },
      { name: "RTX 5090 Liquid Cooled Workstation", category: "gaming-pcs", price: 4999.99, stock: 2, badge: "Premium", rating: 5.0, reviews: 12, description: "Dual NVIDIA RTX 5090s, Threadripper PRO 7995WX, 128GB ECC DDR5, 4TB Gen5 SSD. Absolute peak performance.", features: ["Dual NVIDIA RTX 5090 32GB each", "AMD Threadripper PRO 7995WX (96 cores)", "128GB ECC DDR5 RAM", "4TB Gen5 NVMe SSD", "Custom water cooling loop", "2000W Platinum PSU", "Professional workstation case"], images: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400"] },
      { name: "iPad Pro M4 13-inch", category: "tablets", price: 1299.99, stock: 14, badge: "New", rating: 4.8, reviews: 89, description: "Ultra-thin design with M4 chip, 13-inch Ultra Retina XDR tandem OLED, Apple Pencil Pro support. The thinnest Apple product ever.", features: ["13-inch Ultra Retina XDR tandem OLED", "Apple M4 chip (10-core CPU, 10-core GPU)", "8GB or 16GB unified memory", "256GB/512GB/1TB/2TB storage", "Thunderbolt 4 + USB-C", "Face ID", "Wi-Fi 7 + Bluetooth 5.3"], images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400"] },
      { name: "Samsung Galaxy Tab S10 Ultra", category: "tablets", price: 1199.99, originalPrice: 1399.99, stock: 9, rating: 4.7, reviews: 56, description: "14.6-inch Dynamic AMOLED 2X 120Hz, MediaTek Dimensity 9300+, 12GB RAM, 256GB SSD. S Pen included with keyboard cover.", features: ["14.6-inch Dynamic AMOLED 2X 120Hz", "MediaTek Dimensity 9300+", "12GB RAM + 256GB storage", "S Pen with Bluetooth", "Book Cover Keyboard included", "11,200mAh battery", "IP68 rating"], images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400"] },
      { name: "Sony WH-1000XM6", category: "headphones", price: 449.99, stock: 35, badge: "Featured", rating: 4.9, reviews: 567, description: "Industry-leading noise cancellation with Auto NC Optimizer. 40-hour battery, Hi-Res Audio, multipoint connection.", features: ["Industry-leading ANC with Auto NC Optimizer", "40-hour battery life", "Hi-Res Audio Wireless (LDAC)", "Multipoint connection (2 devices)", "Speak-to-Chat technology", "Adaptive Sound Control", "Foldable premium design"], images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"] },
      { name: "AirPods Max Pro", category: "headphones", price: 649.99, stock: 11, rating: 4.7, reviews: 234, description: "Apple H2 chip, adaptive audio, USB-C with lossless audio. 40-hour battery. Ultra-premium over-ear headphones.", features: ["Apple H2 chip with adaptive audio", "USB-C with lossless audio", "40-hour battery", "Active Noise Cancellation", "Transparency mode", "Spatial Audio with dynamic head tracking", "Ultra-premium build with breathable knit"], images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"] },
      { name: "Logitech MX Master 3S", category: "accessories", price: 99.99, stock: 50, rating: 4.8, reviews: 890, description: "8K DPI optical sensor, quiet clicks, USB-C, 70-day battery. The ultimate productivity mouse.", features: ["8K DPI darkfield sensor", "Quiet click buttons", "USB-C rechargeable", "70-day battery life", "MagSpeed electromagnetic scroll wheel", "Connect up to 3 devices", "Ergonomic sculpted design"], images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"] },
      { name: "Keychron Q6 Pro", category: "accessories", price: 199.99, stock: 20, badge: "Best Seller", rating: 4.6, reviews: 156, description: "Full-size QMK/VIA wireless mechanical keyboard. Gateron Jupiter switches, RGB, aluminum frame.", features: ["Full-size 100% layout", "QMK/VIA programmable", "Gateron Jupiter switches", "Per-key RGB backlight", "6063 aluminum frame", "Bluetooth 5.1 + USB-C", "Hot-swappable switches"], images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400"] },
      { name: "Samsung 49-inch Odyssey G9", category: "accessories", price: 1399.99, originalPrice: 1799.99, stock: 6, badge: "Sale", rating: 4.7, reviews: 234, description: "49-inch Dual QHD 240Hz, 1ms, OLED, HDR1000, 32:9 super ultrawide. Immersive gaming monitor.", features: ["49-inch Dual QHD (5120x1440)", "240Hz refresh rate, 0.03ms response", "OLED panel with HDR1000", "32:9 super ultrawide", "AMD FreeSync Premium Pro", "Built-in KVM switch", "1000R curvature"], images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400"] },
      { name: "SteelSeries Arctis Nova Pro", category: "accessories", price: 349.99, stock: 16, rating: 4.5, reviews: 312, description: "Premium gaming headset with Hi-Res Audio, active noise cancellation, hot-swappable battery system.", features: ["Hi-Res Audio certified", "Active Noise Cancellation", "Dual hot-swappable batteries", "ClearCast gen 2 microphone", "Sonar audio software suite", "Comfort-focused design", "Multi-platform connectivity"], images: ["https://images.unsplash.com/photo-1599669454699-248893623440?w=400"] },
      { name: "Valorant Points — 4750 VP", category: "game-topup", price: 49.99, stock: 999, rating: 4.5, reviews: 2341, description: "Instant digital delivery of Valorant Points. Redeem for skins, battle passes, and more.", features: ["Instant delivery via email", "Works on all Valorant regions", "Secure transaction", "24/7 support"], images: [] },
      { name: "Fortnite V-Bucks — 13,500", category: "game-topup", price: 79.99, stock: 999, rating: 4.4, reviews: 1876, description: "13,500 V-Bucks for Fortnite. Unlock battle passes, emotes, outfits, and more.", features: ["13,500 V-Bucks", "Cross-platform redemption", "Instant delivery", "Works on all platforms"], images: [] },
      { name: "PlayStation Network $100 Gift Card", category: "gift-cards", price: 100, stock: 500, rating: 4.8, reviews: 3421, description: "Digital PSN gift card delivered instantly via email.", features: ["$100 PSN credit", "Instant email delivery", "Redeem on PS Store", "No expiration date"], images: [] },
      { name: "Steam $50 Wallet Code", category: "gift-cards", price: 50, stock: 500, rating: 4.7, reviews: 2876, description: "Add $50 to your Steam Wallet instantly.", features: ["$50 Steam Wallet credit", "Instant delivery", "Works worldwide", "Redeem on Steam client or web"], images: [] },
      { name: "Nintendo eShop $25 Gift Card", category: "gift-cards", price: 25, stock: 500, rating: 4.6, reviews: 1543, description: "Digital Nintendo eShop gift card for Switch, Wii U, and 3DS.", features: ["$25 Nintendo eShop credit", "Works on Switch, Wii U, 3DS", "Instant email delivery", "Region-free redemption"], images: [] },
    ];

    for (const p of products) {
      const id = uuidv4();
      const exists = await query("SELECT id FROM products WHERE name = $1", [p.name]);
      if (exists.rows.length > 0) continue;
      await query(
        `INSERT INTO products (id, name, category, price, "originalPrice", rating, reviews, description, features, images, stock, badge, specs, "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11,$12,'{}'::jsonb,$13)`,
        [id, p.name, p.category, p.price, p.originalPrice || null, p.rating, p.reviews,
         p.description, JSON.stringify(p.features || []), JSON.stringify(p.images || []),
         p.stock, p.badge || null, new Date(Date.now() - Math.random() * 90 * 86400000).toISOString()]
      );
    }
    console.log(` Products seeded`);

    /* ─── Users ─── */
    const userExists = await query("SELECT id FROM users WHERE email = 'admin@rtelectronics.com'");
    if (!userExists.rows.length) {
      const hashed = await bcrypt.hash("admin123", 10);
      await query(
        'INSERT INTO users (id, name, email, password, role, avatar, addresses, wishlist, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        ["admin-root", "Admin RT", "admin@rtelectronics.com", hashed, "admin",
         "https://api.dicebear.com/7.x/avataaars/svg?seed=admin", '[]'::jsonb, '[]'::jsonb, now]
      );
      console.log(" Admin user created");
    }

    const testUsers = [
      { name: "John Smith", email: "john@example.com", password: "password123" },
      { name: "Sarah Johnson", email: "sarah@example.com", password: "password123" },
      { name: "Mike Chen", email: "mike@example.com", password: "password123" },
      { name: "Emily Davis", email: "emily@example.com", password: "password123" },
      { name: "Alex Wilson", email: "alex@example.com", password: "password123" },
    ];

    for (const u of testUsers) {
      const exists = await query("SELECT id FROM users WHERE email = $1", [u.email]);
      if (exists.rows.length > 0) continue;
      const hashed = await bcrypt.hash(u.password, 10);
      const id = uuidv4();
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`;
      await query(
        'INSERT INTO users (id, name, email, password, role, avatar, addresses, wishlist, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [id, u.name, u.email, hashed, "user", avatar, '[]'::jsonb, '[]'::jsonb, now]
      );
    }
    console.log(" Test users seeded");

    /* ─── Orders ─── */
    const existingOrders = await query("SELECT COUNT(*) FROM orders");
    if (parseInt(existingOrders.rows[0].count) === 0) {
      const users = await query("SELECT id FROM users WHERE role = 'user' LIMIT 3");
      const allProducts = await query("SELECT id, name, price FROM products");
      const statuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
      const statusWeights = [0.1, 0.15, 0.2, 0.4, 0.15];

      for (let i = 0; i < 25; i++) {
        const userId = users.rows[Math.floor(Math.random() * users.rows.length)].id;
        const numItems = Math.floor(Math.random() * 4) + 1;
        const items = [];
        let total = 0;
        for (let j = 0; j < numItems; j++) {
          const prod = allProducts.rows[Math.floor(Math.random() * allProducts.rows.length)];
          const qty = Math.floor(Math.random() * 3) + 1;
          items.push({ id: prod.id, name: prod.name, price: prod.price, quantity: qty, image: "" });
          total += prod.price * qty;
        }
        const shipping = Math.random() > 0.3 ? 9.99 : 0;
        const tax = total * 0.08;
        const roll = Math.random();
        let statusIdx = 0;
        let acc = 0;
        for (let s = 0; s < statusWeights.length; s++) {
          acc += statusWeights[s];
          if (roll < acc) { statusIdx = s; break; }
        }
        const status = statuses[statusIdx];
        const daysAgo = Math.floor(Math.random() * 60);
        const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();
        const estimated = new Date(Date.now() + (7 - daysAgo) * 86400000).toISOString();
        const oid = `ord-${uuidv4().slice(0, 8)}`;

        await query(
          `INSERT INTO orders (id, "userId", items, total, shipping, tax, address, status, "statusHistory", "estimatedDelivery", "createdAt")
           VALUES ($1,$2,$3::jsonb,$4,$5,$6,$7::jsonb,$8,$9::jsonb,$10,$11)`,
          [oid, userId, JSON.stringify(items), total, shipping, tax,
           JSON.stringify({ name: ["John", "Sarah", "Mike"][i % 3] + " " + ["Smith", "Johnson", "Chen"][i % 3], street: `${100 + i} Main St`, city: "San Francisco", state: "CA", zip: "94105" }),
           status, JSON.stringify([{ status, date: createdAt }]), estimated, createdAt]
        );

        if (status !== "cancelled") {
          for (const item of items) {
            await query(
              'INSERT INTO stock_log (id, "productId", type, quantity, note, "createdAt") VALUES ($1,$2,$3,$4,$5,$6)',
              [uuidv4(), item.id, "out", item.quantity, `Order ${oid}`, createdAt]
            );
          }
        }
      }
      console.log(" Orders seeded");
    }

    /* ─── Expenses ─── */
    const existingExpenses = await query("SELECT COUNT(*) FROM expenses");
    if (parseInt(existingExpenses.rows[0].count) === 0) {
      const expenseData = [
        { title: "Office Rent", category: "rent", amount: 4500, recurring: true },
        { title: "Electricity", category: "utilities", amount: 850, recurring: true },
        { title: "Internet & Hosting", category: "utilities", amount: 299, recurring: true },
        { title: "Warehouse Storage", category: "rent", amount: 2200, recurring: true },
        { title: "Facebook Ads Campaign", category: "marketing", amount: 3500, recurring: false },
        { title: "Google Ads", category: "marketing", amount: 4200, recurring: false },
        { title: "Instagram Influencer", category: "marketing", amount: 1500, recurring: false },
        { title: "Supplier Payment — Laptops", category: "supplier", amount: 28500, recurring: false },
        { title: "Supplier Payment — Phones", category: "supplier", amount: 32000, recurring: false },
        { title: "Supplier Payment — Accessories", category: "supplier", amount: 8500, recurring: false },
        { title: "Software Licenses (Adobe)", category: "software", amount: 599, recurring: true },
        { title: "Cloud Infrastructure (AWS)", category: "software", amount: 1200, recurring: true },
        { title: "Shipping Partner — FedEx", category: "shipping", amount: 2800, recurring: false },
        { title: "Employee Salary — Developers", category: "salary", amount: 18000, recurring: true },
        { title: "Customer Support Team", category: "salary", amount: 8500, recurring: true },
        { title: "Warehouse Staff", category: "salary", amount: 6500, recurring: true },
      ];

      for (let d = 0; d < 60; d++) {
        const date = new Date(Date.now() - d * 86400000);
        const dateStr = date.toISOString().slice(0, 10);
        for (const e of expenseData) {
          if (e.recurring || (d % 15 === 0 && !e.recurring)) {
            const amount = e.amount * (0.85 + Math.random() * 0.3);
            await query(
              'INSERT INTO expenses (id, title, category, amount, description, date, recurring, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
              [uuidv4(), e.title, e.category, Math.round(amount * 100) / 100,
               d === 0 ? "Auto-seeded" : null, dateStr, e.recurring, new Date(date.getTime() + 3600000).toISOString()]
            );
          }
        }
      }
      console.log(" Expenses seeded");
    }

    /* ─── Reviews ─── */
    const existingReviews = await query("SELECT COUNT(*) FROM reviews");
    if (parseInt(existingReviews.rows[0].count) < 10) {
      const prodRows = await query("SELECT id, name FROM products LIMIT 8");
      const reviewers = ["TechGuru99", "GamerPro", "PixelPusher", "AudioPhyl", "DigitalNomad", "CodeWizard", "CyberSam", "NeonRider"];
      const comments = [
        "Absolutely incredible product. Exceeded all my expectations. The build quality is phenomenal.",
        "Great value for the price. Would definitely recommend to anyone looking for quality gear.",
        "Solid performance. Had it for two weeks now and I'm really impressed with the battery life.",
        "A bit pricey but worth every penny. The attention to detail is unmatched.",
        "Perfect for my workflow. The ecosystem integration is seamless and intuitive.",
        "Five stars. Shipping was fast and the packaging was pristine. No issues at all.",
        "Upgraded from previous gen and the difference is night and day. Highly recommended.",
        "Outstanding build quality. This will be my daily driver for years to come.",
      ];

      for (const p of prodRows.rows) {
        for (let i = 0; i < 3; i++) {
          const idx = Math.floor(Math.random() * reviewers.length);
          await query(
            `INSERT INTO reviews (id, "productId", "userId", "userName", rating, title, comment, verified, "createdAt")
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [uuidv4(), p.id, uuidv4(), reviewers[idx], Math.floor(Math.random() * 2) + 4,
             `Amazing ${p.name} experience!`, comments[Math.floor(Math.random() * comments.length)],
             true, new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()]
          );
        }
      }
      console.log(" Reviews seeded");
    }

    /* ─── Suppliers ─── */
    const existingSuppliers = await query("SELECT COUNT(*) FROM suppliers");
    if (parseInt(existingSuppliers.rows[0].count) === 0) {
      const supplierData = [
        { name: "TechSupply Global", contact: "David Park", email: "david@techsupply.com", phone: "+1-555-0101", address: "4427 Innovation Drive, Shenzhen, China", notes: "Primary laptop and phone supplier. MOQ: 50 units." },
        { name: "AudioCraft Pro", contact: "Lisa Martinez", email: "lisa@audiocraft.com", phone: "+1-555-0102", address: "89 Sound Boulevard, Austin, TX 78701", notes: "Premium headphones and audio gear. Net 30 terms." },
        { name: "GameRig Systems", contact: "Tom Nguyen", email: "tom@gamerig.com", phone: "+1-555-0103", address: "1567 Esports Way, Los Angeles, CA 90001", notes: "Gaming PC components and peripherals." },
        { name: "AccessoryWorld Inc", contact: "Rachel Kim", email: "rachel@accessoryworld.io", phone: "+1-555-0104", address: "233 Cable Street, Portland, OR 97201", notes: "All accessories. Great bulk pricing." },
        { name: "Digital Codes Direct", contact: "Support Team", email: "support@digitalcodes.com", phone: "+1-555-0105", address: "100 Virtual Lane, Miami, FL 33101", notes: "Game top-ups and gift cards. Instant digital delivery." },
      ];
      for (const s of supplierData) {
        await query(
          'INSERT INTO suppliers (id, name, contact, email, phone, address, notes, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
          [uuidv4(), s.name, s.contact, s.email, s.phone, s.address, s.notes, now]
        );
      }
      console.log(" Suppliers seeded");
    }

    /* ─── Subscribers ─── */
    const existingSubs = await query("SELECT COUNT(*) FROM subscribers");
    if (parseInt(existingSubs.rows[0].count) === 0) {
      const emails = ["alex@techblog.com", "sarah@designhub.io", "mike.dev@gmail.com", "emma@startup.co", "james@creative.agency", "lisa@freelance.work", "raj@enterprise.com", "nina@studio.design"];
      for (const email of emails) {
        await query('INSERT INTO subscribers (id, email, "createdAt") VALUES ($1,$2,$3) ON CONFLICT (email) DO NOTHING',
          [uuidv4(), email, new Date(Date.now() - Math.random() * 60 * 86400000).toISOString()]);
      }
      console.log(" Subscribers seeded");
    }

    /* ─── Coupons ─── */
    const existingCoupons = await query("SELECT COUNT(*) FROM coupons");
    if (parseInt(existingCoupons.rows[0].count) === 0) {
      const coupons = [
        { code: "WELCOME10", discount: 10, type: "percent", minOrder: 50, maxUses: 100, active: true, expiresAt: "2026-12-31" },
        { code: "SAVE50", discount: 50, type: "flat", minOrder: 200, maxUses: 50, active: true, expiresAt: "2026-09-30" },
        { code: "FREESHIP", discount: 0, type: "free_shipping", minOrder: 0, maxUses: 200, active: true, expiresAt: "2026-08-31" },
        { code: "GAMER20", discount: 20, type: "percent", minOrder: 100, maxUses: 75, active: true, expiresAt: "2026-10-31" },
        { code: "FLASH25", discount: 25, type: "percent", minOrder: 150, maxUses: 30, active: true, expiresAt: "2026-07-15" },
      ];
      for (const c of coupons) {
        await query(
          'INSERT INTO coupons (id, code, discount, type, "minOrder", "maxUses", used, active, "expiresAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
          [uuidv4(), c.code, c.discount, c.type, c.minOrder, c.maxUses, 0, c.active, c.expiresAt]
        );
      }
      console.log(" Coupons seeded");
    }

    /* ─── Contact messages ─── */
    const existingContacts = await query("SELECT COUNT(*) FROM contacts");
    if (parseInt(existingContacts.rows[0].count) === 0) {
      const messages = [
        { name: "Robert Williams", email: "robert@email.com", subject: "Order Status Inquiry", message: "Hi, I placed an order (RT-1234) three days ago and it's still showing as confirmed. Can you please provide an update on when it will ship?" },
        { name: "Jennifer Lee", email: "jennifer@gmail.com", subject: "Product Suggestion", message: "I would love to see more eco-friendly tech accessories in your store. Are you planning to add any sustainable products to your lineup?" },
        { name: "Chris Brown", email: "chris@outlook.com", subject: "Return Request", message: "I received my order but the item is damaged during shipping. How do I initiate a return and get a replacement?" },
      ];
      for (const m of messages) {
        await query(
          'INSERT INTO contacts (id, name, email, subject, message, read, "createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [uuidv4(), m.name, m.email, m.subject, m.message, Math.random() > 0.5, new Date(Date.now() - Math.random() * 14 * 86400000).toISOString()]
        );
      }
      console.log(" Contacts seeded");
    }

    console.log(" Seed complete!");
  } catch (e) {
    console.error(" Seed error:", e.message);
  }
}
