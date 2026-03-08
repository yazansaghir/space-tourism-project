# 🚀 Space Tourism Multi-App

**Public Website + Enterprise Admin Dashboard**

A production-ready React application combining a pixel-perfect **Space Tourism** marketing site with a secure **Enterprise Admin Dashboard**. Built for client handover and portfolio showcase with a clean architecture, RBAC, and a polished glassmorphism UI.

---

## ✨ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | React 19 + Vite 7 |
| **Styling** | Tailwind CSS |
| **Routing** | React Router DOM |
| **State** | Context API (Auth) |
| **HTTP** | Axios |
| **UX** | React Hot Toast, Framer Motion |

---

## 🎯 Key Features

### 🌐 Public Space Website

- **Pixel-perfect** implementation aligned with the Space Tourism design.
- **Live data** — destinations, crew, and technology fetched from the API.
- Responsive layouts with smooth transitions and accessible navigation.

### 🖥️ Enterprise Dashboard

- **Glassmorphism UI** with a dark theme (`#0B0D17`).
- **CRUD** for Destinations, Crew, Technology, and Team Members (Admins).
- **Activity Logs** and **Overview** with stats and recent actions.
- **Silent Auth Sync** — background token/permission validation for a seamless experience.
- **Empty & error states** with consistent, polished UI patterns.

### 🔐 Advanced RBAC

- **Role-Based Access Control:** Super Admin vs Admin.
- **Dynamic sidebar** — navigation items reflect user permissions (e.g. Destinations, Crew, Technology, Admins, Logs).
- **Protected routes** — dashboard requires authentication; specific sections respect permissions.
- **Admin-only** areas (e.g. Team Members, Logs) when applicable.

---

## 📁 Folder Architecture

```
src/
├── components/          # Reusable UI
│   ├── dashboard/       # Modals, Sidebar, ProtectedRoute, etc.
│   ├── Navigation/      # Navbar, Sidebar
│   ├── Destination/    # DestinationNav
│   ├── Crew/           # CrewDots
│   ├── Technology/     # TechNumbers
│   └── ui/             # Preloader, etc.
├── context/            # AuthContext (auth state, login, logout, permissions)
├── hooks/              # useDocumentTitle, etc.
├── layouts/             # MainLayout (public), DashboardLayout (dashboard)
├── pages/
│   ├── public/         # Home, Destination, Crew, Technology (marketing site)
│   └── dashboard/      # Login, Overview, Destinations, Crew, Technology, Admins, Logs, Profile
├── utils/              # api.js (Axios instance, interceptors)
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

Copy the example env file and set your API base URL:

```bash
cp .env.example .env
```

Edit `.env` and set `VITE_API_BASE_URL` to your API (e.g. the live Space Tourism API or a local backend).

> **Tip:** To use the env var in the app, set the Axios `baseURL` in `src/utils/api.js` to `import.meta.env.VITE_API_BASE_URL` (with a fallback to the default URL if needed).

### 3. Run the app

```bash
npm run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`).

- **Public site:** `/` (Home, Destinations, Crew, Technology).
- **Dashboard:** `/dashboard` (login at `/dashboard/login`).

### 4. Build for production

```bash
npm run build
npm run preview   # Optional: preview production build locally
```

---

## 📄 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 📌 Notes

- The dashboard expects an API that supports auth, CRUD for destinations/crew/technology/admins, and activity logs. Point `VITE_API_BASE_URL` to your backend.
- For a fully local setup, ensure your backend runs and CORS is configured for your frontend origin.

---

**Built with React + Vite · Ready for client handover & portfolio**
