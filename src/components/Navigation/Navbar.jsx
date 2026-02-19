import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onMenuToggle }) => {
  return (
    <nav className="navbar">
      <img src="/assets/shared/logo.svg" alt="Logo" />
      <div className="navbar__line"></div>
      <div className="navbar__text">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "navbar__text--wrap navbar__text--wrap_active"
              : "navbar__text--wrap"
          }
        >
          <p className="nav-text--bold nav-text navbar__text--number">00</p>
          <p className="nav-text">Home</p>
        </NavLink>
        <NavLink
          to="/destination"
          className={({ isActive }) =>
            isActive
              ? "navbar__text--wrap navbar__text--wrap_active"
              : "navbar__text--wrap"
          }
        >
          <p className="nav-text--bold nav-text navbar__text--number">01</p>
          <p className="nav-text">Destination</p>
        </NavLink>
        <NavLink
          to="/crew"
          className={({ isActive }) =>
            isActive
              ? "navbar__text--wrap navbar__text--wrap_active"
              : "navbar__text--wrap"
          }
        >
          <p className="nav-text--bold nav-text navbar__text--number">02</p>
          <p className="nav-text">Crew</p>
        </NavLink>
        <NavLink
          to="/technology"
          className={({ isActive }) =>
            isActive
              ? "navbar__text--wrap navbar__text--wrap_active"
              : "navbar__text--wrap"
          }
        >
          <p className="nav-text--bold nav-text navbar__text--number">03</p>
          <p className="nav-text">Technology</p>
        </NavLink>
      </div>
      <img
        onClick={onMenuToggle}
        src="/assets/shared/icon-hamburger.svg"
        alt="Menu"
        className="navbar__icon"
      />
    </nav>
  );
};

export default Navbar;
