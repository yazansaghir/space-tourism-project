import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../data/data.json";
import CrewDots from "../../components/Crew/CrewDots";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import "./Crew.css";

const CREW = data.crew;

const TEXT_VARIANTS = {
  container: {
    animate: {
      transition: { staggerChildren: 0.12, delayChildren: 0.08 },
    },
    exit: {
      transition: { staggerChildren: 0.06, staggerDirection: -1 },
    },
  },
  role: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  name: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  bio: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

const IMAGE_TRANSITION = {
  type: "spring",
  stiffness: 80,
  damping: 20,
};

function toPublicPath(path) {
  if (!path) return "";
  return path.startsWith("./") ? path.replace("./", "/") : path;
}

export default function Crew() {
  useDocumentTitle("Crew");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const intervalRef = useRef(null);
  const current = CREW[currentIndex];

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => (i <= 0 ? CREW.length - 1 : i - 1));
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((i) => (i >= CREW.length - 1 ? 0 : i + 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (autoPlayPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i >= CREW.length - 1 ? 0 : i + 1));
    }, 6000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPlayPaused]);

  const imageSrc = current?.images?.webp
    ? toPublicPath(current.images.webp)
    : toPublicPath(current?.images?.png || "");

  return (
    <div className="crew-page">
      <div className="crew__container">
        <h5 className="crew__page-title">
          <span className="crew__page-number">02</span>
          Meet your crew
        </h5>

        <div className="crew__content">
          {/* Left column: Text + Dots (desktop); reordered on mobile via CSS */}
          <div
            className="crew__info"
            onMouseEnter={() => setAutoPlayPaused(true)}
            onMouseLeave={() => setAutoPlayPaused(false)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="crew__text"
                  variants={TEXT_VARIANTS.container}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <motion.h4
                    className="crew__role"
                    variants={TEXT_VARIANTS.role}
                    transition={{ duration: 0.35 }}
                  >
                    {current.role}
                  </motion.h4>
                  <motion.h3
                    className="crew__name"
                    variants={TEXT_VARIANTS.name}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {current.name}
                  </motion.h3>
                  <motion.p
                    className="crew__bio"
                    variants={TEXT_VARIANTS.bio}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  >
                    {current.bio}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            <CrewDots
              crew={CREW}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </div>

          <div className="crew__image-wrap">
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="crew__image-inner"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={IMAGE_TRANSITION}
                >
                  <picture>
                    {current.images?.webp && (
                      <source
                        srcSet={toPublicPath(current.images.webp)}
                        type="image/webp"
                      />
                    )}
                    <img
                      src={imageSrc}
                      alt={current.name}
                      className="crew__image"
                      loading="eager"
                    />
                  </picture>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
