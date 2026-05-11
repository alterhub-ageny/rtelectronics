import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin, Github, Twitter, Instagram, Youtube } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

export default function Footer() {
  const { categories } = useCategories();

  return (
    <footer className="relative border-t border-white/5 bg-rt-darker/80">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.02]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <Zap size={28} className="text-rt-accent" />
              <span className="text-xl font-display font-bold">
                <span className="text-white">RT</span>
                <span className="text-rt-accent"> ELECTRONICS</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              The future of tech shopping. Premium electronics, gaming gear, and digital services at unbeatable prices.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-rt-accent hover:border-rt-accent/30 hover:bg-white/10 transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold text-sm tracking-widest uppercase mb-5">Shop</h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.slug}`} className="text-white/50 hover:text-rt-accent text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold text-sm tracking-widest uppercase mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/50 hover:text-rt-accent text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-white/50 hover:text-rt-accent text-sm transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-white/50 hover:text-rt-accent text-sm transition-colors">FAQ</Link></li>
              <li><Link to="/wishlist" className="text-white/50 hover:text-rt-accent text-sm transition-colors">Wishlist</Link></li>
              <li><Link to="/account" className="text-white/50 hover:text-rt-accent text-sm transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-display font-semibold text-sm tracking-widest uppercase mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin size={16} className="mt-0.5 text-rt-accent shrink-0" />
                123 Tech Hub, Innovation City, TC 10001
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone size={16} className="text-rt-accent shrink-0" />
                +1 (800) RT-TECH
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail size={16} className="text-rt-accent shrink-0" />
                support@rtelectronics.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} RT ELECTRONICS. All rights reserved.
          </p>
          <div className="flex gap-6 text-white/30 text-xs">
            <a href="#" className="hover:text-rt-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-rt-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
