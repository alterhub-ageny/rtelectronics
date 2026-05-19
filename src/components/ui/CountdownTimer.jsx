import { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate, className = "" }) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);

  useEffect(() => {
    const t = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div className={`flex items-center gap-3 font-mono ${className}`}>
      {Object.entries(time).map(([k, v]) => (
        <div key={k} className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-[var(--color-primary)] bg-white/5 rounded-xl px-3 py-2 min-w-[3rem] neon-border">
            {String(v).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{k}</div>
        </div>
      ))}
    </div>
  );
}
