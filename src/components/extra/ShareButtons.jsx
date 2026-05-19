import { motion } from "framer-motion";
import { Share2, Link2, Twitter, Linkedin, Mail } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function ShareButtons({ product }) {
  const addToast = useToast();

  const url = window.location.href;
  const text = `Check out ${product?.name} at RT ELECTRONICS!`;

  const share = (platform) => {
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      mail: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => addToast("Link copied!", "success")).catch(() => {});
      return;
    }
    window.open(links[platform], "_blank", "width=600,height=400");
  };

  const buttons = [
    { icon: Link2, action: "copy", label: "Copy" },
    { icon: Twitter, action: "twitter", label: "Twitter" },
    { icon: Linkedin, action: "linkedin", label: "LinkedIn" },
    { icon: Mail, action: "mail", label: "Email" },
  ];

  return (
    <div className="flex items-center gap-2">
      <Share2 size={16} className="text-white/30" />
      {buttons.map((b) => {
        const Icon = b.icon;
        return (
          <motion.button
            key={b.action}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => share(b.action)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 transition-all"
            title={b.label}
          >
            <Icon size={14} />
          </motion.button>
        );
      })}
    </div>
  );
}
