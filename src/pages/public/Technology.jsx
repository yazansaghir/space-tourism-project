import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../utils/api";
import TechNumbers from "../../components/Technology/TechNumbers";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

function extractList(res) {
  const d = res?.data;
  if (!d) return [];
  if (Array.isArray(d.data)) return d.data;
  if (Array.isArray(d)) return d;
  return d.technology ?? [];
}

function toPublicPath(path) {
  if (!path) return "";
  return path.startsWith("./") ? path.replace("./", "/") : path;
}

const textTransition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };
const imageTransition = { duration: 0.35, ease: "easeOut" };

function PageLoader() {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center pt-[120px] pb-12 md:pt-[clamp(5rem,12vh,7rem)]">
      <div className="flex flex-col items-center gap-6">
        <div
          className="w-12 h-12 rounded-full border-2 border-space-accent/30 border-t-space-accent animate-spin"
          aria-hidden="true"
        />
        <p className="font-sans text-space-accent/80 text-sm">Loading technology…</p>
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

export default function Technology() {
  useDocumentTitle("Technology");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api
      .get("/technology")
      .then((res) => {
        if (cancelled) return;
        const list = extractList(res);
        setData(list);
        setCurrentIndex(0);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? "Failed to load technology.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const current = data[currentIndex];
  const portraitSrc = current?.images?.portrait
    ? toPublicPath(current.images.portrait)
    : "";
  const landscapeSrc = current?.images?.landscape
    ? toPublicPath(current.images.landscape)
    : "";

  if (isLoading) return <PageLoader />;
  if (error) return <PageError message={error} />;
  if (!data.length) return <PageEmpty message="No technology available at the moment." />;

  return (
    <div className="flex-1 min-h-screen flex flex-col pt-[120px] pb-12 md:pt-[clamp(5rem,12vh,7rem)] md:pb-16">
      <div className="w-full flex-1 flex flex-col pl-[clamp(1.5rem,5vw,2.5rem)] pr-[clamp(1.5rem,5vw,2.5rem)] md:pl-[clamp(1.5rem,8vw,10rem)] lg:pr-0">

        <h5 className="font-sans-cond font-normal text-white uppercase tracking-subheading text-[clamp(1rem,2.5vw,1.75rem)] mb-[clamp(2rem,4vw,3rem)] text-center md:text-left">
          <span className="opacity-25 font-bold mr-4">03</span>
          Space launch 101
        </h5>

        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-8 flex-1 lg:gap-[clamp(3rem,5vw,5rem)]">

          <div className="flex flex-col items-center gap-[clamp(1.5rem,3vw,2.5rem)] text-center max-w-[32rem] w-full lg:flex-row lg:items-center lg:text-left lg:gap-[clamp(3rem,4vw,5rem)] lg:max-w-none lg:w-auto lg:flex-none">

            <TechNumbers
              technologyList={data}
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
                  <img
                    src={landscapeSrc}
                    alt={current.name}
                    className="block lg:hidden w-full h-auto object-cover"
                    loading="eager"
                  />
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
