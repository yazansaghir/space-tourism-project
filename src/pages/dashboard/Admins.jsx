import { useState, useEffect, useCallback } from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import toast from "react-hot-toast";
import AdminModal from "../../components/dashboard/AdminModal";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getId(admin) {
  return admin?.id ?? admin?._id;
}

export default function Admins() {
  useDocumentTitle("Admins");
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/admins");
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.admins ?? [];
      setAdmins(list);
    } catch (err) {
      setError(err?.message ?? "Failed to load admins");
      setAdmins([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAdd = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handleModalSuccess = () => {
    fetchAdmins();
  };

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
  };

  const handleDeleteCancel = () => {
    setAdminToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    const id = getId(adminToDelete);
    setDeleting(true);
    try {
      await api.delete(`/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => getId(a) !== id));
      setAdminToDelete(null);
      toast.success("Deleted successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const isCurrentUser = (admin) => {
    if (!currentUser) return false;
    return (
      admin?.username === currentUser?.username ||
      getId(admin) === currentUser?.id ||
      getId(admin) === currentUser?._id
    );
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="font-sans-cond uppercase tracking-subheading text-xl lg:text-2xl text-white">
            <span className="opacity-40 font-bold mr-2">Admins</span>
          </h1>
          <p className="font-sans text-space-accent/80 text-sm mt-1">
            Manage team members and permissions
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="font-sans-cond uppercase tracking-nav text-sm px-5 py-2.5 rounded-lg border border-space-accent text-space-accent hover:bg-space-accent hover:text-space-dark transition-colors flex-shrink-0"
        >
          Add New Team Member
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
            onClick={fetchAdmins}
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
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Username</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Role</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Permissions</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6">Date Added</th>
                    <th className="font-sans-cond uppercase tracking-nav text-xs text-space-accent py-4 px-4 lg:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div className="border border-white/10 bg-white/5 rounded-xl mx-4 my-6 p-10 flex flex-col items-center justify-center text-center">
                          <svg className="w-12 h-12 text-white/25 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <p className="font-sans text-white/60 text-sm">No team members yet. Add one to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => {
                      const isSelf = isCurrentUser(admin);
                      return (
                        <tr key={getId(admin) ?? admin?.username} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="font-sans text-white py-3 px-4 lg:px-6">{admin.username ?? "—"}</td>
                          <td className="font-sans text-space-accent py-3 px-4 lg:px-6 text-sm">{admin.role ?? "—"}</td>
                          <td className="py-3 px-4 lg:px-6">
                            <div className="flex flex-wrap gap-1.5">
                              {Array.isArray(admin.permissions) && admin.permissions.length > 0 ? (
                                admin.permissions.map((perm) => (
                                  <span
                                    key={perm}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans bg-white/10 text-white/90"
                                  >
                                    {perm}
                                  </span>
                                ))
                              ) : (
                                <span className="font-sans text-space-accent/60 text-sm">—</span>
                              )}
                            </div>
                          </td>
                          <td className="font-sans text-space-accent/80 py-3 px-4 lg:px-6 text-sm whitespace-nowrap">
                            {formatDate(admin?.createdAt ?? admin?.created_at ?? admin?.dateAdded)}
                          </td>
                          <td className="py-3 px-4 lg:px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(admin)}
                                className="font-sans-cond uppercase tracking-nav bg-white/5 text-space-accent hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm "
                              >
                                Edit
                              </button>
                              {!isSelf && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClick(admin)}
                                  className="font-sans-cond uppercase tracking-nav bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all text-sm "
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {admins.length === 0 ? (
              <div className="border border-white/10 bg-white/5 rounded-xl p-10 flex flex-col items-center justify-center text-center">
                <svg className="w-12 h-12 text-white/25 mb-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="font-sans text-white/60 text-sm">No team members yet. Add one to get started.</p>
              </div>
            ) : (
              admins.map((admin) => {
                const isSelf = isCurrentUser(admin);
                return (
                  <div
                    key={getId(admin) ?? admin?.username}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
                  >
                    <h3 className="font-serif text-white text-lg">{admin.username ?? "—"}</h3>
                    <p className="font-sans text-space-accent text-sm mt-0.5">{admin.role ?? "—"}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Array.isArray(admin.permissions) &&
                        admin.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans bg-white/10 text-white/90"
                          >
                            {perm}
                          </span>
                        ))}
                    </div>
                    <p className="font-sans text-space-accent/60 text-xs mt-2">
                      Added {formatDate(admin?.createdAt ?? admin?.created_at ?? admin?.dateAdded)}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(admin)}
                        className="font-sans-cond uppercase tracking-nav bg-white/5 text-space-accent hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-lg transition-all text-sm "
                      >
                        Edit
                      </button>
                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(admin)}
                          className="font-sans-cond uppercase tracking-nav bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all text-sm "
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editingAdmin={editingAdmin}
        onSuccess={handleModalSuccess}
      />

      {/* Delete confirmation modal */}
      {adminToDelete && (
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
            aria-labelledby="delete-admin-modal-title"
          >
            <div className="p-6">
              <h2 id="delete-admin-modal-title" className="font-sans-cond uppercase tracking-subheading text-xl text-white mb-2">
                Delete Team Member?
              </h2>
              <p className="font-sans text-space-accent/90 text-sm leading-relaxed">
                Are you sure you want to delete <span className="text-white font-medium">{adminToDelete.username ?? "this team member"}</span>? This action cannot be undone.
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
