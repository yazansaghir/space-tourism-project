import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./Sidebar.css";

const panelTransition = {
  type: "spring",
  stiffness: 200,
  damping: 28,
};

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
    <motion.div
      className="sidebar-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="sidebar-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        id="nav"
        className="nav-mobile"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={panelTransition}
      >
        <div className="nav-mobile__icon">
          <img
            onClick={onClose}
            src="/assets/shared/icon-close.svg"
            alt="Close"
            className="navbar__icon"
          />
        </div>
        <div className="nav-mobile__link">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-mobile__wrap nav-mobile__wrap_active" : "nav-mobile__wrap"
            }
            onClick={onClose}
          >
            <p className="nav-text--bold nav-text navbar__text--number">00</p>
            <p className="nav-text">Home</p>
          </NavLink>
          <NavLink
            to="/destination"
            className={({ isActive }) =>
              isActive ? "nav-mobile__wrap nav-mobile__wrap_active" : "nav-mobile__wrap"
            }
            onClick={onClose}
          >
            <p className="nav-text--bold nav-text navbar__text--number">01</p>
            <p className="nav-text">Destination</p>
          </NavLink>
          <NavLink
            to="/crew"
            className={({ isActive }) =>
              isActive ? "nav-mobile__wrap nav-mobile__wrap_active" : "nav-mobile__wrap"
            }
            onClick={onClose}
          >
            <p className="nav-text--bold nav-text navbar__text--number">02</p>
            <p className="nav-text">Crew</p>
          </NavLink>
          <NavLink
            to="/technology"
            className={({ isActive }) =>
              isActive ? "nav-mobile__wrap nav-mobile__wrap_active" : "nav-mobile__wrap"
            }
            onClick={onClose}
          >
            <p className="nav-text--bold nav-text navbar__text--number">03</p>
            <p className="nav-text">Technology</p>
          </NavLink>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
