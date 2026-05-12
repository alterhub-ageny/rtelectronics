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
          <div className="aspect-square rounded-3xl bg-white/5 animate-pulse" />
          <div className="space-y-4"> <div className="h-8 bg-white/5 rounded w-3/4" /> <div className="h-4 bg-white/5 rounded w-1/4" /> <div className="h-32 bg-white/5 rounded" /> </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 rounded-2xl bg-rt-accent/5 border border-rt-accent/10 flex items-center justify-center mb-4">
          <ArrowLeft size={24} className="text-rt-accent/40" />
        </div>
        <p className="text-lg font-display font-bold text-white/50 mb-4">UNIT NOT FOUND</p>
        <Link to="/products" className="btn-crystal text-xs px-5 py-2.5">BACK TO PRODUCTS</Link>
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
            <span className="text-xs text-white/40 font-mono uppercase tracking-wider">{product.category}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{product.name}</h1>
              <ShareButtons product={product} />
            </div>
            <button onClick={() => { toggle(product.id); addToast(wishlisted ? "Removed from wishlist" : "Added to wishlist", "info"); }}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-400/30 transition-all shrink-0"
            >
              <Heart size={20} className={wishlisted ? "fill-red-400 text-red-400" : "text-white/50"} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star size={18} className="text-rt-gold fill-rt-gold" />
              <span className="text-white font-medium">{product.rating}</span>
              <span className="text-white/30 text-xs">({stats.total || product.reviews} reviews)</span>
            </div>
            <span className="text-white/30">|</span>
            <span className={`text-sm font-medium ${product.stock > 10 ? "text-rt-accent3" : product.stock > 0 ? "text-orange-400" : "text-red-400"}`}>
              {product.stock > 10 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-5xl font-display font-bold text-rt-accent text-glow-crystal">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <><span className="text-2xl text-white/30 line-through">${product.originalPrice.toLocaleString()}</span>
              <span className="px-3 py-1 text-sm font-bold rounded-full bg-red-500/20 text-red-400">-{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span></>
            )}
          </div>

          <p className="text-white/60 leading-relaxed mb-8">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-white/5 rounded-xl border border-white/10">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">-</button>
              <span className="w-12 text-center text-white font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all">+</button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all flex items-center justify-center gap-3 ${
              added ? "bg-rt-accent3/20 text-rt-accent3 border border-rt-accent3/40"
                : product.stock === 0 ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-gradient-to-r from-rt-accent to-rt-accent2 text-white shadow-lg shadow-rt-accent/20 hover:shadow-rt-accent/40"
            }`}
          >
            {product.stock === 0 ? "Out of Stock" : added ? <><Check size={22} /> Added!</> : <><ShoppingCart size={22} /> Add to Cart - ${(product.price * quantity).toLocaleString()}</>}
          </motion.button>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { icon: Truck, text: "Free Shipping", sub: "On orders $499+" },
              { icon: Shield, text: "2 Year Warranty", sub: "Full coverage" },
              { icon: RotateCcw, text: "30-Day Returns", sub: "No questions asked" },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="crystal rounded-xl p-4 text-center border border-white/5">
                <Icon size={20} className="text-rt-accent mx-auto mb-2" />
                <p className="text-white text-sm font-medium">{text}</p>
                <p className="text-white/30 text-xs">{sub}</p>
              </div>
            ))}
          </div>

          {product.features?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-3">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((f) => (
                  <span key={f} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm flex items-center gap-1">
                    <Check size={14} className="text-rt-accent" /> {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.specs && (
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-3">Specifications</h3>
              <div className="crystal rounded-2xl border border-white/5 overflow-hidden">
                {Object.entries(product.specs).map(([key, val], i) => (
                  <div key={key} className={`flex justify-between px-5 py-3 ${i % 2 === 0 ? "bg-white/5" : ""}`}>
                    <span className="text-white/40 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-white text-sm font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Reviews */}
      <div className="border-t border-white/5 pt-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="section-crystal-title flex items-center gap-3"><MessageSquare size={28} className="text-rt-accent" /> Reviews</h2>
            <p className="text-white/40 mt-1">{stats.total || reviews.length} reviews</p>
          </div>
          {stats.distribution && (
            <div className="hidden sm:flex items-center gap-2">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = stats.distribution.find((d) => d.star === s)?.count || 0;
                const max = Math.max(...stats.distribution.map((d) => d.count), 1);
                return (
                  <div key={s} className="flex items-center gap-1">
                    <span className="text-white/30 text-xs">{s}</span>
                    <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-rt-gold rounded-full" style={{ width: `${(count / max) * 100}%` }} />
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
              <form onSubmit={handleReview} className="crystal rounded-2xl p-5 border border-white/5 sticky top-28">
                <h3 className="text-white font-semibold mb-4">Write a Review</h3>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                      <Star size={22} className={s <= reviewForm.rating ? "text-rt-gold fill-rt-gold" : "text-white/20"} />
                    </button>
                  ))}
                </div>
                <input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                  placeholder="Review title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm mb-3 focus:outline-none focus:border-rt-accent/50" />
                <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience..." rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm mb-3 focus:outline-none focus:border-rt-accent/50 resize-none" />
                <button type="submit" disabled={reviewing || !reviewForm.comment} className="btn-crystal w-full text-sm">
                  {reviewing ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="crystal rounded-2xl p-5 border border-white/5 text-center sticky top-28">
                <p className="text-white/50 text-sm mb-4">Sign in to write a review</p>
                <Link to="/login" className="btn-crystal text-sm">Sign In</Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-white/40">
                <MessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                <p>No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="crystal rounded-2xl p-5 border border-white/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium text-sm">{r.userName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14} className={i < r.rating ? "text-rt-gold fill-rt-gold" : "text-white/20"} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-white/20 text-xs">
                      <Clock size={12} />
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {r.title && <p className="text-white font-medium text-sm mb-1">{r.title}</p>}
                  <p className="text-white/50 text-sm leading-relaxed">{r.comment}</p>
                  {r.verified && <span className="inline-block mt-2 text-[10px] text-rt-accent3 bg-rt-accent3/10 px-2 py-0.5 rounded-full">Verified Purchase</span>}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
