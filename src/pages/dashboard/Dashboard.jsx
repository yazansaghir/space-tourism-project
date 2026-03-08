import { useAuth } from "../../context/AuthContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Dashboard() {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();

  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-sans-cond uppercase tracking-subheading text-xl lg:text-2xl text-white">
        <span className="opacity-40 font-bold mr-2">Overview</span>
      </h1>
      <p className="font-sans text-space-accent mt-2">
        Welcome, <span className="text-white font-medium">{user?.username}</span>.
      </p>
      <p className="font-sans text-white/60 text-sm mt-1">
        Role: {user?.role ?? "—"}
      </p>
    </div>
  );
}
