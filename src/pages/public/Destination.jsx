import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../utils/api";
import DestinationNav from "../../components/Destination/DestinationNav";
import BlurUpImage from "../../components/ui/BlurUpImage";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

function toPublicPath(path) {
  if (!path) return "";
  return path.startsWith("./") ? path.replace("./", "/") : path;
}

function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

function extractList(res) {
  const d = res?.data;
  if (!d) return [];
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d)) return d;
  return d.destinations ?? [];
}

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center p-[clamp(1.5rem,5vw,3rem)] min-h-0">
      <div className="w-full max-w-[1100px] mx-auto">
        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">01</span>
          Pick your destination
        </h5>
        <div className="flex flex-col items-center gap-[clamp(2rem,4vw,3rem)] md:grid md:grid-cols-2 md:items-center md:gap-[clamp(2rem,4vw,4rem)]">
          <div className="relative w-full flex justify-center items-center h-[250px] md:h-[400px] lg:h-[450px]">
            <div className="aspect-square w-full max-w-[175px] sm:max-w-[clamp(12rem,22vw,18.75rem)] md:max-w-[clamp(18rem,28vw,25rem)] h-full max-h-[250px] md:max-h-[400px] lg:max-h-[450px] rounded-full bg-white/10" aria-hidden />
          </div>
          <div className="w-full max-w-[445px] text-center md:max-w-none md:text-left">
            <nav className="flex flex-wrap justify-center gap-[clamp(1rem,2vw,1.5rem)] mb-[clamp(1rem,2.5vw,1.5rem)] md:justify-start md:gap-[clamp(1.25rem,1.5vw,2rem)] md:mb-[clamp(1.5rem,2.5vw,2rem)]" aria-hidden>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-14 bg-white/10 rounded" />
              ))}
            </nav>
            <div className="h-[clamp(3.5rem,10vw,6.25rem)] w-3/4 max-w-[280px] mx-auto md:mx-0 bg-white/10 rounded mb-[clamp(0.75rem,1.5vw,1rem)]" />
            <div className="min-h-[120px] space-y-2 mb-[clamp(1.5rem,3vw,2.5rem)]">
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-full bg-white/10 rounded" />
              <div className="h-4 w-2/3 bg-white/10 rounded" />
            </div>
            <div className="h-px bg-white/25 mb-[clamp(1.5rem,2vw,2rem)]" />
            <div className="flex flex-col items-center gap-[clamp(1.5rem,2vw,2rem)] sm:flex-row sm:gap-[clamp(2rem,3vw,3rem)] md:justify-start md:items-start md:gap-[clamp(3rem,4vw,5rem)]">
              <div className="h-12 w-24 bg-white/10 rounded" />
              <div className="h-12 w-24 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageError({ message }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-md">
        <p className="font-sans text-red-400">{message}</p>
      </div>
    </div>
  );
}

function PageEmpty({ message }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-8">
      <p className="font-sans text-space-accent/80 text-center">{message}</p>
    </div>
  );
}

export default function Destination() {
  useDocumentTitle("Destination");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api
      .get("/destinations")
      .then((res) => {
        if (cancelled) return;
        const list = extractList(res);
        setData(list);
        setSelectedIndex(0);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to load destinations.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    data.forEach((dest) => {
      const webp = dest.images?.webp;
      const png = dest.images?.png;
      if (webp) preloadImage(toPublicPath(webp));
      if (png) preloadImage(toPublicPath(png));
    });
  }, [data]);

  const current = data[selectedIndex];
  const imageSrc = useMemo(() => {
    if (!current?.images) return "";
    const webp = current.images.webp;
    const png = current.images.png;
    return toPublicPath(webp || png || "");
  }, [current]);

  if (isLoading) return <PageLoader />;
  if (error) return <PageError message={error} />;
  if (!data.length) return <PageEmpty message="No destinations available at the moment." />;

  return (
    <div className="flex-1 flex items-center justify-center p-[clamp(1.5rem,5vw,3rem)] min-h-0">
      <div className="w-full max-w-[1100px] mx-auto">

        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">01</span>
          Pick your destination
        </h5>

        <div className="flex flex-col items-center gap-[clamp(2rem,4vw,3rem)] md:grid md:grid-cols-2 md:items-center md:gap-[clamp(2rem,4vw,4rem)]">
          {/* Image column — only image animates */}
          <div className="relative w-full flex justify-center items-center h-[250px] md:h-[400px] lg:h-[450px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedIndex}
                className="absolute inset-0 flex justify-center items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <picture className="w-full h-full flex justify-center items-center">
                  {current?.images?.webp && (
                    <source
                      srcSet={toPublicPath(current.images.webp)}
                      type="image/webp"
                    />
                  )}
                  <BlurUpImage
                    src={imageSrc}
                    alt={current?.name ?? ""}
                    className="w-full h-full max-w-[175px] sm:max-w-[clamp(12rem,22vw,18.75rem)] md:max-w-[clamp(18rem,28vw,25rem)] max-h-[250px] md:max-h-[400px] lg:max-h-[450px] aspect-square object-contain block animate-spin-slow"
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text column — tabs static, only content animates */}
          <div className="w-full max-w-[445px] text-center md:max-w-none md:text-left">
            <DestinationNav
              currentTab={selectedIndex}
              setTab={setSelectedIndex}
              destinationsList={data}
            />

            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  variants={{
                    container: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
                  }}
                  initial="initial"
                  animate="animate"
                >
                  <motion.h2
                    className="font-serif text-white uppercase text-[clamp(3.5rem,10vw,6.25rem)] leading-[1.15] mb-[clamp(0.75rem,1.5vw,1rem)]"
                    variants={{ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.3 }}
                  >
                    {current.name}
                  </motion.h2>

                  <motion.p
                    className="font-sans text-space-accent text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-[1.78] mb-[clamp(1.5rem,3vw,2.5rem)] min-h-[120px]"
                    variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    {current.description}
                  </motion.p>

                  <div className="h-px bg-white/25 mb-[clamp(1.5rem,2vw,2rem)]" />

                  <motion.div
                    className="flex flex-col items-center gap-[clamp(1.5rem,2vw,2rem)] sm:flex-row sm:gap-[clamp(2rem,3vw,3rem)] md:justify-start md:items-start md:gap-[clamp(3rem,4vw,5rem)]"
                    variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div>
                      <p className="font-sans-cond text-space-accent text-[0.875rem] tracking-[0.146875rem] uppercase mb-2">
                        Avg. distance
                      </p>
                      <p className="font-serif text-white uppercase text-[clamp(1.5rem,2vw,1.75rem)]">
                        {current.distance}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans-cond text-space-accent text-[0.875rem] tracking-[0.146875rem] uppercase mb-2">
                        Est. travel time
                      </p>
                      <p className="font-serif text-white uppercase text-[clamp(1.5rem,2vw,1.75rem)]">
                        {current.travel ?? current.travelTime}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
