import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../utils/api";
import CrewDots from "../../components/Crew/CrewDots";
import BlurUpImage from "../../components/ui/BlurUpImage";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

function extractList(res) {
  const d = res?.data;
  if (!d) return [];
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d)) return d;
  return d.crew ?? [];
}

function toPublicPath(path) {
  if (!path) return "";
  return path.startsWith("./") ? path.replace("./", "/") : path;
}

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

const CREW_IMAGE_HEIGHT = "h-[300px] md:h-[420px]";

function PageLoader() {
  return (
    <div className="flex-1 min-h-screen flex items-center pt-[120px] pb-12 md:pt-[clamp(6rem,15vh,8rem)] md:pb-16">
      <div className="w-full max-w-[1100px] mx-auto px-[clamp(1.5rem,5vw,2.5rem)]">
        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">02</span>
          Meet your crew
        </h5>
        <div className="flex flex-col items-center gap-[clamp(2rem,4vw,3rem)] md:flex-row md:justify-between md:gap-[clamp(2rem,4vw,4rem)]">
          <div className="w-full max-w-[32rem] text-center flex flex-col items-center gap-8 md:flex-1 md:min-w-0 md:w-[55%] md:max-w-none md:text-left md:items-start md:justify-start min-h-[320px] md:min-h-[380px] md:gap-0">
            <div className="order-2 sm:order-none space-y-4 w-full max-w-[45ch] mx-auto md:mx-0 min-h-[250px] md:min-h-[300px] flex flex-col justify-start">
              <div className="h-5 w-24 bg-white/10 rounded" />
              <div className="h-10 w-48 bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-[80%] bg-white/10 rounded" />
            </div>
            <div className="order-1 sm:order-none mt-auto flex gap-6 flex-shrink-0" aria-hidden>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[10px] h-[10px] md:w-[15px] md:h-[15px] rounded-full bg-white/10" />
              ))}
            </div>
          </div>
          <div className={`order-first sm:order-none w-full flex justify-center items-end border-b border-white/10 md:flex-none md:w-[45%] md:min-w-0 md:self-end md:border-b-0 ${CREW_IMAGE_HEIGHT}`}>
            <div className="w-full max-w-[192px] sm:max-w-[320px] md:max-w-none h-full bg-white/10 rounded-lg" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
}

function PageError({ message }) {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center pt-[120px] pb-12">
      <div className="text-center max-w-md">
        <p className="font-sans text-red-400">{message}</p>
      </div>
    </div>
  );
}

function PageEmpty({ message }) {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center pt-[120px] pb-12">
      <p className="font-sans text-space-accent/80 text-center">{message}</p>
    </div>
  );
}

export default function Crew() {
  useDocumentTitle("Crew");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api
      .get("/crew")
      .then((res) => {
        if (cancelled) return;
        const list = extractList(res);
        setData(list);
        setCurrentIndex(0);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to load crew.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft")
        setCurrentIndex((i) => (i <= 0 ? data.length - 1 : i - 1));
      if (e.key === "ArrowRight")
        setCurrentIndex((i) => (i >= data.length - 1 ? 0 : i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [data.length]);

  useEffect(() => {
    if (autoPlayPaused || data.length === 0) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => (i >= data.length - 1 ? 0 : i + 1));
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [autoPlayPaused, data.length]);

  const current = data[currentIndex];
  const imageSrc = current?.images?.webp
    ? toPublicPath(current.images.webp)
    : toPublicPath(current?.images?.png || "");

  if (isLoading) return <PageLoader />;
  if (error) return <PageError message={error} />;
  if (!data.length) return <PageEmpty message="No crew available at the moment." />;

  return (
    <div className="flex-1 min-h-screen flex items-center pt-[120px] pb-12 md:pt-[clamp(6rem,15vh,8rem)] md:pb-16">
      <div className="w-full max-w-[1100px] mx-auto px-[clamp(1.5rem,5vw,2.5rem)]">

        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">02</span>
          Meet your crew
        </h5>

        <div className="flex flex-col items-center gap-[clamp(2rem,4vw,3rem)] md:flex-row md:justify-between md:gap-[clamp(2rem,4vw,4rem)]">
          <div
            className="w-full max-w-[32rem] text-center flex flex-col items-center gap-8 md:flex-1 md:min-w-0 md:w-[55%] md:max-w-none md:text-left md:items-start md:justify-start md:gap-0 min-h-[320px] md:min-h-[380px]"
            onMouseEnter={() => setAutoPlayPaused(true)}
            onMouseLeave={() => setAutoPlayPaused(false)}
          >
            <div className="order-2 sm:order-none min-h-[250px] md:min-h-[300px] flex flex-col justify-start w-full max-w-[45ch] mx-auto md:mx-0">
              <AnimatePresence mode="wait" initial={false}>
                {current && (
                  <motion.div
                    key={currentIndex}
                    className="flex flex-col"
                    variants={TEXT_VARIANTS.container}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <motion.h4
                      className="font-serif text-white uppercase opacity-50 text-[clamp(1rem,2vw,2rem)] mb-2"
                      variants={TEXT_VARIANTS.role}
                      transition={{ duration: 0.35 }}
                    >
                      {current.role}
                    </motion.h4>

                    <motion.h3
                      className="font-serif text-white uppercase text-[clamp(1.5rem,5vw,3.5rem)] leading-[1.15] mb-4"
                      variants={TEXT_VARIANTS.name}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      {current.name}
                    </motion.h3>

                    <motion.p
                      className="font-sans text-space-accent text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-[1.75] max-w-[45ch] mx-auto md:mx-0 min-h-[120px]"
                      variants={TEXT_VARIANTS.bio}
                      transition={{ duration: 0.35, delay: 0.1 }}
                    >
                      {current.bio}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="order-1 sm:order-none mt-auto flex-shrink-0">
              <CrewDots
                crew={data}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          </div>

          <div className={`order-first sm:order-none w-full flex justify-center items-end border-b border-white/10 md:flex-none md:w-[45%] md:min-w-0 md:self-end md:border-b-0 ${CREW_IMAGE_HEIGHT}`}>
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="w-full max-w-[192px] sm:max-w-[320px] md:max-w-none h-full flex justify-center items-end"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={IMAGE_TRANSITION}
                >
                  <picture className="w-full h-full flex justify-center items-end">
                    {current.images?.webp && (
                      <source
                        srcSet={toPublicPath(current.images.webp)}
                        type="image/webp"
                      />
                    )}
                    <BlurUpImage
                      src={imageSrc}
                      alt={current.name}
                      className="crew-img-mask w-full h-full max-h-[300px] md:max-h-[420px] block object-contain object-bottom"
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
