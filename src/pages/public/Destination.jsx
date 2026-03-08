import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../utils/api";
import DestinationNav from "../../components/Destination/DestinationNav";
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
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-8">
      <div className="flex flex-col items-center gap-6">
        <div
          className="w-12 h-12 rounded-full border-2 border-space-accent/30 border-t-space-accent animate-spin"
          aria-hidden="true"
        />
        <p className="font-sans text-space-accent/80 text-sm">Loading destinations…</p>
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
                  className="overflow-hidden"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <h2 className="font-serif text-white uppercase text-[clamp(3.5rem,10vw,6.25rem)] leading-[1.15] mb-[clamp(0.75rem,1.5vw,1rem)]">
                    {current.name}
                  </h2>

                  <p className="font-sans text-space-accent text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-[1.78] mb-[clamp(1.5rem,3vw,2.5rem)]">
                    {current.description}
                  </p>

                  <div className="h-px bg-white/25 mb-[clamp(1.5rem,2vw,2rem)]" />

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
                        {current.travel ?? current.travelTime}
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
