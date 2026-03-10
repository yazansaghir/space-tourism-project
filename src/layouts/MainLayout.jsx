import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navigation/Navbar";
import Sidebar from "../components/Navigation/Sidebar";

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

/* Map route → responsive Tailwind bg-image classes.
   Breakpoints: sm = 600px (tablet), md = 900px (desktop). */
const PAGE_BG = {
  "/": "bg-home-mobile sm:bg-home-tablet md:bg-home-desktop",
  "/destination":
    "bg-destination-mobile sm:bg-destination-tablet md:bg-destination-desktop",
  "/crew": "bg-crew-mobile sm:bg-crew-tablet md:bg-crew-desktop",
  "/technology":
    "bg-technology-mobile sm:bg-technology-tablet md:bg-technology-desktop",
};

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const bgClass = PAGE_BG[location.pathname] ?? "";

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Breathing background layer — scale animation only on bg */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-fixed ${bgClass} animate-bg-breathe origin-center`}
        aria-hidden="true"
      />
      {/* Content column: navbar + animated page outlet */}
      <div className="relative flex-1 flex flex-col z-10">
        <Navbar onMenuToggle={() => setIsSidebarOpen(true)} />
        <main className="flex-1 relative z-0 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              {...pageTransition}
              className="flex-1 flex flex-col min-h-0"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar
            key="sidebar"
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
