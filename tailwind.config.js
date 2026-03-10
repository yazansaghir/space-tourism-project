/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    /* Override default breakpoints to match the exact design spec:
       sm = 600px  (mobile → tablet boundary)
       md = 900px  (tablet → desktop boundary)
       lg = 1100px (desktop → wide boundary) */
    screens: {
      sm: "600px",
      md: "900px",
      lg: "1100px",
    },
    extend: {
      colors: {
        "space-dark": "#0B0D17",
        "space-accent": "#D0D6F9",
      },
      fontFamily: {
        serif: ["'Bellefair'", "serif"],
        "sans-cond": ["'Barlow Condensed'", "sans-serif"],
        sans: ["'Barlow'", "sans-serif"],
      },
      letterSpacing: {
        nav: "2.7px",
        subheading: "4.75px",
        "nav-sm": "2.36px",
      },
      backgroundImage: {
        "home-mobile":
          "url('/assets/home/background-home-mobile.jpg')",
        "home-tablet":
          "url('/assets/home/background-home-tablet.jpg')",
        "home-desktop":
          "url('/assets/home/background-home-desktop.jpg')",
        "destination-mobile":
          "url('/assets/destination/background-destination-mobile.jpg')",
        "destination-tablet":
          "url('/assets/destination/background-destination-tablet.jpg')",
        "destination-desktop":
          "url('/assets/destination/background-destination-desktop.jpg')",
        "crew-mobile":
          "url('/assets/crew/background-crew-mobile.jpg')",
        "crew-tablet":
          "url('/assets/crew/background-crew-tablet.jpg')",
        "crew-desktop":
          "url('/assets/crew/background-crew-desktop.jpg')",
        "technology-mobile":
          "url('/assets/technology/background-technology-mobile.jpg')",
        "technology-tablet":
          "url('/assets/technology/background-technology-tablet.jpg')",
        "technology-desktop":
          "url('/assets/technology/background-technology-desktop.jpg')",
      },
      animation: {
        /* Planet slow rotation on Destination page */
        "spin-slow": "spin 120s linear infinite",
        /* Explore button focus pulse */
        pulsate: "pulsate 1s ease-in-out infinite",
        /* Subtle breathing background for space pages */
        "bg-breathe": "bg-breathe 30s ease-in-out infinite",
      },
      keyframes: {
        pulsate: {
          "0%, 100%": { boxShadow: "none" },
          "50%": { boxShadow: "0 0 0 3.125rem rgba(255,255,255,0.1)" },
        },
        "bg-breathe": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};
