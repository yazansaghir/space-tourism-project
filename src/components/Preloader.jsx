import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DURATION_MS = 2500;

export default function Preloader() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let rafId;

    const tick = (now) => {
      const elapsed = now - start;
      const p = Math.min(100, Math.floor((elapsed / DURATION_MS) * 100));
      setPercent(p);
      if (elapsed < DURATION_MS) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-space-dark flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="w-full max-w-[20rem] px-6 flex flex-col items-center gap-4">
        {/* Percentage counter */}
        <p
          className="font-sans-cond text-white text-[clamp(1.5rem,4vw,2rem)] tracking-[0.2em]"
          aria-live="polite"
        >
          {String(percent).padStart(2, "0")}%
        </p>

        {/* Progress track */}
        <div className="w-full h-px bg-white/20 overflow-hidden">
          <motion.div
            className="h-full bg-white will-change-[width]"
            initial={{ width: "0%" }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.15, ease: "linear" }}
          />
        </div>

        {/* Label */}
        <p className="font-sans-cond text-white/70 text-[clamp(0.625rem,1.5vw,0.75rem)] tracking-[0.3em] uppercase">
          Initiating launch sequence...
        </p>
      </div>
    </motion.div>
  );
}
