import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const MODULE_PERMISSIONS = [
  { value: "MANAGE_DESTINATIONS", label: "Manage Destinations" },
  { value: "MANAGE_CREW", label: "Manage Crew" },
  { value: "MANAGE_TECHNOLOGY", label: "Manage Technology" },
];

export default function AdminModal({ isOpen, onClose, editingAdmin, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!editingAdmin;

  useEffect(() => {
    if (isOpen) {
      setError("");
      setPassword("");
      if (editingAdmin) {
        setUsername(editingAdmin.username ?? "");
        setPermissions(Array.isArray(editingAdmin.permissions) ? [...editingAdmin.permissions] : []);
      } else {
        setUsername("");
        setPermissions([]);
      }
    }
  }, [isOpen, editingAdmin]);

  const togglePermission = (value) => {
    setPermissions((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const usernameTrimmed = username.trim();
      if (isEditing) {
        const id = editingAdmin.id ?? editingAdmin._id;
        const payload = {
          username: usernameTrimmed,
          permissions: [...permissions],
        };
        if (password.trim()) {
          payload.password = password;
        }
        await api.put(`/admins/${id}`, payload);
        toast.success("Updated successfully!");
      } else {
        if (!password.trim()) {
          setError("Password is required for new team members.");
          setSubmitting(false);
          return;
        }
        await api.post("/admins", {
          username: usernameTrimmed,
          password,
          permissions: [...permissions],
        });
        toast.success("Added successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-space-dark/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        <div className="flex-shrink-0 border-b border-white/10 px-6 py-4">
          <h2 id="admin-modal-title" className="font-sans-cond uppercase tracking-subheading text-xl text-white">
            {isEditing ? "Edit Team Member" : "Add New Team Member"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-dark">
          <div>
            <label htmlFor="admin-username" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={submitting}
              autoComplete="off"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Password {isEditing && <span className="text-white/50 font-normal normal-case">(optional)</span>}
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing}
              disabled={submitting}
              autoComplete={isEditing ? "new-password" : "new-password"}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
            />
          </div>
          <div>
            <span className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-2">
              Module Access
            </span>
            <div className="space-y-2" role="group" aria-labelledby="admin-modal-title">
              {MODULE_PERMISSIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(value)}
                    onChange={() => togglePermission(value)}
                    disabled={submitting}
                    className="sr-only peer"
                  />
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      permissions.includes(value)
                        ? "bg-space-accent border-space-accent"
                        : "border-white/30 bg-white/5 group-hover:border-white/50"
                    }`}
                    aria-hidden="true"
                  >
                    {permissions.includes(value) && (
                      <svg className="w-3 h-3 text-space-dark" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <span className="font-sans text-sm text-white/90 group-hover:text-white transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
          </div>
          {error && (
            <p role="alert" className="text-sm text-red-400 font-sans">
              {error}
            </p>
          )}
          <div className="flex-shrink-0 flex gap-3 border-t border-white/10 p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 font-sans-cond uppercase tracking-nav text-sm py-2.5 rounded-lg border border-white/20 text-space-accent hover:bg-white/5 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 font-sans-cond uppercase tracking-nav text-sm py-2.5 rounded-lg bg-white text-space-dark hover:bg-space-accent disabled:opacity-60 transition-colors"
            >
              {submitting ? "Saving…" : isEditing ? "Save" : "Add Team Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
