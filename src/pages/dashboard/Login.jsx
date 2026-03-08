import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Login() {
  useDocumentTitle("Dashboard Login");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-dark via-space-dark to-[#161a2e]">
      {/* Subtle grid / stars effect */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D0D6F9 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 p-8 sm:p-10">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none" />

          <div className="relative">
            <h1 className="font-sans-cond text-white uppercase tracking-subheading text-2xl sm:text-3xl font-normal mb-1">
              <span className="opacity-40 font-bold mr-2">Admin</span>
              Sign in
            </h1>
            <p className="text-space-accent/80 text-sm font-sans mb-8">
              Space Tourism · Super Admin
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 font-sans focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent transition-colors disabled:opacity-60"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/30 font-sans focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent transition-colors disabled:opacity-60"
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 font-sans"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-space-dark font-serif text-lg uppercase py-3 px-6 hover:bg-space-accent focus:outline-none focus:ring-2 focus:ring-space-accent focus:ring-offset-2 focus:ring-offset-space-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-space-dark"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-space-accent/60 text-xs font-sans mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
