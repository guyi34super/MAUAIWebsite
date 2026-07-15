import { Link, useLocation } from 'react-router-dom';
import { docsNavProducts } from '../../content/docs/registry';

export default function DocsSidebar({ onNavigate, getPagePath }) {
  const { pathname } = useLocation();

  return (
    <nav className="docs-sidebar__nav" aria-label="Documentation">
      <Link to="/docs" className="docs-sidebar__home" onClick={onNavigate}>
        Documentation
      </Link>

      {docsNavProducts.map((nav) => {
        const basePath = getPagePath(nav, '');
        const isProductActive = pathname.startsWith(basePath);

        return (
          <div key={nav.slug} className="docs-sidebar__group">
            <Link
              to={basePath}
              className={`docs-sidebar__product${isProductActive ? ' docs-sidebar__product--active' : ''}`}
              onClick={onNavigate}
            >
              {nav.product}
            </Link>
            <p className="docs-sidebar__tagline">{nav.tagline}</p>
            <ul className="docs-sidebar__pages">
              {nav.pages.map(({ slug, navTitle }) => {
                const path = getPagePath(nav, slug);
                return (
                  <li key={slug || 'overview'}>
                    <Link
                      to={path}
                      className={`docs-sidebar__link${pathname === path ? ' docs-sidebar__link--active' : ''}`}
                      onClick={onNavigate}
                    >
                      {navTitle}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
