import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Twitter, Instagram, Youtube, ChevronRight } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

export default function Footer() {
  const { categories } = useCategories();
  const links = [
    { title: "Shop", items: categories.map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })) },
    {
      title: "Quick Links",
      items: [
        { label: "About Us", href: "/about" },
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "My Account", href: "/account" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-white/[0.02] bg-[#050508] mt-20">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rt-accent/10 via-cyan-500/5 to-transparent" />

      <div className="max-w-site mx-auto px-4 sm:px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rt-accent/10 to-cyan-500/5 border border-rt-accent/10 flex items-center justify-center">
                <span className="text-base font-display font-bold text-white/80">RT</span>
              </div>
              <div>
                <span className="text-sm font-display font-bold tracking-[0.25em] text-white/60">ELECTRONICS</span>
                <p className="text-[9px] text-white/15 tracking-[0.25em] uppercase font-mono">Future of Tech</p>
              </div>
            </div>
            <p className="text-white/20 text-sm leading-relaxed mb-6 max-w-md">
              Curated selection of premium electronics and gaming gear. Quality products, competitive prices, exceptional service.
            </p>
            <div className="flex gap-2">
              {[Github, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.03] flex items-center justify-center text-white/20 hover:text-rt-accent hover:border-rt-accent/20 hover:bg-rt-accent/[0.03] transition-all duration-300">
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {links.map((group) => (
            <div key={group.title}>
              <h3 className="text-white/25 font-display text-[10px] tracking-[0.2em] uppercase mb-5">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-white/20 hover:text-white text-[12px] transition-colors duration-300 flex items-center gap-1.5 group/link">
                      <ChevronRight size={8} className="text-rt-accent/30 group-hover/link:text-rt-accent transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white/25 font-display text-[10px] tracking-[0.2em] uppercase mb-5">Connect</h3>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: "123 Tech Tower, Neo District" },
                { icon: Phone, text: "+1 (800) TECH" },
                { icon: Mail, text: "hello@rtelectronics.com" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2.5 text-white/20 text-xs">
                  <item.icon size={12} className="mt-0.5 text-rt-accent/30 shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/10 text-[10px] font-mono tracking-wider">&copy; {new Date().getFullYear()} RT ELECTRONICS</p>
          <div className="flex gap-6">
            {["Privacy", "Terms"].map((text) => (
              <a key={text} href="#" className="text-white/15 hover:text-white text-[10px] transition-colors font-mono">{text}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
