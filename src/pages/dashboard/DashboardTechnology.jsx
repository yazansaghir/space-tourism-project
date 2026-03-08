import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function DashboardTechnology() {
  useDocumentTitle("Technology");
  return (
    <div className="p-4 lg:p-8">
      <h1 className="font-sans-cond uppercase tracking-subheading text-xl lg:text-2xl text-white">
        <span className="opacity-40 font-bold mr-2">Technology</span> Admin
      </h1>
      <p className="font-sans text-space-accent/80 text-sm mt-2">Coming soon</p>
    </div>
  );
}
