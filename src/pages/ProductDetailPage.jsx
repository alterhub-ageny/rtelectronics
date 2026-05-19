import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Star, Check, Truck, Shield, RotateCcw, Heart, MessageSquare, Clock } from "lucide-react";
import RecentlyViewed, { addRecent } from "../components/extra/RecentlyViewed";
import ShareButtons from "../components/extra/ShareButtons";
import { getProduct, getReviews, submitReview } from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ImageGallery from "../components/ui/ImageGallery";
import Breadcrumbs from "../components/ui/Breadcrumbs";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const addToast = useToast();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewing, setReviewing] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    Promise.all([getProduct(id), getReviews(id)])
      .then(([p, r]) => { setProduct(p); setReviews(r.reviews); setStats(r.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
    addRecent(id);
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-3xl skeleton" />
          <div className="space-y-4"> <div className="h-8 skeleton rounded w-3/4" /> <div className="h-4 skeleton rounded w-1/4" /> <div className="h-32 skeleton rounded" /> </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/10 flex items-center justify-center mb-4">
          <ArrowLeft size={24} className="text-[var(--color-primary)]/40" />
        </div>
        <p className="heading-md mb-4">UNIT NOT FOUND</p>
        <Link to="/products" className="btn btn-primary">BACK TO PRODUCTS</Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    setAdded(true);
    addToast(`${product.name} added to cart`, "success");
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { addToast("Please sign in to review", "warning"); return; }
    setReviewing(true);
    try {
      const r = await submitReview({ productId: product.id, ...reviewForm });
      setReviews((prev) => [r, ...prev]);
      setReviewForm({ rating: 5, title: "", comment: "" });
      addToast("Review submitted!", "success");
    } catch { addToast("Failed to submit review", "error"); }
    finally { setReviewing(false); }
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="max-w-site mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs items={[
        { label: "Products", href: "/products" },
        { label: product.category, href: `/products?category=${product.category}` },
        { label: product.name },
      ]} />

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <ImageGallery images={product.images} productName={product.name} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[0.75rem] text-[var(--color-text-muted)] font-mono uppercase tracking-wider">{product.category}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="heading-lg mb-2">{product.name}</h1>
              <ShareButtons product={product} />
            </div>
            <button onClick={() => { toggle(product.id); addToast(wishlisted ? "Removed from wishlist" : "Added to wishlist", "info"); }}
              className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-red-400/30 transition-all shrink-0"
            >
              <Heart size={20} className={wishlisted ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <span className="font-medium text-[var(--color-text)]">{product.rating}</span>
              <span className="text-[var(--color-text-muted)] text-xs">({stats.total || product.reviews} reviews)</span>
            </div>
            <span className="text-[var(--color-text-muted)]">|</span>
            <span className={`text-sm font-medium ${product.stock > 10 ? "text-emerald-400" : product.stock > 0 ? "text-orange-400" : "text-red-400"}`}>
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="price text-5xl">MAD {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <><span className="text-2xl text-[var(--color-text-muted)] line-through">MAD {product.originalPrice.toLocaleString()}</span>
              <span className="px-3 py-1 text-sm font-bold rounded-full bg-red-500/20 text-red-400">-{discount}% OFF</span></>
            )}
          </div>

          <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--card-bg-hover)] rounded-xl transition-all">-</button>
              <span className="w-12 text-center font-medium text-[var(--color-text)]">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--card-bg-hover)] rounded-xl transition-all">+</button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all flex items-center justify-center gap-3 ${
              added
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : product.stock === 0
                ? "bg-[var(--card-bg)] text-[var(--color-text-muted)] cursor-not-allowed border border-[var(--card-border)]"
                : "btn btn-primary btn-lg w-full"
            }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : added
              ? <><Check size={22} /> Added!</>
              : <><ShoppingCart size={22} /> Add to Cart - MAD {(product.price * quantity).toLocaleString()}</>
            }
          </motion.button>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { icon: Truck, text: "Free Shipping", sub: "On orders MAD 499+" },
              { icon: Shield, text: "2 Year Warranty", sub: "Full coverage" },
              { icon: RotateCcw, text: "30-Day Returns", sub: "No questions asked" },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="premium-card p-4 text-center">
                <Icon size={20} className="text-[var(--color-primary)] mx-auto mb-2" />
                <p className="font-medium text-sm text-[var(--color-text)]">{text}</p>
                <p className="text-[var(--color-text-muted)] text-xs">{sub}</p>
              </div>
            ))}
          </div>

          {product.features?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold text-[var(--color-text)] mb-3">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((f) => (
                  <span key={f} className="px-4 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--color-text-muted)] text-sm flex items-center gap-1">
                    <Check size={14} className="text-[var(--color-primary)]" /> {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.specs && (
            <div className="mt-8">
              <h3 className="font-semibold text-[var(--color-text)] mb-3">Specifications</h3>
              <div className="glass-card overflow-hidden">
                {Object.entries(product.specs).map(([key, val], i) => (
                  <div key={key} className={`flex justify-between px-5 py-3 ${i % 2 === 0 ? "bg-[var(--card-bg-hover)]" : ""}`}>
                    <span className="text-[var(--color-text-muted)] text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-medium text-sm text-[var(--color-text)]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <RecentlyViewed />

      <div className="border-t border-[var(--card-border)] pt-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="section-title flex items-center gap-3"><MessageSquare size={28} className="text-[var(--color-primary)]" /> Reviews</h2>
            <p className="text-[var(--color-text-muted)] mt-1">{stats.total || reviews.length} reviews</p>
          </div>
          {stats.distribution && (
            <div className="hidden sm:flex items-center gap-2">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = stats.distribution.find((d) => d.star === s)?.count || 0;
                const max = Math.max(...stats.distribution.map((d) => d.count), 1);
                return (
                  <div key={s} className="flex items-center gap-1">
                    <span className="text-[var(--color-text-muted)] text-xs">{s}</span>
                    <div className="w-12 h-1.5 rounded-full bg-[var(--card-bg-hover)] overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            {user ? (
              <form onSubmit={handleReview} className="glass-card p-5 sticky top-28">
                <h3 className="font-semibold text-[var(--color-text)] mb-4">Write a Review</h3>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                      <Star size={22} className={s <= reviewForm.rating ? "text-amber-400 fill-amber-400" : "text-[var(--color-text-muted)] opacity-20"} />
                    </button>
                  ))}
                </div>
                <input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="Review title" className="input mb-3" />
                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..." rows={4} className="input mb-3 resize-none" />
                <button type="submit" disabled={reviewing || !reviewForm.comment} className="btn btn-primary w-full">
                  {reviewing ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="glass-card p-5 text-center sticky top-28">
                <p className="text-[var(--color-text-muted)] text-sm mb-4">Sign in to write a review</p>
                <Link to="/login" className="btn btn-primary">Sign In</Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                <p>No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-sm text-[var(--color-text)]">{r.userName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-[var(--color-text-muted)] opacity-20"} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-xs">
                      <Clock size={12} />
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {r.title && <p className="font-medium text-sm text-[var(--color-text)] mb-1">{r.title}</p>}
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{r.comment}</p>
                  {r.verified && <span className="inline-block mt-2 text-[0.625rem] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Verified Purchase</span>}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
