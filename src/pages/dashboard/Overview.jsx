import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../utils/api";

function getCount(res) {
  const data = res?.data;
  if (!data) return 0;
  if (typeof data?.meta?.total === "number") return data.meta.total;
  const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.destinations ?? data?.crew ?? data?.technology ?? [];
  return Array.isArray(arr) ? arr.length : 0;
}

function getLogsList(res) {
  const data = res?.data;
  if (!data) return [];
  const arr = Array.isArray(data?.data) ? data.data : data?.logs ?? [];
  return Array.isArray(arr) ? arr.slice(0, 5) : [];
}

function formatLogDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleString();
}

function extractEntity(details) {
  const s = (details ?? "").toLowerCase();
  if (s.includes("destination")) return "Destination";
  if (s.includes("crew")) return "Crew";
  if (s.includes("technology")) return "Technology";
  if (s.includes("admin")) return "Admin";
  return "—";
}

function getGreetingSubtext() {
  const hour = new Date().getHours();
  if (hour < 12) return "Rise and shine. Your mission dashboard is ready.";
  if (hour < 18) return "Good afternoon. All systems operational.";
  return "Good evening. Review today's operations.";
}

function getRoleSubtitle(role) {
  const r = (role ?? "").toUpperCase();
  if (r === "SUPER_ADMIN") return "Super Admin";
  if (r) return role;
  return "Dashboard";
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 animate-pulse">
      <div className="h-4 w-24 bg-white/10 rounded mb-4" />
      <div className="h-12 w-20 bg-white/10 rounded" />
    </div>
  );
}

function WelcomeSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 lg:p-8 animate-pulse">
      <div className="h-8 w-64 bg-white/10 rounded mb-2" />
      <div className="h-4 w-48 bg-white/10 rounded" />
    </div>
  );
}

function LogListSkeleton() {
  return (
    <div className="divide-y divide-white/5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 px-4 lg:px-6 py-3">
          <div className="h-4 w-16 bg-white/10 rounded flex-shrink-0 animate-pulse" />
          <div className="h-4 flex-1 min-w-0 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-24 bg-white/10 rounded flex-shrink-0 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function LockedStatCard({ label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 relative overflow-hidden opacity-75">
      <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/60 mb-4 relative z-10">{label}</p>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pt-8 bg-[#0B0D17]/40"
        style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.02) 8px, rgba(255,255,255,0.02) 16px)" }}
      >
        <span className="text-2xl mb-2 select-none" aria-hidden="true">🔒</span>
        <p className="font-sans text-xs text-space-accent/70 uppercase tracking-nav">Restricted Access</p>
      </div>
    </div>
  );
}

const cardBaseClass =
  "bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5";

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className={cardBaseClass}>
      {Icon && (
        <div className="absolute right-4 top-4 w-16 h-16 opacity-[0.08]" aria-hidden>
          <Icon />
        </div>
      )}
      <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/80 mb-2 relative z-10">
        {label}
      </p>
      <p className="text-5xl font-serif font-light text-white mb-0 relative z-10">
        {value}
      </p>
    </div>
  );
}

function IconPlanet() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="32" cy="32" r="20" />
      <ellipse cx="32" cy="32" rx="24" ry="8" />
      <path d="M8 32h48M32 8v48" />
    </svg>
  );
}

function IconCrew() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="32" cy="20" r="10" />
      <path d="M12 56c0-11 8.954-20 20-20s20 9 20 20" />
      <path d="M32 36v-4M28 32l4-4 4 4" />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M32 8l-8 24h16L32 8z" />
      <path d="M32 32v24M24 56h16" />
      <path d="M20 32l-8 8 8 4 4-4M44 32l8 8-8 4-4-4" />
      <circle cx="32" cy="32" r="4" />
    </svg>
  );
}

export default function Overview() {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    destinations: 0,
    crew: 0,
    technology: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canAccess = (permission) => user?.role === "SUPER_ADMIN" || (user?.permissions || []).includes(permission);

  const canDestinations = canAccess("MANAGE_DESTINATIONS");
  const canCrew = canAccess("MANAGE_CREW");
  const canTechnology = canAccess("MANAGE_TECHNOLOGY");

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = [];
      const keys = [];

      if (canDestinations) {
        promises.push(api.get("/destinations/all"));
        keys.push("destinations");
      }
      if (canCrew) {
        promises.push(api.get("/crew/all"));
        keys.push("crew");
      }
      if (canTechnology) {
        promises.push(api.get("/technology/all"));
        keys.push("technology");
      }
      if (isSuperAdmin) {
        promises.push(api.get("/logs?limit=5"));
        keys.push("logs");
      }

      const results = promises.length > 0 ? await Promise.all(promises) : [];
      const nextStats = { destinations: 0, crew: 0, technology: 0 };
      keys.forEach((key, i) => {
        if (key === "logs") {
          setRecentLogs(getLogsList(results[i]));
        } else {
          nextStats[key] = getCount(results[i]);
        }
      });
      setStats(nextStats);
    } catch (err) {
      setError(err?.message ?? "Failed to load overview");
      setStats({ destinations: 0, crew: 0, technology: 0 });
      setRecentLogs([]);
    } finally {
      setLoading(false);
    }
  }, [canDestinations, canCrew, canTechnology, isSuperAdmin]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="border border-white/10 bg-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-white/30 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="font-sans text-white/70 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchOverview}
            className="border border-white/20 hover:bg-white/10 text-white rounded-lg px-4 py-2 mt-4 transition-all font-sans text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Mission Control Greeting */}
      <section className="mb-8 lg:mb-10">
        {loading ? (
          <WelcomeSkeleton />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 lg:p-8 shadow-lg">
            <h1 className="font-sans-cond uppercase tracking-subheading text-2xl lg:text-3xl text-white">
              Welcome to Mission Control
            </h1>
            <p className="font-sans text-space-accent/90 text-sm mt-2">
              {getGreetingSubtext()}
            </p>
            <p className="font-sans text-space-accent/60 text-xs mt-1">
              {user?.username && (
                <>
                  Signed in as <span className="text-white/80 font-medium">{user.username}</span>
                  {user?.role && (
                    <span className="ml-1">· {getRoleSubtitle(user.role)}</span>
                  )}
                </>
              )}
            </p>
          </div>
        )}
      </section>

      {/* Glassmorphism Stats Grid */}
      <section className="mb-8 lg:mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              {canDestinations ? (
                <StatCard label="Total Destinations" value={stats.destinations} icon={IconPlanet} />
              ) : (
                <LockedStatCard label="Total Destinations" />
              )}
              {canCrew ? (
                <StatCard label="Crew Members" value={stats.crew} icon={IconCrew} />
              ) : (
                <LockedStatCard label="Crew Members" />
              )}
              {canTechnology ? (
                <StatCard label="Technologies" value={stats.technology} icon={IconRocket} />
              ) : (
                <LockedStatCard label="Technologies" />
              )}
            </>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8 lg:mb-10">
        <h2 className="font-sans-cond uppercase tracking-subheading text-lg text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {canDestinations && (
            <Link
              to="/dashboard/destinations"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-sans-cond uppercase tracking-nav text-sm text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5"
            >
              Add Destination
            </Link>
          )}
          {canCrew && (
            <Link
              to="/dashboard/crew"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-sans-cond uppercase tracking-nav text-sm text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5"
            >
              Add New Crew
            </Link>
          )}
          {canTechnology && (
            <Link
              to="/dashboard/technology"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-sans-cond uppercase tracking-nav text-sm text-white transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5"
            >
              Add Technology
            </Link>
          )}
          {!canDestinations && !canCrew && !canTechnology && (
            <p className="font-sans text-space-accent/60 text-sm">No quick actions available for your role.</p>
          )}
        </div>
      </section>

      {/* Recent Activity — SUPER_ADMIN only */}
      {isSuperAdmin && (
        <section>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
            <div className="border-b border-white/10 px-4 lg:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="font-sans-cond uppercase tracking-subheading text-lg text-white">
                Recent Activity
              </h2>
              <Link
                to="/dashboard/logs"
                className="font-sans text-sm text-space-accent hover:text-white transition-colors"
              >
                View All Logs
              </Link>
            </div>
            {loading ? (
              <LogListSkeleton />
            ) : recentLogs.length === 0 ? (
              <div className="px-4 lg:px-6 py-12 text-center">
                <p className="font-sans text-space-accent/70 text-sm">No recent activity.</p>
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {recentLogs.map((log, index) => (
                  <li
                    key={log?.id ?? index}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 lg:px-6 py-3 hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="font-sans text-white text-sm font-medium flex-shrink-0">
                      {log?.action ?? "—"}
                    </span>
                    <span className="font-sans text-space-accent/90 text-sm flex-1 min-w-0 truncate" title={log?.details ?? log?.detail}>
                      {(() => {
                        const entity = extractEntity(log?.details ?? log?.detail);
                        const details = String(log?.details ?? log?.detail ?? "—");
                        if (entity !== "—") return `${entity} — ${details.slice(0, 50)}${details.length > 50 ? "…" : ""}`;
                        return details.slice(0, 80) + (details.length > 80 ? "…" : "");
                      })()}
                    </span>
                    <span className="font-sans text-space-accent/60 text-xs sm:text-sm flex-shrink-0 whitespace-nowrap">
                      {formatLogDate(log?.date ?? log?.createdAt ?? log?.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
