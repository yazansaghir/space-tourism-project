import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Preloader.css";

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
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="preloader__inner">
        <p className="preloader__percent" aria-live="polite">
          {String(percent).padStart(2, "0")}%
        </p>
        <div className="preloader__track">
          <motion.div
            className="preloader__bar"
            initial={{ width: "0%" }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.15, ease: "linear" }}
          />
        </div>
        <p className="preloader__label">INITIATING LAUNCH SEQUENCE...</p>
      </div>
    </motion.div>
  );
}
