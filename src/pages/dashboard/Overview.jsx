import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../utils/api";

function getCount(res) {
  const data = res?.data;
  if (!data) return 0;
  if (typeof data?.meta?.total === "number") return data.meta.total;
  const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.destinations ?? data?.crew ?? data?.technology ?? data?.admins ?? data?.logs ?? [];
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

function getRoleSubtitle(role) {
  const r = (role ?? "").toUpperCase();
  if (r === "SUPER_ADMIN") return "Super Admin Dashboard";
  if (r) return `${role} Dashboard`;
  return "Dashboard";
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 animate-pulse">
      <div className="h-4 w-24 bg-white/10 rounded mb-4" />
      <div className="h-8 w-16 bg-white/10 rounded" />
    </div>
  );
}

function WelcomeSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 lg:p-8 animate-pulse">
      <div className="h-7 w-48 bg-white/10 rounded mb-2" />
      <div className="h-4 w-36 bg-white/10 rounded" />
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
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 relative overflow-hidden opacity-75">
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

export default function Overview() {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    destinations: 0,
    crew: 0,
    technology: 0,
    admins: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canAccess = (permission) => user?.role === "SUPER_ADMIN" || (user?.permissions || []).includes(permission);

  const canDestinations = canAccess("MANAGE_DESTINATIONS");
  const canCrew = canAccess("MANAGE_CREW");
  const canTechnology = canAccess("MANAGE_TECHNOLOGY");
  const canAdmins = isSuperAdmin;

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
      if (canAdmins) {
        promises.push(api.get("/admins"));
        keys.push("admins");
      }
      if (isSuperAdmin) {
        promises.push(api.get("/logs?limit=5"));
        keys.push("logs");
      }

      const results = promises.length > 0 ? await Promise.all(promises) : [];
      const nextStats = {
        destinations: 0,
        crew: 0,
        technology: 0,
        admins: 0,
      };
      keys.forEach((key, i) => {
        if (key === "logs") {
          setRecentLogs(getLogsList(results[i]));
        } else {
          nextStats[key] = getCount(results[i]);
        }
      });
      setStats(nextStats);
      setStats(nextStats);
    } catch (err) {
      setError(err?.message ?? "Failed to load overview");
      setStats({ destinations: 0, crew: 0, technology: 0, admins: 0 });
      setRecentLogs([]);
    } finally {
      setLoading(false);
    }
  }, [canDestinations, canCrew, canTechnology, canAdmins, isSuperAdmin]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="border border-white/10 bg-white/5 rounded-xl p-10 flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-white/30 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="font-sans text-white/70 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchOverview}
            className="border border-white/20 hover:bg-white/10 text-white rounded-md px-4 py-2 mt-4 transition-all font-sans text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Welcome Banner */}
      <section className="mb-6 lg:mb-8">
        {loading ? (
          <WelcomeSkeleton />
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 lg:p-8 shadow-lg">
            <h1 className="font-sans-cond uppercase tracking-subheading text-xl lg:text-2xl text-white">
              Welcome back, <span className="text-[#D0D6F9] font-bold">{user?.username ?? "Admin"}</span>!
            </h1>
            <p className="font-sans text-space-accent/80 text-sm mt-1">
              {getRoleSubtitle(user?.role)}
            </p>
          </div>
        )}
      </section>

      {/* Stats Grid */}
      <section className="mb-6 lg:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              {canDestinations ? (
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                  <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/80 mb-1">Total Destinations</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white" style={{ color: "#D0D6F9" }}>
                    {stats.destinations}
                  </p>
                </div>
              ) : (
                <LockedStatCard label="Total Destinations" />
              )}
              {canCrew ? (
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                  <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/80 mb-1">Total Crew</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white" style={{ color: "#D0D6F9" }}>
                    {stats.crew}
                  </p>
                </div>
              ) : (
                <LockedStatCard label="Total Crew" />
              )}
              {canTechnology ? (
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                  <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/80 mb-1">Total Technologies</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white" style={{ color: "#D0D6F9" }}>
                    {stats.technology}
                  </p>
                </div>
              ) : (
                <LockedStatCard label="Total Technologies" />
              )}
              {canAdmins ? (
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                  <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/80 mb-1">Total Admins</p>
                  <p className="text-2xl lg:text-3xl font-bold text-white" style={{ color: "#D0D6F9" }}>
                    {stats.admins}
                  </p>
                </div>
              ) : (
                <LockedStatCard label="Total Admins" />
              )}
            </>
          )}
        </div>
      </section>

      {/* Recent Activity — SUPER_ADMIN only */}
      {isSuperAdmin && (
      <section>
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
          <div className="border-b border-white/10 px-4 lg:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h2 className="font-sans-cond uppercase tracking-subheading text-lg text-white">
              Recent Activity
            </h2>
            <Link
              to="/dashboard/logs"
              className="font-sans text-sm text-[#D0D6F9] hover:text-white transition-colors"
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
