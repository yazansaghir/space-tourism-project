# 🚀 Space Tourism Website

A premium, fully-animated Space Tourism web application built with React, Vite, Framer Motion, and a pixel-perfect design system.

## ✨ Features

### 🎬 High-End Animations
- **Preloader** - Sci-fi loading sequence with percentage counter and progress bar (2.5s)
- **Page Transitions** - Smooth fade & slide animations between routes using Framer Motion
- **Sidebar** - Buttery-smooth slide-in navigation with backdrop blur and spring physics
- **Component Animations** - Staggered text reveals, image step-ins, and carousel auto-play

### 🎨 Design System
- **CSS Variables** - Centralized design tokens for colors, fonts, and spacing
- **Typography** - Three-font system (Bellefair serif, Barlow Condensed, Barlow)
- **Color Palette** - Deep space dark (#0B0D17), light blue accent (#D0D6F9), pure white
- **Responsive** - Mobile-first design with tablet and desktop breakpoints

### 🧭 Navigation
- **Desktop Navbar** - Horizontal navigation with active state indicators and hover effects
- **Mobile Sidebar** - Slide-in menu with backdrop, click-outside-to-close, and Escape key support
- **Dynamic Titles** - Browser tab titles update per route (e.g., "Space Tourism | Crew")

### 📄 Pages

#### Home (`/`)
- Hero section with "Explore" CTA
- Two-column grid layout (desktop) / stacked (mobile)
- Animated explore button with hover ring effect

#### Destination (`/destination`)
- 4 Planets: Moon, Mars, Europa, Titan
- Tab navigation with smooth content transitions
- Displays: planet image (spinning animation), description, distance, travel time
- **Layout:** Image left, content right (desktop) | Stacked (mobile)

#### Crew (`/crew`)
- 4 Crew Members with roles, names, bios, and images
- Dot navigation with auto-play carousel (6s interval, pause on hover)
- Staggered text animations (role → name → bio)
- Image "step-in" animation from bottom
- **Layout:** Text left, image right at bottom (desktop) | Image top → dots → text (mobile)

#### Technology (`/technology`)
- 3 Technologies: Launch Vehicle, Spaceport, Space Capsule
- Numbered circle navigation (1, 2, 3)
- Responsive images (portrait for desktop, landscape for mobile/tablet)
- **Layout:** Numbers | Text | Image flush-right (desktop) | Image → Numbers → Text (mobile)

## 🏗️ Project Structure

```
React-js/
├── src/
│   ├── components/
│   │   ├── Preloader.jsx           # Sci-fi loading screen
│   │   ├── Preloader.css
│   │   ├── Navigation/
│   │   │   ├── Navbar.jsx          # Desktop navigation
│   │   │   ├── Navbar.css
│   │   │   ├── Sidebar.jsx         # Mobile slide-in menu
│   │   │   └── Sidebar.css
│   │   ├── Destination/
│   │   │   ├── DestinationNav.jsx  # Planet tabs
│   │   │   └── DestinationNav.css
│   │   ├── Crew/
│   │   │   ├── CrewDots.jsx        # Dot pagination
│   │   │   └── CrewDots.css
│   │   └── Technology/
│   │       ├── TechNumbers.jsx     # Numbered navigation
│   │       └── TechNumbers.css
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── Destination/
│   │   │   ├── Destination.jsx
│   │   │   └── Destination.css
│   │   ├── Crew/
│   │   │   ├── Crew.jsx
│   │   │   └── Crew.css
│   │   └── Technology/
│   │       ├── Technology.jsx
│   │       └── Technology.css
│   ├── layouts/
│   │   ├── Layout.jsx              # Main layout with page transitions
│   │   └── Layout.css
│   ├── hooks/
│   │   └── useDocumentTitle.js     # Dynamic browser tab titles
│   ├── data/
│   │   └── data.json               # All content (destinations, crew, tech)
│   ├── App.jsx                     # Router + Preloader logic
│   ├── App.css
│   ├── main.jsx
│   └── index.css                   # Global design system
├── public/
│   └── assets/                     # Images for all pages
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **React Router 6** - Client-side routing
- **Framer Motion** - Production-ready animation library
- **CSS Variables** - Design system with semantic tokens

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Key Implementation Details

### Animation System
- **Preloader:** `requestAnimationFrame` for smooth 0-100% counter
- **Page Transitions:** `AnimatePresence mode="wait"` with `location.pathname` key
- **Sidebar:** Spring physics (`stiffness: 200`, `damping: 28`) for natural feel
- **Crew Auto-Play:** `setInterval` with pause-on-hover via `onMouseEnter`/`onMouseLeave`

### Responsive Strategy
- **Breakpoints:** Mobile (<37.5em), Tablet (37.5-56.25em), Desktop (>56.26em)
- **Crew Layout:** Different order on mobile (Image → Dots → Text) vs tablet (Text → Dots → Image)
- **Technology:** Portrait images (desktop) vs landscape (mobile/tablet)
- **Flexbox Order:** Used for mobile reordering without DOM changes

### Design Tokens (CSS Variables)
```css
:root {
  --font-serif: 'Bellefair', serif;
  --font-sans-cond: 'Barlow Condensed', sans-serif;
  --font-sans: 'Barlow', sans-serif;
  --color-dark: 11 13 23;       /* #0B0D17 */
  --color-light: 208 214 249;   /* #D0D6F9 */
  --color-white: 255 255 255;   /* #FFFFFF */
}
```

### UX Enhancements
- **Click Outside:** Sidebar closes when clicking backdrop
- **Escape Key:** Closes sidebar for keyboard users
- **Auto-Play Pause:** Crew carousel pauses on hover for readability
- **Keyboard Navigation:** Arrow keys navigate crew members
- **Image Preloading:** Destinations preload all planet images on mount
- **Accessible Navigation:** ARIA labels, roles, and semantic HTML

## 🎨 Styling Philosophy

- **Component-Scoped CSS** - Each component has its own CSS file
- **BEM-like Naming** - `.crew__role`, `.destination__image-wrap`
- **Design System First** - All colors/fonts use CSS variables
- **No Inline Styles** - Clean separation of concerns
- **Responsive Utilities** - Clamp for fluid typography and spacing

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 37.5em)   /* 600px */

/* Tablet */
@media (min-width: 37.51em) and (max-width: 56.25em)  /* 601-900px */

/* Desktop */
@media (min-width: 56.26em)  /* 901px+ */
```

## 🚀 Performance Optimizations

- **Code Splitting** - React Router lazy loading ready
- **Image Optimization** - WebP with PNG fallback
- **Framer Motion** - Hardware-accelerated transforms
- **CSS Variables** - No runtime JS for theming
- **Minimal Dependencies** - Only essential libraries

## 🧪 Code Quality

- **Clean Architecture** - Separation of pages, components, layouts, hooks
- **Reusable Components** - DestinationNav, CrewDots, TechNumbers
- **DRY Principles** - No duplicate CSS, consolidated design tokens
- **Semantic HTML** - Proper use of nav, main, section, article
- **Linter-Clean** - No console logs, no unused imports

## 🎓 Learning Resources

This project demonstrates:
- Advanced Framer Motion patterns (stagger, variants, AnimatePresence)
- React Router 6 nested routes and layouts
- Custom hooks (useDocumentTitle)
- Complex responsive layouts (flexbox order, grid)
- State management with useState and useRef
- Event handling (keyboard, mouse, timers)

## 📝 Notes

- **Fonts:** Loaded via Google Fonts CDN
- **Images:** All assets in `/public/assets/` with organized subfolders
- **Data:** Centralized in `data.json` for easy content updates
- **Animations:** All framer-motion props preserved for smooth UX
- **Accessibility:** ARIA labels, keyboard support, semantic markup

## 🔮 Future Enhancements

- [ ] Add unit tests (Vitest + React Testing Library)
- [ ] Implement error boundaries
- [ ] Add loading skeletons for images
- [ ] Optimize bundle size with lazy loading
- [ ] Add PWA support (service worker, manifest)
- [ ] Implement dark/light mode toggle
- [ ] Add analytics integration
- [ ] Create Storybook for component documentation

## 📄 License

This project is part of a Frontend Mentor challenge.

---

Built with ❤️ using React, Framer Motion, and modern web standards.
