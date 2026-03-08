import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const panelTransition = {
  type: "spring",
  stiffness: 200,
  damping: 28,
};

const NAV_LINKS = [
  { to: "/", number: "00", label: "Home" },
  { to: "/destination", number: "01", label: "Destination" },
  { to: "/crew", number: "02", label: "Crew" },
  { to: "/technology", number: "03", label: "Technology" },
];

const mobileLinkClass = ({ isActive }) =>
  `flex gap-[10px] items-center ` +
  (isActive ? "text-white" : "text-space-accent");

const Sidebar = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Wrapper: fixed full-screen, pointer-events none so backdrop click works */
    <motion.div
      className="fixed inset-0 z-[1000] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <motion.div
        className="pointer-events-auto absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <motion.div
        id="nav"
        className="pointer-events-auto absolute top-0 right-0 h-full w-[65%] z-10 overflow-x-hidden p-[34px] bg-white/[0.04] backdrop-blur-[81px]"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={panelTransition}
      >
        {/* Close button */}
        <div className="float-right">
          <img
            onClick={onClose}
            src="/assets/shared/icon-close.svg"
            alt="Close menu"
            className="cursor-pointer"
          />
        </div>

        {/* Nav links — only rendered/visible on mobile */}
        <nav className="flex flex-col gap-8 mt-[65px]">
          {NAV_LINKS.map(({ to, number, label }) => (
            <NavLink
              key={to}
              to={to}
              className={mobileLinkClass}
              onClick={onClose}
            >
              <span className="font-bold font-sans-cond text-white text-[16px] tracking-nav uppercase">
                {number}
              </span>
              <span className="font-sans-cond text-[16px] tracking-nav uppercase">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
