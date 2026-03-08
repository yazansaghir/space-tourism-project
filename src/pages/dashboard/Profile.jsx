import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const initialForm = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function Profile() {
  useDocumentTitle("Profile");
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (form.newPassword !== form.confirmNewPassword) {
      setValidationError("New password and confirmation do not match.");
      return;
    }

    if (!form.currentPassword.trim() || !form.newPassword.trim()) {
      setValidationError("Please fill in all fields.");
      return;
    }

    if (form.newPassword.length < 6) {
      setValidationError("New password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await api.put("/auth/update-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated successfully!");
      setForm(initialForm);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        (err?.response?.status === 401 ? "Incorrect current password." : err?.message) ||
        "Failed to update password.";
      toast.error(message);
      // Do not clear form on error so the user can correct the current password
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="font-sans-cond uppercase tracking-subheading text-xl lg:text-2xl text-white mb-1">
          <span className="opacity-40 font-bold mr-2">Account</span> Profile
        </h1>
        <p className="font-sans text-space-accent/80 text-sm mb-6 lg:mb-8">
          Update your password
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden">
          {/* User info */}
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/80 mb-1">Username</p>
                <p className="font-sans text-white text-lg font-medium">{user?.username ?? "—"}</p>
              </div>
              <div>
                <p className="font-sans-cond uppercase tracking-nav text-xs text-space-accent/80 mb-1">Role</p>
                <p className="font-sans text-[#D0D6F9] font-medium">{user?.role ?? "—"}</p>
              </div>
            </div>
          </div>

          {/* Password form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="current-password" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
                Current Password
              </label>
              <input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                value={form.currentPassword}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
                New Password
              </label>
              <input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={form.newPassword}
                onChange={handleChange}
                required
                disabled={submitting}
                minLength={6}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                name="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                value={form.confirmNewPassword}
                onChange={handleChange}
                required
                disabled={submitting}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
                placeholder="Confirm new password"
              />
            </div>
            {validationError && (
              <p role="alert" className="font-sans text-sm text-amber-400">
                {validationError}
              </p>
            )}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="font-sans-cond uppercase tracking-nav text-sm py-2.5 px-6 rounded-lg bg-white text-[#0B0D17] hover:bg-[#D0D6F9] disabled:opacity-60 transition-colors"
              >
                {submitting ? "Updating…" : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
