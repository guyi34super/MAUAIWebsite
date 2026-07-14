import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function DocsBreadcrumb({ items }) {
  return (
    <nav className="docs-breadcrumb" aria-label="Breadcrumb">
      <ol className="docs-breadcrumb__list">
        {items.map((item, i) => (
          <li key={item.label} className="docs-breadcrumb__item">
            {i > 0 && <ChevronRight size={14} className="docs-breadcrumb__sep" aria-hidden="true" />}
            {item.href ? (
              <Link to={item.href} className="docs-breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span className="docs-breadcrumb__current" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
