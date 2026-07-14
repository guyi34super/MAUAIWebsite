import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import useSEO from '../../hooks/useSEO';
import { docsProducts, docsSeo } from '../../content/docs/callCenter';

export default function DocsIndex() {
  useSEO({
    title: docsSeo.hub.title,
    description: docsSeo.hub.description,
    url: docsSeo.hub.url,
  });

  return (
    <div className="docs-hub">
      <header className="docs-hub__header">
        <div className="docs-hub__icon">
          <BookOpen size={28} />
        </div>
        <h1 className="docs-hub__title">Documentation</h1>
        <p className="docs-hub__subtitle">
          Product guides and overviews for MO Intelligence solutions. Select a product to get started.
        </p>
      </header>

      <div className="docs-hub__grid">
        {docsProducts.map(({ slug, title, tagline, description, href }) => (
          <Link key={slug} to={href} className="docs-hub__card">
            <div className="docs-hub__card-header">
              <h2 className="docs-hub__card-title">{title}</h2>
              <span className="docs-hub__card-tagline">{tagline}</span>
            </div>
            <p className="docs-hub__card-desc">{description}</p>
            <span className="docs-hub__card-link">
              View documentation
              <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
