import { useState, useEffect, useCallback } from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import TechnologyModal from "../../components/dashboard/TechnologyModal";

function getId(t) {
  return t?.id ?? t?._id;
}

function StatusBadge({ status, isDeleted }) {
  const s = (status ?? "").toUpperCase();
  const styles = {
    PUBLISHED: "text-cyan-400 bg-cyan-500/20",
    DRAFT: "text-amber-400 bg-amber-500/20",
    ARCHIVED: "text-gray-400 bg-white/10",
  };
  const className = styles[s] ?? "text-space-accent/80 bg-white/10";
  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans uppercase ${className}`}>
        {status ?? "—"}
      </span>
      {isDeleted && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans uppercase text-red-400 bg-red-500/20">
          DELETED
        </span>
      )}
    </span>
  );
}

export default function DashboardTechnologyPage() {
  useDocumentTitle("Technology");
  const [technology, setTechnology] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTechnology, setEditingTechnology] = useState(null);
  const [technologyToDelete, setTechnologyToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTechnology = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/technology/all");
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.technology ?? [];
      setTechnology(list);
    } catch (err) {
      setError(err?.message ?? "Failed to load technology");
      setTechnology([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechnology();
  }, [fetchTechnology]);

  const handleAdd = () => {
    setEditingTechnology(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingTechnology(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTechnology(null);
  };

  const handleModalSuccess = () => {
    fetchTechnology();
  };

  const handleDeleteClick = (item) => {
    setTechnologyToDelete(item);
  };

  const handleDeleteCancel = () => {
    setTechnologyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!technologyToDelete) return;
    const id = getId(technologyToDelete);
    setDeleting(true);
    try {
      await api.delete(`/technology/${id}`);
      setTechnologyToDelete(null);
      toast.success("Deleted successfully!");
      await fetchTechnology();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async (item) => {
    const id = getId(item);
    try {
      await api.put(`/technology/${id}`, { isDeleted: false });
      toast.success("Updated successfully!");
      await fetchTechnology();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to restore");
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="font-sans-cond uppercase tracking-subheading text-xl lg:text-2xl text-white">
            <span className="opacity-40 font-bold mr-2">Technology</span>
          </h1>
          <p className="font-sans text-space-accent/80 text-sm mt-1">
            Manage technology entries
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="font-sans-cond uppercase tracking-nav text-sm px-5 py-2.5 rounded-lg border border-space-accent text-space-accent hover:bg-space-accent hover:text-space-dark transition-colors flex-shrink-0"
        >
          Add New Technology
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 flex justify-center">
          <svg
            className="animate-spin h-8 w-8 text-space-accent"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : error ? (
        <div className="border border-white/10 bg-white/5 rounded-xl p-10 flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 text-white/30 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="font-sans text-white/70 text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchTechnology}
            className="border border-white/20 hover:bg-white/10 text-white rounded-md px-4 py-2 mt-4 transition-all font-sans text-sm"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6 w-14">#</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Name</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Description</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Status</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {technology.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div className="border border-white/10 bg-white/5 rounded-xl mx-4 my-6 p-10 flex flex-col items-center justify-center text-center">
                          <svg className="w-12 h-12 text-white/25 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <p className="font-sans text-white/60 text-sm">No technology yet. Add one to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    technology.map((item) => {
                      const deleted = item?.isDeleted === true;
                      return (
                      <tr
                        key={getId(item)}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${deleted ? "opacity-50" : ""}`}
                      >
                        <td className="py-3 px-4 lg:px-6">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs text-white font-sans">
                            {item.order ?? 0}
                          </span>
                        </td>
                        <td className="font-sans text-white py-3 px-4 lg:px-6">{item.name ?? "—"}</td>
                        <td className="py-3 px-4 lg:px-6 max-w-xs">
                          <div className="font-sans text-space-accent/80 text-sm line-clamp-2 truncate" title={item.description}>
                            {item.description ?? "—"}
                          </div>
                        </td>
                        <td className="py-3 px-4 lg:px-6">
                          <StatusBadge status={item.status} isDeleted={deleted} />
                        </td>
                        <td className="py-3 px-4 lg:px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              disabled={deleted}
                              className="font-sans-cond uppercase tracking-nav bg-white/5 text-space-accent hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5"
                            >
                              Edit
                            </button>
                            {deleted ? (
                              <button
                                type="button"
                                onClick={() => handleRestore(item)}
                                className="font-sans-cond uppercase tracking-nav bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-all text-sm "
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(item)}
                                className="font-sans-cond uppercase tracking-nav bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all text-sm "
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ); })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {technology.length === 0 ? (
              <div className="border border-white/10 bg-white/5 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <svg className="w-12 h-12 text-white/25 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="font-sans text-white/60 text-sm">No technology yet. Add one to get started.</p>
              </div>
            ) : (
              technology.map((item) => {
                const deleted = item?.isDeleted === true;
                return (
                <div
                  key={getId(item)}
                  className={`rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors ${deleted ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs text-white font-sans flex-shrink-0">
                      {item.order ?? 0}
                    </span>
                    <h3 className="font-serif text-white text-lg uppercase">{item.name ?? "—"}</h3>
                  </div>
                  <p className="font-sans text-space-accent/80 text-sm mt-1 line-clamp-2">{item.description ?? "—"}</p>
                  <p className="mt-2">
                    <StatusBadge status={item.status} isDeleted={deleted} />
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      disabled={deleted}
                      className="font-sans-cond uppercase tracking-nav bg-white/5 text-space-accent hover:bg-white/10 hover:text-white px-3 py-1.5 rounded transition-all text-sm  disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Edit
                    </button>
                    {deleted ? (
                      <button
                        type="button"
                        onClick={() => handleRestore(item)}
                        className="font-sans-cond uppercase tracking-nav bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-all text-sm "
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(item)}
                        className="font-sans-cond uppercase tracking-nav bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all text-sm "
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ); })
            )}
          </div>
        </>
      )}

      <TechnologyModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        technology={editingTechnology}
        onSuccess={handleModalSuccess}
      />

      {technologyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleDeleteCancel}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-space-dark/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-technology-modal-title"
          >
            <div className="p-6">
              <h2 id="delete-technology-modal-title" className="font-sans-cond uppercase tracking-subheading text-xl text-white mb-2">
                Delete Technology?
              </h2>
              <p className="font-sans text-space-accent/90 text-sm leading-relaxed">
                Are you sure you want to delete <span className="text-white font-medium">{technologyToDelete.name ?? "this technology"}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="flex-1 font-sans-cond uppercase tracking-nav text-sm py-2.5 rounded-lg border border-white/20 text-space-accent hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 font-sans-cond uppercase tracking-nav text-sm py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? "Deleting…" : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
