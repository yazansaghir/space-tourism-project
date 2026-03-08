import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../data/data.json";
import CrewDots from "../../components/Crew/CrewDots";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

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
      if (e.key === "ArrowLeft")
        setCurrentIndex((i) => (i <= 0 ? CREW.length - 1 : i - 1));
      if (e.key === "ArrowRight")
        setCurrentIndex((i) => (i >= CREW.length - 1 ? 0 : i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (autoPlayPaused) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i >= CREW.length - 1 ? 0 : i + 1));
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [autoPlayPaused]);

  const imageSrc = current?.images?.webp
    ? toPublicPath(current.images.webp)
    : toPublicPath(current?.images?.png || "");

  return (
    /*
      flex-1 fills remaining viewport below navbar.
      Padding: top 120px desktop, scaled down for tablet/mobile.
    */
    <div className="flex-1 min-h-screen flex items-center pt-[120px] pb-12 md:pt-[clamp(6rem,15vh,8rem)] md:pb-16">
      <div className="w-full max-w-[1100px] mx-auto px-[clamp(1.5rem,5vw,2.5rem)]">

        {/* Page title */}
        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">02</span>
          Meet your crew
        </h5>

        {/*
          Layout:
            Mobile (<sm):   column — image (top) → dots → text
            Tablet (sm–md): column — text+dots → image
            Desktop (md+):  row    — info (left) | image (right, aligned to bottom)

          The image-wrap uses `order-first` on mobile so it renders above the info
          block even though it appears second in the DOM.
        */}
        <div className="flex flex-col items-center gap-[clamp(2rem,4vw,3rem)] md:flex-row md:justify-between md:gap-[clamp(2rem,4vw,4rem)]">

          {/* Info column: text + dots */}
          <div
            className="w-full max-w-[32rem] text-center flex flex-col items-center gap-8 md:flex-1 md:min-w-0 md:w-[55%] md:max-w-none md:text-left md:items-start md:justify-center md:gap-0"
            onMouseEnter={() => setAutoPlayPaused(true)}
            onMouseLeave={() => setAutoPlayPaused(false)}
          >
            {/* On mobile: dots first (order-1), text second (order-2).
                On tablet+: natural DOM order (text then dots). */}
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="order-2 sm:order-none"
                  variants={TEXT_VARIANTS.container}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {/* Role — 50% opacity */}
                  <motion.h4
                    className="font-serif text-white uppercase opacity-50 text-[clamp(1rem,2vw,2rem)] mb-2"
                    variants={TEXT_VARIANTS.role}
                    transition={{ duration: 0.35 }}
                  >
                    {current.role}
                  </motion.h4>

                  {/* Name */}
                  <motion.h3
                    className="font-serif text-white uppercase text-[clamp(1.5rem,5vw,3.5rem)] leading-[1.15] mb-4"
                    variants={TEXT_VARIANTS.name}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {current.name}
                  </motion.h3>

                  {/* Bio */}
                  <motion.p
                    className="font-sans text-space-accent text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-[1.75] max-w-[45ch] mx-auto md:mx-0"
                    variants={TEXT_VARIANTS.bio}
                    transition={{ duration: 0.35, delay: 0.1 }}
                  >
                    {current.bio}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dots: below bio on desktop (mt applied), swapped above text on mobile via order */}
            <div className="order-1 sm:order-none md:mt-10">
              <CrewDots
                crew={CREW}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          </div>

          {/* Image column — goes first on mobile (order-first), normal on tablet+ */}
          <div
            className="order-first sm:order-none w-full flex justify-center items-end border-b border-white/10 md:flex-none md:w-[45%] md:min-w-0 md:self-end md:border-b-0 h-[300px] md:h-auto"
          >
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="w-full max-w-[192px] sm:max-w-[320px] md:max-w-none flex justify-center items-end h-full"
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
                      /* crew-img-mask fades image to transparent at bottom (defined in index.css) */
                      className="crew-img-mask w-full h-auto max-h-[300px] md:max-h-[90vh] block object-contain object-bottom self-end"
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
