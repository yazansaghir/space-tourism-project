import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../data/data.json";
import TechNumbers from "../../components/Technology/TechNumbers";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import "./Technology.css";

const TECHNOLOGY = data.technology;

function toPublicPath(path) {
  if (!path) return "";
  return path.startsWith("./") ? path.replace("./", "/") : path;
}

const textTransition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };
const imageTransition = { duration: 0.35, ease: "easeOut" };

export default function Technology() {
  useDocumentTitle("Technology");
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = TECHNOLOGY[currentIndex];

  const portraitSrc = current?.images?.portrait
    ? toPublicPath(current.images.portrait)
    : "";
  const landscapeSrc = current?.images?.landscape
    ? toPublicPath(current.images.landscape)
    : "";

  return (
    <div className="technology-page">
      <div className="technology__container">
        <h5 className="technology__page-title">
          <span className="technology__page-number">03</span>
          Space launch 101
        </h5>

        <div className="technology__content">
          <div className="technology__info">
            <TechNumbers
              technologyList={TECHNOLOGY}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />

            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="technology__text"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={textTransition}
                >
                  <p className="technology__label">
                    The terminology…
                  </p>
                  <h3 className="technology__name">{current.name}</h3>
                  <p className="technology__description">
                    {current.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="technology__image-wrap">
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="technology__image-inner"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={imageTransition}
                >
                  <img
                    src={portraitSrc}
                    alt={current.name}
                    className="technology__image technology__image--portrait"
                    loading="eager"
                  />
                  <img
                    src={landscapeSrc}
                    alt={current.name}
                    className="technology__image technology__image--landscape"
                    loading="eager"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
