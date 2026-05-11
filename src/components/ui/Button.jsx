import { motion } from "framer-motion";

export default function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled,
  type = "button",
  href,
}) {
  const base = variant === "primary" ? "btn-primary" : "btn-secondary";

  if (href) {
    return (
      <a href={href} className={`${base} inline-block text-center ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
    >
      {children}
    </motion.button>
  );
}
