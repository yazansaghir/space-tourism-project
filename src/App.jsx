import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./layouts/Layout";
import Home from "./pages/Home/Home";
import Destination from "./pages/Destination/Destination";
import Crew from "./pages/Crew/Crew";
import Technology from "./pages/Technology/Technology";
import Preloader from "./components/Preloader";
import "./App.css";

const PRELOAD_DURATION_MS = 2500;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), PRELOAD_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="destination" element={<Destination />} />
            <Route path="crew" element={<Crew />} />
            <Route path="technology" element={<Technology />} />
          </Route>
        </Routes>
      </Router>
      <AnimatePresence>
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>
    </>
  );
}

export default App;
