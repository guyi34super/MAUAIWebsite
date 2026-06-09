import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleCanvas from './components/ParticleCanvas';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import CookieNotice from './components/CookieNotice';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }) {
  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
      <CookieNotice />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const handleLoadComplete = useCallback(() => setLoading(false), []);

  useEffect(() => {
    const fallback = setTimeout(handleLoadComplete, 3000);
    return () => clearTimeout(fallback);
  }, [handleLoadComplete]);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}
