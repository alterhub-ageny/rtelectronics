import { Shield, Lock, CreditCard, BadgeCheck } from "lucide-react";

const badges = [
  { icon: Shield, text: "256-bit SSL" },
  { icon: Lock, text: "Secure Checkout" },
  { icon: CreditCard, text: "Visa, MC, PayPal" },
  { icon: BadgeCheck, text: "PCI Compliant" },
];

export default function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <div key={b.text} className="flex items-center gap-2 text-white/30 text-xs">
            <Icon size={16} className="text-rt-accent" />
            {b.text}
          </div>
        );
      })}
    </div>
  );
}
