import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Logo({ size = 'md', variant = 'light' }) {
  const isDark = variant === 'dark';
  const mainSize = size === 'sm' ? '1.1rem' : '1.25rem';
  const aiSize = size === 'sm' ? '0.7rem' : '0.8rem';
  const taglineSize = isDark ? '0.42rem' : '0.44rem';
  const logoHeight = size === 'sm' ? 32 : 38;

  return (
    <Link to="/" className="flex items-center gap-3 no-underline">
      <img
        src="/logo-mu.png"
        alt="MAU AI"
        style={{ height: logoHeight, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
      />
      <div className="flex flex-col">
        <span style={{
          fontWeight: 800,
          letterSpacing: '3px',
          fontSize: mainSize,
          color: isDark ? 'white' : '#0d0d12',
          lineHeight: 1,
        }}>
          MAU<span style={{
            fontSize: aiSize,
            fontWeight: 400,
            color: isDark ? 'rgba(255,255,255,0.5)' : '#888',
            letterSpacing: '1px',
            verticalAlign: 'super',
          }}>ai</span>
        </span>
        <span style={{
          fontSize: taglineSize,
          letterSpacing: isDark ? '3px' : '3.5px',
          color: isDark ? 'rgba(255,255,255,0.35)' : '#aaa',
          marginTop: 2,
        }}>INTELLIGENCE THAT WORKS</span>
      </div>
    </Link>
  );
}

export { Logo };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  const toggle = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const links = [['/', 'Home'], ['/services', 'Services'], ['/contact', 'Contact']];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
        style={{
          padding: scrolled ? '12px 56px' : '20px 56px',
          background: scrolled ? 'rgba(250,250,250,0.95)' : 'rgba(250,250,250,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #e8e8ec' : '1px solid transparent',
        }}
      >
        <Logo />

        <ul className="hidden md:flex items-center gap-10 list-none">
          {links.map(([to, label]) => (
            <li key={to}>
              <Link to={to} className="relative text-sm font-semibold no-underline transition-colors"
                style={{ color: pathname === to ? '#0d0d12' : '#6b7280', paddingBottom: 4 }}>
                {label}
                {pathname === to && (
                  <motion.span layoutId="nav-ul"
                    className="absolute left-0 bottom-0 w-full"
                    style={{ height: 1.5, background: '#0d0d12' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex">
          <Link to="/contact"
            className="btn-primary rounded-lg px-6 py-2.5 text-sm no-underline"
            style={{ letterSpacing: '0.5px' }}>
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ background: '#f0f0f4', border: '1px solid #e0e0e8', color: '#0d0d12', cursor: 'pointer' }}
          onClick={toggle} aria-label="Menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
            style={{ background: 'rgba(250,250,250,0.98)' }}>
            {links.map(([to, label], i) => (
              <motion.div key={to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Link to={to} className="no-underline font-black"
                  style={{ fontSize: '1.8rem', letterSpacing: '1px', color: pathname === to ? '#0d0d12' : '#6b7280' }}>
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
              <Link to="/contact" className="btn-primary rounded-xl px-10 py-4 text-sm no-underline font-bold" style={{ letterSpacing: '0.5px' }}>
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
