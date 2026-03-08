import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../data/data.json";
import DestinationNav from "../../components/Destination/DestinationNav";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const DESTINATIONS = data.destinations;

function toPublicPath(path) {
  if (!path) return "";
  return path.startsWith("./") ? path.replace("./", "/") : path;
}

function preloadImage(src) {
  const img = new Image();
  img.src = src;
}

export default function Destination() {
  useDocumentTitle("Destination");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = DESTINATIONS[selectedIndex];

  useEffect(() => {
    DESTINATIONS.forEach((dest) => {
      const webp = dest.images?.webp;
      const png = dest.images?.png;
      if (webp) preloadImage(toPublicPath(webp));
      if (png) preloadImage(toPublicPath(png));
    });
  }, []);

  const imageSrc = useMemo(() => {
    if (!current?.images) return "";
    const webp = current.images.webp;
    const png = current.images.png;
    return toPublicPath(webp || png || "");
  }, [current]);

  return (
    /* flex-1 fills the remaining viewport height below the navbar */
    <div className="flex-1 flex items-center justify-center p-[clamp(1.5rem,5vw,3rem)] min-h-0">
      <div className="w-full max-w-[1100px] mx-auto">

        {/* Page title */}
        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">01</span>
          Pick your destination
        </h5>

        {/*
          Mobile / tablet: single column, centred
          Desktop (md = 900px+): two columns — planet image left, info right
        */}
        <div className="flex flex-col items-center gap-[clamp(2rem,4vw,3rem)] md:grid md:grid-cols-2 md:items-center md:gap-[clamp(2rem,4vw,4rem)]">

          {/* Planet image */}
          <div className="relative w-full flex justify-center items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedIndex}
                className="w-full max-w-[175px] sm:max-w-[clamp(12rem,22vw,18.75rem)] md:max-w-[clamp(18rem,28vw,25rem)] flex justify-center items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <picture>
                  {current?.images?.webp && (
                    <source
                      srcSet={toPublicPath(current.images.webp)}
                      type="image/webp"
                    />
                  )}
                  <img
                    src={imageSrc}
                    alt={current?.name ?? ""}
                    className="w-full h-auto block animate-spin-slow"
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Info panel */}
          <div className="w-full max-w-[445px] text-center md:max-w-none md:text-left">
            <DestinationNav
              currentTab={selectedIndex}
              setTab={setSelectedIndex}
              destinationsList={DESTINATIONS}
            />

            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={selectedIndex}
                  className="overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {/* Planet name */}
                  <h2 className="font-serif text-white uppercase text-[clamp(3.5rem,10vw,6.25rem)] leading-[1.15] mb-[clamp(0.75rem,1.5vw,1rem)]">
                    {current.name}
                  </h2>

                  {/* Description */}
                  <p className="font-sans text-space-accent text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-[1.78] mb-[clamp(1.5rem,3vw,2.5rem)]">
                    {current.description}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-white/25 mb-[clamp(1.5rem,2vw,2rem)]" />

                  {/* Stats: Avg. distance + Est. travel time */}
                  <div className="flex flex-col items-center gap-[clamp(1.5rem,2vw,2rem)] sm:flex-row sm:gap-[clamp(2rem,3vw,3rem)] md:justify-start md:items-start md:gap-[clamp(3rem,4vw,5rem)]">
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
                        {current.travel}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
