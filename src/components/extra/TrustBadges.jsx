import { useTranslation } from "react-i18next";
import { Shield, Lock, CreditCard, BadgeCheck } from "lucide-react";

export default function TrustBadges() {
  const { t } = useTranslation();
  const badges = [
    { icon: Shield, text: t("trust_badges.ssl") },
    { icon: Lock, text: t("trust_badges.secure") },
    { icon: CreditCard, text: t("trust_badges.cards") },
    { icon: BadgeCheck, text: t("trust_badges.pci") },
  ];

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <div key={b.text} className="flex items-center gap-2 text-white/30 text-xs">
            <Icon size={16} className="text-[var(--color-primary)]" />
            {b.text}
          </div>
        );
      })}
    </div>
  );
}
