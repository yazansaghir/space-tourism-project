import { useState, useMemo } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", end: true, permission: null },
  { to: "/dashboard/destinations", label: "Destinations", end: false, permission: "MANAGE_DESTINATIONS" },
  { to: "/dashboard/crew", label: "Crew", end: false, permission: "MANAGE_CREW" },
  { to: "/dashboard/technology", label: "Technology", end: false, permission: "MANAGE_TECHNOLOGY" },
  { to: "/dashboard/logs", label: "System Logs", end: false, superAdminOnly: true },
  { to: "/dashboard/admins", label: "Admins", end: false, superAdminOnly: true },
  { to: "/dashboard/profile", label: "Profile", end: false, permission: null },
];

function canAccessNavItem(user, item) {
  if (item.permission === null) return true;
  if (item.superAdminOnly) return user?.role === "SUPER_ADMIN";
  return user?.role === "SUPER_ADMIN" || (user?.permissions || []).includes(item.permission);
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = useMemo(
    () => NAV_ITEMS.filter((item) => canAccessNavItem(user, item)),
    [user]
  );

  const handleLogout = async () => {
    await logout();
    navigate("/dashboard/login", { replace: true });
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-space-dark flex">
      {/* Mobile overlay — visible only when sidebar is open on small screens */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Close menu"
        onClick={closeSidebar}
        onKeyDown={(e) => e.key === "Enter" && closeSidebar()}
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar — off-screen on mobile by default, slide in when open; always visible on md+ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 lg:w-64 flex-shrink-0 bg-white/5 backdrop-blur-md border-r border-white/10 transform transition-transform duration-300 ease-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-6 pb-4">
          <div className="px-4 mb-8">
            <h2 className="font-sans-cond uppercase tracking-subheading text-lg text-white">
              <span className="opacity-40 font-bold mr-1">Space</span> Admin
            </h2>
          </div>
          <nav className="flex-1 px-3 space-y-1" onClick={() => setSidebarOpen(false)}>
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block font-sans-cond uppercase tracking-nav text-sm py-3 px-4 rounded-r-md border-l-2 transition-colors ${
                    isActive
                      ? "bg-white/5 text-white border-space-accent"
                      : "border-transparent text-space-accent hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content area — no left padding on mobile; padding on md+ for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 pl-0 md:pl-56 lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex-shrink-0 flex items-center justify-between h-14 lg:h-16 px-4 lg:px-8 border-b border-white/10 bg-space-dark/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
              className="md:hidden flex-shrink-0 p-2 -ml-2 rounded-md text-space-accent hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <p className="font-sans text-space-accent text-sm truncate">
              <span className="text-white/80">Logged in as</span>{" "}
              <span className="text-white font-medium">{user?.username ?? "—"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="font-sans-cond uppercase tracking-nav text-sm text-space-accent hover:text-white transition-colors px-4 py-2 rounded-md hover:bg-white/5 flex-shrink-0"
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
