import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Logo({ size = 'md' }) {
  const s = size === 'sm' ? 34 : 40;
  return (
    <Link to="/" className="flex items-center gap-3 no-underline">
      <svg width={s} height={s} viewBox="0 0 42 42" fill="none">
        <rect x="1" y="1" width="40" height="40" rx="9"
          fill="rgba(0,212,255,0.07)" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
        <path d="M8 32 L8 12 L21 26 L34 12 L34 32"
          fill="none" stroke="white" strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" />
        <path d="M14 37 L21 30 L28 37 Z" fill="#00d4ff" />
      </svg>
      <div className="flex flex-col">
        <span style={{
          fontWeight: 800,
          letterSpacing: '3px',
          fontSize: size === 'sm' ? '1.1rem' : '1.3rem',
          color: 'white',
          lineHeight: 1,
        }}>
          MAU<span style={{ fontSize: size === 'sm' ? '0.72rem' : '0.82rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', verticalAlign: 'super' }}>ai</span>
        </span>
        <span style={{ fontSize: '0.46rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>
          INTELLIGENCE THAT WORKS
        </span>
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

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300"
        style={{
          padding: scrolled ? '13px 56px' : '22px 56px',
          background: scrolled ? 'rgba(5,5,8,0.94)' : 'rgba(5,5,8,0.55)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        }}
      >
        <Logo />

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10 list-none">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="relative text-sm font-medium transition-colors duration-200 no-underline"
                style={{
                  color: pathname === to ? '#fff' : 'rgba(255,255,255,0.56)',
                  paddingBottom: '4px',
                }}
              >
                {label}
                {pathname === to && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-0 bottom-0 w-full"
                    style={{ height: 1, background: '#00d4ff' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/contact"
            className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-bold tracking-wide no-underline"
            style={{ letterSpacing: '1px' }}
          >
            Get Started
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden z-50 p-2 rounded-lg transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10"
            style={{ background: 'rgba(5,5,8,0.98)' }}
          >
            {links.map(({ to, label }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={to}
                  className="no-underline"
                  style={{
                    fontSize: '1.7rem',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    color: pathname === to ? '#00d4ff' : '#fff',
                  }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
              <Link to="/contact" className="btn-gradient rounded-xl px-10 py-4 text-base font-bold no-underline" style={{ letterSpacing: '1px' }}>
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
