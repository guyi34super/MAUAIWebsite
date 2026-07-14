import { Link, useLocation } from 'react-router-dom';
import { callCenterNav, getCallCenterPagePath } from '../../content/docs/callCenter';

export default function DocsSidebar({ onNavigate }) {
  const { pathname } = useLocation();

  const isActive = (slug) => {
    const path = getCallCenterPagePath(slug);
    return pathname === path;
  };

  return (
    <nav className="docs-sidebar__nav" aria-label="Documentation">
      <Link to="/docs" className="docs-sidebar__home" onClick={onNavigate}>
        Documentation
      </Link>

      <div className="docs-sidebar__group">
        <Link
          to={getCallCenterPagePath('')}
          className={`docs-sidebar__product${pathname.startsWith('/docs/call-center') ? ' docs-sidebar__product--active' : ''}`}
          onClick={onNavigate}
        >
          {callCenterNav.product}
        </Link>
        <p className="docs-sidebar__tagline">{callCenterNav.tagline}</p>
        <ul className="docs-sidebar__pages">
          {callCenterNav.pages.map(({ slug, navTitle }) => (
            <li key={slug || 'overview'}>
              <Link
                to={getCallCenterPagePath(slug)}
                className={`docs-sidebar__link${isActive(slug) ? ' docs-sidebar__link--active' : ''}`}
                onClick={onNavigate}
              >
                {navTitle}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
