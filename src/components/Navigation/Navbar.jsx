import { NavLink } from "react-router-dom";

/* Nav link text + number row.
   Numbers: visible on mobile (<sm) and wide desktop (lg+), hidden on tablet (sm–lg). */
const NAV_LINKS = [
  { to: "/", number: "00", label: "Home" },
  { to: "/destination", number: "01", label: "Destination" },
  { to: "/crew", number: "02", label: "Crew" },
  { to: "/technology", number: "03", label: "Technology" },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-[11px] pb-[35px] border-b-[3px] transition-colors duration-[250ms] ` +
  (isActive ? "border-white" : "border-transparent hover:border-white/50");

const Navbar = ({ onMenuToggle }) => {
  return (
    /*
      Padding cascade (mobile-first):
        mobile (<600px):  p-6
        tablet (600px+):  pt-0 pb-10 pl-[39px]
        wide (1100px+):   pt-10 pb-0 pl-[55px]
    */
    <nav className="flex justify-between items-center relative p-6 sm:pt-0 sm:pb-10 sm:pl-[39px] sm:pr-0 lg:pt-10 lg:pb-0 lg:pl-[55px]">
      <img src="/assets/shared/logo.svg" alt="Space Tourism Logo" className="flex-shrink-0" />

      {/* Decorative horizontal rule — desktop only (lg+) */}
      <div className="hidden lg:block lg:z-10 lg:h-px lg:w-full lg:bg-white lg:opacity-25 lg:mx-[-25px] lg:ml-16 lg:mr-[-25px]" />

      {/* Desktop / Tablet nav links — hidden on mobile, shown sm+ */}
      <div className="hidden sm:flex sm:items-center sm:gap-[50px] sm:bg-white/[0.04] sm:backdrop-blur-[81px] sm:pt-[38px] sm:pb-0 sm:px-[47px] lg:pl-[123px] lg:pr-[165px]">
        {NAV_LINKS.map(({ to, number, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            {/* Number: hidden on tablet (sm–lg), visible on mobile + wide desktop */}
            <span className="font-bold font-sans-cond text-white text-[14px] md:text-[16px] tracking-nav uppercase sm:hidden lg:block">
              {number}
            </span>
            <span className="font-sans-cond text-white text-[14px] md:text-[16px] tracking-[2.36px] md:tracking-nav uppercase">
              {label}
            </span>
          </NavLink>
        ))}
      </div>

      {/* Hamburger — mobile only (hidden sm+) */}
      <img
        onClick={onMenuToggle}
        src="/assets/shared/icon-hamburger.svg"
        alt="Open menu"
        className="block sm:hidden cursor-pointer"
      />
    </nav>
  );
};

export default Navbar;
