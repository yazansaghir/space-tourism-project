import { useState, useEffect, useCallback, useMemo } from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../utils/api";

const PAGE_SIZE = 10;
const ACTION_OPTIONS = ["ALL", "CREATE", "UPDATE", "DELETE"];

function extractEntity(details) {
  const s = (details ?? "").toLowerCase();
  const entities = [
    { key: "destination", label: "Destination" },
    { key: "crew", label: "Crew" },
    { key: "technology", label: "Technology" },
    { key: "admin", label: "Admin" },
  ];
  for (const { key, label } of entities) {
    if (s.includes(key)) return label;
  }
  return "—";
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleString();
}

function getAdminDisplay(log) {
  const name = log?.adminName ?? log?.admin_name ?? null;
  const role = log?.adminRole ?? log?.admin_role ?? null;
  const isSuperAdmin = (role ?? "").toUpperCase() === "SUPER_ADMIN";
  return { name: name || "System", isSuperAdmin };
}

function LogSkeleton() {
  return (
    <>
      <div className="md:hidden space-y-3 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-3" />
            <div className="h-4 w-16 bg-white/10 rounded animate-pulse mb-3" />
            <div className="h-3 flex-1 bg-white/10 rounded animate-pulse mb-2" />
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="hidden md:block">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center border-b border-white/5 py-3 px-4 lg:px-6">
            <div className="h-4 w-20 bg-white/10 rounded animate-pulse flex-shrink-0" />
            <div className="h-5 w-16 mx-4 lg:mx-6 bg-white/10 rounded animate-pulse flex-shrink-0" />
            <div className="h-4 flex-1 min-w-0 bg-white/10 rounded animate-pulse mx-2" />
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse flex-shrink-0 mx-2" />
            <div className="h-4 w-28 bg-white/10 rounded animate-pulse flex-shrink-0" />
          </div>
        ))}
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-space-accent/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="font-sans text-space-accent/80 text-center max-w-xs">
        No logs match your filters. Try adjusting search or action.
      </p>
    </div>
  );
}

export default function Logs() {
  useDocumentTitle("System Logs");
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const fetchLogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/logs?page=${page}&limit=${PAGE_SIZE}`);
      setLogs(Array.isArray(data?.data) ? data.data : data?.logs ?? []);
      setMeta({
        page: data?.meta?.page ?? page,
        totalPages: data?.meta?.totalPages ?? 1,
      });
    } catch (err) {
      setError(err?.message ?? "Failed to load logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(meta.page);
  }, []);

  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchAction = actionFilter === "ALL" || (log?.action ?? "").toUpperCase() === actionFilter;
      const details = (log?.details ?? log?.detail ?? "").toLowerCase();
      const matchSearch = !q || details.includes(q);
      return matchAction && matchSearch;
    });
  }, [logs, search, actionFilter]);

  const goToPage = (page) => {
    if (page < 1 || page > meta.totalPages) return;
    fetchLogs(page);
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="font-sans-cond uppercase tracking-subheading text-xl lg:text-2xl text-white">
          <span className="opacity-40 font-bold mr-2">System</span> Logs
        </h1>
        <p className="font-sans text-space-accent/80 text-sm mt-1">
          Activity and audit trail
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <div className="relative flex-1 min-w-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search by details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/40 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent"
          />
        </div>
        <div className="flex-shrink-0">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-white/20 bg-white/5 text-white font-sans-cond uppercase tracking-nav text-sm px-4 py-2.5 focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent appearance-none bg-no-repeat bg-[length:12px] bg-[right_0.75rem_center] pr-10"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23D0D6F9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
          >
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-space-dark text-white">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {loading ? (
          <LogSkeleton />
        ) : error ? (
          <div className="border border-white/10 bg-white/5 rounded-xl p-10 flex flex-col items-center justify-center text-center">
            <svg className="w-12 h-12 text-white/30 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="font-sans text-white/70 text-sm">{error}</p>
            <button
              type="button"
              onClick={() => fetchLogs(meta.page)}
              className="border border-white/20 hover:bg-white/10 text-white rounded-md px-4 py-2 mt-4 transition-all font-sans text-sm"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Action</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Entity</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Details</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Admin</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-0">
                        <EmptyState />
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log, index) => {
                      const { name: adminName, isSuperAdmin } = getAdminDisplay(log);
                      const entity = extractEntity(log?.details ?? log?.detail);
                      return (
                        <tr
                          key={log?.id ?? index}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="font-sans text-white py-3 px-4 lg:px-6 text-sm">{log?.action ?? "—"}</td>
                          <td className="py-3 px-4 lg:px-6">
                            {entity !== "—" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans-cond uppercase tracking-nav bg-white/10 text-space-accent">
                                {entity}
                              </span>
                            ) : (
                              <span className="text-space-accent/60 text-sm">—</span>
                            )}
                          </td>
                          <td className="font-sans text-space-accent py-3 px-4 lg:px-6 text-sm max-w-xs truncate" title={log?.details ?? log?.detail}>
                            {log?.details ?? log?.detail ?? "—"}
                          </td>
                          <td className="py-3 px-4 lg:px-6">
                            <span
                              className={
                                isSuperAdmin
                                  ? "font-sans text-sm text-amber-400 font-medium drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                  : "font-sans text-space-accent text-sm"
                              }
                            >
                              {adminName}
                            </span>
                          </td>
                          <td className="font-sans text-space-accent/80 py-3 px-4 lg:px-6 text-sm whitespace-nowrap">
                            {formatDate(log?.date ?? log?.createdAt ?? log?.created_at)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <EmptyState />
              ) : (
                filteredLogs.map((log, index) => {
                  const { name: adminName, isSuperAdmin } = getAdminDisplay(log);
                  const entity = extractEntity(log?.details ?? log?.detail);
                  return (
                    <div
                      key={log?.id ?? index}
                      className="p-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-sans text-white text-sm font-medium">{log?.action ?? "—"}</span>
                        {entity !== "—" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans-cond uppercase tracking-nav bg-white/10 text-space-accent">
                            {entity}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-space-accent text-sm mb-2 line-clamp-2">
                        {log?.details ?? log?.detail ?? "—"}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            isSuperAdmin
                              ? "text-amber-400 font-medium drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]"
                              : "text-space-accent/80"
                          }
                        >
                          {adminName}
                        </span>
                        <span className="text-space-accent/60">
                          {formatDate(log?.date ?? log?.createdAt ?? log?.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {!loading && !error && filteredLogs.length > 0 && meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-t border-white/10">
                <p className="font-sans text-space-accent/70 text-sm">
                  Page {meta.page} of {meta.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => goToPage(meta.page - 1)}
                    disabled={meta.page <= 1}
                    className="font-sans-cond uppercase tracking-nav text-sm px-4 py-2 rounded-md border border-white/20 text-space-accent hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => goToPage(meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                    className="font-sans-cond uppercase tracking-nav text-sm px-4 py-2 rounded-md border border-white/20 text-space-accent hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
