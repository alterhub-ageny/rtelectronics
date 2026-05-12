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
    <footer className="relative border-t border-white/[0.02] bg-[#020208] mt-20">
      <div className="absolute inset-0 bg-neural opacity-[0.008]" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rt-accent/10 to-transparent" />

      <div className="max-w-site mx-auto px-4 sm:px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl crystal flex items-center justify-center">
                <span className="text-rt-accent text-base font-display font-bold">⟁</span>
              </div>
              <div>
                <span className="text-sm font-display font-bold tracking-[0.2em]">
                  <span className="text-white/70">RT</span>
                  <span className="text-rt-accent/30">⏺</span>
                </span>
                <p className="text-[9px] text-white/15 tracking-[0.25em] uppercase font-mono">Crystal Systems</p>
              </div>
            </div>
            <p className="text-white/20 text-sm leading-relaxed mb-6 max-w-md font-grotesk">
              Next-generation tech ecosystem. Crystalline engineering meets neural intelligence.
            </p>
            <div className="flex gap-2">
              {[Github, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/[0.03] flex items-center justify-center text-white/20 hover:text-rt-accent hover:border-rt-accent/20 hover:bg-white/[0.03] transition-all duration-500"
                >
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>

          {links.map((group) => (
            <div key={group.title}>
              <h3 className="text-white/30 font-display text-[10px] tracking-[0.2em] uppercase mb-5">
                <span className="text-rt-accent/40">◈</span> {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-white/20 hover:text-rt-accent text-[12px] transition-colors duration-500 flex items-center gap-1.5 group/link font-grotesk"
                    >
                      <ChevronRight size={8} className="text-rt-accent/20 group-hover/link:text-rt-accent transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-white/30 font-display text-[10px] tracking-[0.2em] uppercase mb-5">
              <span className="text-rt-accent/40">◈</span> Connect
            </h3>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: "123 Crystal Tower, Neo District" },
                { icon: Phone, text: "+1 (800) CRYSTAL" },
                { icon: Mail, text: "crystal@rtelectronics.com" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2.5 text-white/20 text-xs font-grotesk">
                  <item.icon size={12} className="mt-0.5 text-rt-accent/40 shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/10 text-[10px] font-mono tracking-wider">
            &copy; {new Date().getFullYear()} RT CRYSTAL SYSTEMS
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms"].map((text) => (
              <a key={text} href="#" className="text-white/15 hover:text-rt-accent text-[10px] transition-colors font-mono">
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
