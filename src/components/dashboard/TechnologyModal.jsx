import { useState, useEffect } from "react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  description: "",
  status: "DRAFT",
  imagePortrait: "",
  imageLandscape: "",
  order: 0,
};

export default function TechnologyModal({ isOpen, onClose, technology, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!technology;

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (technology) {
        setForm({
          name: technology.name ?? "",
          description: technology.description ?? "",
          status: technology.status ?? "DRAFT",
          imagePortrait: technology.images?.portrait ?? "",
          imageLandscape: technology.images?.landscape ?? "",
          order: technology.order ?? 0,
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [isOpen, technology]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        order: parseInt(form.order, 10) || 0,
        images: {
          portrait: form.imagePortrait.trim() || undefined,
          landscape: form.imageLandscape.trim() || undefined,
        },
      };

      if (isEditing) {
        const id = technology.id ?? technology._id;
        await api.put(`/technology/${id}`, payload);
        toast.success("Updated successfully!");
      } else {
        await api.post("/technology", payload);
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
        aria-labelledby="technology-modal-title"
      >
        <div className="flex-shrink-0 border-b border-white/10 px-6 py-4">
          <h2 id="technology-modal-title" className="font-sans-cond uppercase tracking-subheading text-xl text-white">
            {isEditing ? "Edit Technology" : "Add New Technology"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-dark">
          <div>
            <label htmlFor="tech-order" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Sort Order
            </label>
            <input
              id="tech-order"
              name="order"
              type="number"
              min={0}
              value={form.order}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="tech-name" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Name
            </label>
            <input
              id="tech-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder="e.g. Launch vehicle"
            />
          </div>
          <div>
            <label htmlFor="tech-description" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Description
            </label>
            <textarea
              id="tech-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent resize-y min-h-[80px] disabled:opacity-60"
              placeholder="Technology description..."
            />
          </div>
          <div>
            <label htmlFor="tech-status" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Status
            </label>
            <select
              id="tech-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60 appearance-none bg-no-repeat bg-[length:12px] bg-[right_0.75rem_center] pr-10"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23D0D6F9' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")" }}
            >
              <option value="DRAFT" className="bg-space-dark text-white">DRAFT</option>
              <option value="PUBLISHED" className="bg-space-dark text-white">PUBLISHED</option>
              <option value="ARCHIVED" className="bg-space-dark text-white">ARCHIVED</option>
            </select>
          </div>
          <div>
            <label htmlFor="tech-image-portrait" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Image Portrait path
            </label>
            <input
              id="tech-image-portrait"
              name="imagePortrait"
              type="text"
              value={form.imagePortrait}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder="./assets/technology/image-launch-vehicle-portrait.jpg"
            />
          </div>
          <div>
            <label htmlFor="tech-image-landscape" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Image Landscape path
            </label>
            <input
              id="tech-image-landscape"
              name="imageLandscape"
              type="text"
              value={form.imageLandscape}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder="./assets/technology/image-launch-vehicle-landscape.jpg"
            />
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
              {submitting ? "Saving…" : isEditing ? "Save" : "Add Technology"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
