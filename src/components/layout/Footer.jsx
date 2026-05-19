import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Github, Twitter, Instagram, Youtube, ChevronRight, Zap } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";

export default function Footer() {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const links = [
    { title: t("footer.shop"), items: categories.map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })) },
    {
      title: t("footer.quick_links"),
      items: [
        { label: t("footer.about_us"), href: "/about" },
        { label: t("footer.contact"), href: "/contact" },
        { label: t("footer.faq"), href: "/faq" },
        { label: t("footer.wishlist"), href: "/wishlist" },
      ],
    },
  ];

  return (
    <footer className="theme-footer relative mt-32">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent" />

      <div className="max-w-site mx-auto px-4 sm:px-6 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-[0.2em] text-[var(--footer-heading)]">RT</span>
                <p className="text-[8px] text-[var(--footer-text)] tracking-[0.2em] uppercase font-mono">ELECTRONICS</p>
              </div>
            </div>
            <p className="text-[var(--footer-text)] text-sm leading-relaxed mb-8 max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex gap-2">
              {[Github, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl border border-[var(--footer-border)] bg-white/[0.02] flex items-center justify-center text-[var(--footer-text)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 transition-all duration-300">
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {links.map((group) => (
            <div key={group.title}>
              <h3 className="text-[var(--footer-heading)] text-[0.6875rem] font-semibold tracking-[0.15em] uppercase mb-6">{group.title}</h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-[var(--footer-text)] hover:text-[var(--footer-text-hover)] text-[0.875rem] transition-colors duration-300 flex items-center gap-2 group/link">
                      <ChevronRight size={10} className="text-[var(--color-primary)]/40 group-hover/link:text-[var(--color-primary)] transition-colors" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-[var(--footer-heading)] text-[0.6875rem] font-semibold tracking-[0.15em] uppercase mb-6">{t("footer.connect")}</h3>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: t("footer.address") },
                { icon: Phone, text: t("footer.phone") },
                { icon: Mail, text: t("footer.email") },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-[var(--footer-text)] text-[0.875rem]">
                  <item.icon size={14} className="mt-0.5 text-[var(--color-primary)]/50 shrink-0" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[var(--footer-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[var(--footer-text)] text-[0.8125rem] font-mono opacity-60">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-6">
            {[t("footer.privacy"), t("footer.terms")].map((text) => (
              <a key={text} href="#" className="text-[var(--footer-text)] hover:text-[var(--footer-text-hover)] text-[0.8125rem] transition-colors">{text}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
