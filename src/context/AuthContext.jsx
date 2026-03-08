import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { api, STORAGE_KEY } from "../utils/api";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.username !== "string") return null;
    return {
      username: parsed.username,
      role: parsed.role ?? "SUPER_ADMIN",
      permissions: Array.isArray(parsed.permissions) ? parsed.permissions : [],
    };
  } catch {
    return null;
  }
}

function persistUser(user) {
  if (!user) return;
  const toStore = {
    username: user.username,
    role: user.role,
    permissions: Array.isArray(user.permissions) ? user.permissions : [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      persistUser(user);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (username, password) => {
    try {
      const { data } = await api.post("/auth/login", { username, password });
      const userData = data?.user ?? data;
      const nextUser = {
        username: userData?.username ?? username,
        role: userData?.role ?? "SUPER_ADMIN",
        permissions: Array.isArray(userData?.permissions) ? userData.permissions : [],
      };
      setUser(nextUser);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Invalid credentials";
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const stored = readStoredUser();
    if (!stored) return;
    try {
      const { data } = await api.get("/auth/me");
      const userData = data?.user ?? data;
      const nextUser = {
        username: userData?.username ?? stored.username,
        role: userData?.role ?? stored.role,
        permissions: Array.isArray(userData?.permissions) ? userData.permissions : [],
      };
      setUser(nextUser);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 404) {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        if (!window.location.pathname.includes("/dashboard/login")) {
          window.location.href = "/dashboard/login";
        }
      }
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
