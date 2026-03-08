import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../../data/data.json";
import TechNumbers from "../../components/Technology/TechNumbers";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

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
    /*
      Outer wrapper: flex column, padding top mirrors Crew page.
      On desktop the left padding is wide (no right padding) so the
      portrait image can bleed to the right edge.
    */
    <div className="flex-1 min-h-screen flex flex-col pt-[120px] pb-12 md:pt-[clamp(5rem,12vh,7rem)] md:pb-16">
      <div className="w-full flex-1 flex flex-col pl-[clamp(1.5rem,5vw,2.5rem)] pr-[clamp(1.5rem,5vw,2.5rem)] md:pl-[clamp(1.5rem,8vw,10rem)] lg:pr-0">

        {/* Page title */}
        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">03</span>
          Space launch 101
        </h5>

        {/*
          Layout:
            Mobile / tablet (<lg): column — content first in DOM, image second; flex-col-reverse so image appears on top, then content
            Desktop (lg+):         row    — [numbers | text] left, image strict right
        */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-8 flex-1 lg:gap-[clamp(3rem,5vw,5rem)]">

          {/* Left: Numbers + text content — first in DOM so on lg it appears on the left */}
          <div className="flex flex-col items-center gap-[clamp(1.5rem,3vw,2.5rem)] text-center max-w-[32rem] w-full lg:flex-row lg:items-center lg:text-left lg:gap-[clamp(3rem,4vw,5rem)] lg:max-w-none lg:w-auto lg:flex-none">

            <TechNumbers
              technologyList={TECHNOLOGY}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />

            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="min-w-0 lg:max-w-[28rem]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={textTransition}
                >
                  <p className="font-sans-cond text-space-accent text-[clamp(0.875rem,1.2vw,1rem)] tracking-nav uppercase mb-2">
                    The terminology…
                  </p>
                  <h3 className="font-serif text-white uppercase text-[clamp(1.5rem,4vw,3.5rem)] leading-[1.15] mb-4">
                    {current.name}
                  </h3>
                  <p className="font-sans text-space-accent text-[clamp(0.9375rem,1.1vw,1.125rem)] leading-[1.75] max-w-[45ch] mx-auto lg:mx-0">
                    {current.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Image — second in DOM so on lg it sits on the right; strict right alignment on desktop */}
          <div className="w-full lg:w-auto lg:flex-shrink-0 lg:flex lg:justify-end lg:self-stretch lg:items-center">
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.div
                  key={currentIndex}
                  className="w-full flex justify-center lg:justify-end"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={imageTransition}
                >
                  {/* Landscape — shown on mobile/tablet only */}
                  <img
                    src={landscapeSrc}
                    alt={current.name}
                    className="block lg:hidden w-full h-auto object-cover"
                    loading="eager"
                  />
                  {/* Portrait — shown on desktop only, flush right */}
                  <img
                    src={portraitSrc}
                    alt={current.name}
                    className="hidden lg:block w-full max-w-[515px] h-auto object-cover object-right-center"
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
