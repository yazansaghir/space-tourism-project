import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navigation/Navbar";
import Sidebar from "../components/Navigation/Sidebar";
import "./Layout.css";

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeInOut" },
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleMenuToggle = () => {
    setIsSidebarOpen(true);
  };

  const handleMenuClose = () => {
    setIsSidebarOpen(false);
  };

  const getPageClass = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname === "/destination") return "destination";
    if (location.pathname === "/crew") return "crew";
    if (location.pathname === "/technology") return "technology";
    return "";
  };

  return (
    <div className={`wrap ${getPageClass()}`}>
      <div className="wrap__content">
        <Navbar onMenuToggle={handleMenuToggle} />
        <main className="layout__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              {...pageTransition}
              className="layout__page"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar key="sidebar" isOpen={isSidebarOpen} onClose={handleMenuClose} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
