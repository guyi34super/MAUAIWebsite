import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

const NAV_LINKS = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/docs', 'Docs'],
  ['/contact', 'Contact'],
];

export default function SiteHeader({ docsMode = false, onDocsMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [pathname]);

  const isActive = (to) =>
    to === '/docs' ? pathname.startsWith('/docs') : pathname === to;

  const toggleMenu = () => {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__left">
          {docsMode && onDocsMenuClick && (
            <button
              type="button"
              className="site-header__menu-btn"
              onClick={onDocsMenuClick}
              aria-label="Open documentation menu"
            >
              <Menu size={18} />
            </button>
          )}
          <Logo size="sm" />
          {docsMode && (
            <>
              <span className="site-header__divider" aria-hidden="true" />
              <Link to="/docs" className="site-header__docs-label">Docs</Link>
            </>
          )}
        </div>

        <nav className="site-header__nav" aria-label="Main">
          <ul className="site-header__links">
            {NAV_LINKS.map(([to, label]) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`site-header__link${isActive(to) ? ' site-header__link--active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          {!docsMode && (
            <Link to="/contact" className="site-header__cta">Get Started</Link>
          )}
          {docsMode && (
            <Link to="/" className="site-header__back" aria-label="Back to site">
              <ArrowLeft size={14} />
              <span className="site-header__back-text">Back to site</span>
            </Link>
          )}
          <button
            type="button"
            className="site-header__mobile-btn"
            onClick={toggleMenu}
            aria-label="Menu"
            style={docsMode ? { display: 'none' } : undefined}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {menuOpen && !docsMode && (
        <>
          <button type="button" className="site-header__overlay" onClick={toggleMenu} aria-label="Close menu" />
          <nav className="site-header__mobile-nav" aria-label="Mobile">
            {NAV_LINKS.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={`site-header__mobile-link${isActive(to) ? ' site-header__mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link to="/contact" className="site-btn site-btn--primary site-header__mobile-cta" onClick={() => setMenuOpen(false)}>
              Get Started
            </Link>
          </nav>
        </>
      )}
    </header>
  );
}
