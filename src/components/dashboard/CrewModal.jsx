import { useState, useEffect, useRef } from "react";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  role: "",
  bio: "",
  status: "DRAFT",
  images: { png: "", webp: "" },
  order: 0,
};

function cloudinaryUrlToDualFormat(url) {
  if (!url || typeof url !== "string") return { pngUrl: "", webpUrl: "" };
  const pngUrl = url.replace(/\.[^.?#]+($|\?)/, ".png$1");
  const webpUrl = url.replace(/\.[^.?#]+($|\?)/, ".webp$1");
  return { pngUrl, webpUrl };
}

export default function CrewModal({ isOpen, onClose, crew, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const isEditing = !!crew;

  useEffect(() => {
    if (isOpen) {
      setError("");
      if (crew) {
        setForm({
          name: crew.name ?? "",
          role: crew.role ?? "",
          bio: crew.bio ?? "",
          status: crew.status ?? "DRAFT",
          images: {
            png: crew.images?.png ?? "",
            webp: crew.images?.webp ?? "",
          },
          order: crew.order ?? 0,
        });
      } else {
        setForm(emptyForm);
      }
    }
  }, [isOpen, crew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "order") {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file); // multer expects field name 'image'
    formData.append("folder", "space-tourism/crew");
    try {
      const url = await toast.promise(
        api.post("/upload", formData).then((res) => {
          const data = res?.data;
          const resolvedUrl = typeof data?.url === "string" ? data.url : data?.secure_url ?? data?.data?.url ?? "";
          if (!resolvedUrl) throw new Error("No URL in response");
          return resolvedUrl;
        }),
        {
          loading: "Uploading image...",
          success: "Image uploaded.",
          error: (err) => err?.response?.data?.message || err?.message || "Upload failed",
        }
      );
      const { pngUrl, webpUrl } = cloudinaryUrlToDualFormat(url);
      setForm((prev) => ({
        ...prev,
        images: { png: pngUrl, webp: webpUrl },
      }));
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        bio: form.bio.trim(),
        status: form.status,
        order: parseInt(form.order, 10) || 0,
        images: {
          png: form.images.png.trim() || undefined,
          webp: form.images.webp.trim() || undefined,
        },
      };

      if (isEditing) {
        const id = crew.id ?? crew._id;
        await api.put(`/crew/${id}`, payload);
        toast.success("Updated successfully!");
      } else {
        await api.post("/crew", payload);
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
        aria-labelledby="crew-modal-title"
      >
        <div className="flex-shrink-0 border-b border-white/10 px-6 py-4">
          <h2 id="crew-modal-title" className="font-sans-cond uppercase tracking-subheading text-xl text-white">
            {isEditing ? "Edit Crew" : "Add New Crew"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 scrollbar-dark">
          <div>
            <label htmlFor="crew-order" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Sort Order
            </label>
            <input
              id="crew-order"
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
            <label htmlFor="crew-name" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Name
            </label>
            <input
              id="crew-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder="e.g. Douglas Hurley"
            />
          </div>
          <div>
            <label htmlFor="crew-role" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Role
            </label>
            <input
              id="crew-role"
              name="role"
              type="text"
              value={form.role}
              onChange={handleChange}
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent disabled:opacity-60"
              placeholder="e.g. Commander"
            />
          </div>
          <div>
            <label htmlFor="crew-bio" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Bio
            </label>
            <textarea
              id="crew-bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              disabled={submitting}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 font-sans text-sm focus:border-space-accent focus:outline-none focus:ring-1 focus:ring-space-accent resize-y min-h-[80px] disabled:opacity-60"
              placeholder="Crew member bio..."
            />
          </div>
          <div>
            <label htmlFor="crew-status" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Status
            </label>
            <select
              id="crew-status"
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
            <label htmlFor="crew-image" className="block font-sans-cond text-space-accent text-sm uppercase tracking-nav mb-1">
              Image
            </label>
            <div className="flex items-start gap-3 flex-wrap">
              <input
                ref={fileInputRef}
                id="crew-image"
                type="file"
                accept="image/*"
                disabled={submitting || uploading}
                onChange={handleImageUpload}
                className="w-full text-white/80 file:mr-3 file:bg-white/10 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 file:text-sm file:font-sans-cond file:uppercase file:tracking-nav hover:file:bg-white/20 disabled:opacity-60"
              />
              {form.images?.png && (
                <img
                  src={form.images.png}
                  alt="Crew preview"
                  className="h-14 w-14 rounded-lg object-cover border border-white/20 flex-shrink-0"
                />
              )}
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
              {submitting ? "Saving…" : isEditing ? "Save" : "Add Crew"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
