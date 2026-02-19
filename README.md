# Space Tourism Website - React Application

A modern, responsive Space Tourism website built with React, Vite, and React Router.

## 🚀 Project Structure

```
React-js/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation component with mobile menu
│   │   └── Navbar.css
│   ├── layouts/             # Layout components
│   │   ├── Layout.jsx       # Main layout wrapper with Navbar
│   │   └── Layout.css
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Home.css
│   │   ├── Destination.jsx  # Destination selection (4 planets)
│   │   ├── Destination.css
│   │   ├── Crew.jsx         # Crew members (4 members, dot navigation)
│   │   ├── Crew.css
│   │   ├── Technology.jsx   # Technology info (3 items, numbered navigation)
│   │   └── Technology.css
│   ├── data/                # Application data
│   │   └── data.js          # Destinations, crew, and technology data
│   ├── App.jsx              # Main app with routing setup
│   ├── App.css
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets (images, icons)
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Features

### Routing
- **Home** (`/`) - Landing page with "Explore" CTA
- **Destination** (`/destination`) - Interactive planet selection (Moon, Mars, Europa, Titan)
- **Crew** (`/crew`) - Meet the crew with dot navigation (4 members)
- **Technology** (`/technology`) - Space technology with numbered navigation (3 items)

### Components Architecture

#### Layout Component
- Wraps all pages
- Contains the shared Navbar
- Uses React Router's `<Outlet />` for nested routing

#### Navbar Component
- Desktop navigation with hover effects
- Mobile hamburger menu
- Active route highlighting using `NavLink`
- Responsive design with backdrop blur effect

#### Page Components

**Destination Page:**
- Tab-based navigation for 4 planets
- Dynamic content switching with `useState`
- Displays: name, description, distance, travel time, and image

**Crew Page:**
- Dot navigation for 4 crew members
- State management for selected crew member
- Displays: role, name, bio, and image

**Technology Page:**
- Numbered button navigation (1, 2, 3)
- State management for selected technology
- Displays: name, description, and responsive images (portrait/landscape)

### Data Structure

All content is centralized in `src/data/data.js`:
- `destinations[]` - 4 planet objects
- `crew[]` - 4 crew member objects
- `technology[]` - 3 technology objects

## 🛠️ Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📦 Dependencies

- **React** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server

## 🎨 Styling Approach

- Component-scoped CSS files
- Responsive design with media queries
- Mobile-first approach
- CSS custom properties for theming (ready for implementation)

## 🔄 State Management

Currently using React's built-in `useState` for:
- Selected destination/planet
- Selected crew member (by index)
- Selected technology (by index)
- Mobile menu open/closed state

## 📱 Responsive Breakpoints

- Desktop: > 1100px
- Tablet: 768px - 1100px
- Mobile: < 768px

## 🚧 Next Steps for Styling

1. Copy assets folder from the original project to `public/assets/`
2. Fine-tune spacing and typography
3. Add transitions and animations
4. Implement accessibility features (ARIA labels, keyboard navigation)
5. Add loading states for images
6. Optimize performance with lazy loading

## 📝 Notes

- All background images are referenced from `/assets/` in public folder
- Font families: Barlow Condensed, Barlow, Bellefair (loaded via Google Fonts)
- Clean architecture ready for scaling and adding more features
- Easy to migrate to state management libraries (Redux, Zustand) if needed

## 🎯 Development Best Practices

- Component-based architecture
- Separation of concerns (data, components, pages, layouts)
- Reusable and maintainable code
- Semantic HTML
- Accessible navigation patterns
