# 🚀 Space Tourism Multi-App

**Public Website + Enterprise Admin Dashboard**

A production-ready, enterprise-grade React application that pairs a **pixel-perfect Space Tourism** marketing site with a **secure Admin CMS**. Built for portfolio showcase and client handover—featuring fluid Framer Motion animations, skeleton loaders, Cloudinary-backed media uploads, and a glassmorphism Mission Control dashboard.

---

## 📋 Project Overview

This project is **dual-nature by design**:

| Layer | Description |
|-------|-------------|
| **Public Site** | A polished, responsive Space Tourism website with destinations, crew, and technology pages—driven by live API data, fluid animations, and progressive image loading. |
| **Admin Dashboard** | A secure, role-aware CMS for managing content (destinations, crew, technology), team members, and viewing activity logs—all wrapped in a dark, glassmorphism UI. |

Both surfaces share the same codebase, routing, and API—with **RBAC** and protected routes ensuring the right people see the right tools.

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|---------------|
| **Core** | React 19, Vite 7, Tailwind CSS |
| **Routing** | React Router DOM |
| **State & Auth** | Context API (silent auth sync, permissions) |
| **HTTP** | Axios (custom interceptors, auth, error handling) |
| **Motion & UX** | **Framer Motion** (page transitions, staggered micro-interactions, layout stability), React Hot Toast |

### Framer Motion

- **Page transitions** — crossfade and subtle vertical motion when switching between Home, Destination, Crew, and Technology.
- **Staggered reveals** — content (image → title → bio → tabs) animates in sequence for a premium feel.
- **Static layout** — navigation controls (tabs, dots, numbers) stay fixed; only dynamic content is wrapped in `AnimatePresence` to prevent layout jumps.
- **Breathing background** — slow, subtle scale animation on space backgrounds for depth.

---

## 🔌 Backend Context

This frontend connects to a **Node.js API** that provides:

- **Neon (PostgreSQL)** — primary database for destinations, crew, technology, admins, and activity logs.
- **Cloudinary** — media storage; the API accepts `multipart/form-data` uploads and returns URLs used for WebP/PNG dual-format handling in the dashboard.

The frontend uses a single base URL (e.g. `VITE_API_BASE_URL`) for all API requests; auth is cookie/session-based with Axios interceptors handling 401s and toasts for errors.

---

## ✨ Key Features

### 🌐 Public Space Website

- **Fluid animations** — Framer Motion page transitions and staggered content reveals; static nav controls to avoid layout jumps.
- **Layout stability** — fixed aspect ratios and min-heights on images and text blocks so switching tabs doesn’t cause reflow.
- **Blur-up progressive image loading** — images start blurred and low-opacity, then transition to sharp and full opacity on load (`BlurUpImage` component).
- **Elegant skeleton loaders** — static, non-pulsing placeholders that mirror the final layout (Destination, Crew, Technology) for a smooth loading experience.
- **Responsive design** — Tailwind breakpoints aligned with the Space Tourism spec; Explore CTA links to the Destination page.

### 🖥️ Enterprise Dashboard

- **Glassmorphism UI** — dark theme (`#0B0D17`) with `backdrop-blur`, soft borders, and hover states across stat cards and modals.
- **Mission Control Overview** — greeting, time-based subtext, glassmorphism stat cards (Destinations, Crew, Technologies) with subtle SVG icons and quick-action links.
- **Fully responsive** — dashboard layout and tables adapt to mobile and desktop.
- **Empty & error states** — consistent patterns and retry actions.

### 🔐 Advanced RBAC

- **Role-Based Access Control** — Super Admin vs Admin with distinct permissions.
- **Dynamic sidebar** — nav items (Destinations, Crew, Technology, Admins, Logs) render based on user role/permissions.
- **Protected routes** — dashboard requires auth; section-level guards (e.g. `PermissionRoute`, `AdminOnlyRoute`) enforce access.
- **Silent auth sync** — background validation keeps the UI in sync with session and permissions.

### 📤 Smart Media Upload

- **File upload UI** — dashboard modals (Crew, Destination, Technology) use `<input type="file">` instead of text paths.
- **Multipart upload** — `FormData` with field name `image` and `folder` is sent to the API (`/api/upload`); request interceptor omits `Content-Type` so the browser sets `multipart/form-data` with boundary.
- **Dual-format (Crew & Destination)** — one upload returns a Cloudinary URL; the frontend derives `.png` and `.webp` variants and saves both in the `images` object for the backend.
- **Portrait & landscape (Technology)** — separate file inputs for portrait and landscape; each upload updates the corresponding URL in state with thumbnail previews.

---

## 📁 Folder Architecture

```
src/
├── components/
│   ├── dashboard/       # CrewModal, DestinationModal, TechnologyModal, Sidebar, ProtectedRoute, etc.
│   ├── Navigation/      # Navbar, Sidebar
│   ├── Destination/     # DestinationNav
│   ├── Crew/            # CrewDots
│   ├── Technology/      # TechNumbers
│   └── ui/              # BlurUpImage (progressive image loading)
├── context/             # AuthContext (auth state, login, logout, permissions)
├── hooks/               # useDocumentTitle
├── layouts/             # MainLayout (public), DashboardLayout (dashboard)
├── pages/
│   ├── public/          # Home, Destination, Crew, Technology
│   └── dashboard/       # Login, Overview, Destinations, Crew, Technology, Admins, Logs, Profile
├── utils/               # api.js (Axios instance, request/response interceptors)
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🛠️ Setup Instructions

### 1. Clone & install

```bash
git clone <repository-url>
cd space-tourism
npm install
```

### 2. Environment variables

Copy the example env file and configure your API base URL:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
VITE_API_BASE_URL=https://your-api-url.vercel.app/api
```

Use your deployed Node.js API URL (or local backend, e.g. `http://localhost:3000/api`). Ensure `src/utils/api.js` uses `import.meta.env.VITE_API_BASE_URL` (with a fallback if needed).

### 3. Run the app

```bash
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

- **Public site:** `/` — Home, Destination, Crew, Technology.
- **Dashboard:** `/dashboard` — login at `/dashboard/login`.

### 4. Build for production

```bash
npm run build
npm run preview   # Optional: preview production build locally
```

---

## 🚀 Deployment

The frontend is optimized for **Vercel**:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable `VITE_API_BASE_URL` can be set in the Vercel project settings.

---

## 📄 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📌 Notes

- The dashboard expects an API that supports auth, CRUD for destinations/crew/technology/admins, activity logs, and a multipart `/upload` endpoint (e.g. Multer + Cloudinary). Configure CORS for your frontend origin.
- Skeleton loaders and BlurUpImage are used only on the public Destination, Crew, and Technology pages; the dashboard uses standard loading and file upload UX.

---

**Built with React + Vite + Framer Motion · Enterprise-grade frontend for Space Tourism**
