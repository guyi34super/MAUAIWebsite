import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getCallCenterPagePath } from '../../content/docs/callCenter';

export default function DocsPrevNext({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <nav className="docs-prev-next" aria-label="Page navigation">
      {prev ? (
        <Link to={getCallCenterPagePath(prev.slug)} className="docs-prev-next__link docs-prev-next__link--prev">
          <ArrowLeft size={16} />
          <span>
            <span className="docs-prev-next__label">Previous</span>
            <span className="docs-prev-next__title">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link to={getCallCenterPagePath(next.slug)} className="docs-prev-next__link docs-prev-next__link--next">
          <span>
            <span className="docs-prev-next__label">Next</span>
            <span className="docs-prev-next__title">{next.title}</span>
          </span>
          <ArrowRight size={16} />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
