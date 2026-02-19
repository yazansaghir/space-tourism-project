import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../data/data.json";
import DestinationNav from "../../components/Destination/DestinationNav";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import "./Destination.css";

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
    <div className="destination-page">
      <div className="destination__container">
        <h5 className="destination__page-title">
          <span className="destination__page-number">01</span>
          Pick your destination
        </h5>

        <div className="destination__content">
          <div className="destination__image-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedIndex}
                className="destination__image-inner"
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
                    className="destination__image"
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="destination__info">
            <DestinationNav
              currentTab={selectedIndex}
              setTab={setSelectedIndex}
              destinationsList={DESTINATIONS}
            />

            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={selectedIndex}
                  className="destination__planet-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <h2 className="destination__name">{current.name}</h2>
                  <p className="destination__description">
                    {current.description}
                  </p>
                  <div className="destination__divider" />
                  <div className="destination__stats">
                    <div className="destination__stat">
                      <p className="destination__stat-label">Avg. distance</p>
                      <p className="destination__stat-value">
                        {current.distance}
                      </p>
                    </div>
                    <div className="destination__stat">
                      <p className="destination__stat-label">Est. travel time</p>
                      <p className="destination__stat-value">
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
