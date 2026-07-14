import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaBand({ title, description, primaryLabel = 'Get Started', primaryTo = '/contact', secondaryLabel, secondaryTo }) {
  return (
    <section className="site-cta">
      <div className="site-cta__inner">
        <h2 className="site-cta__title">{title}</h2>
        {description && <p className="site-cta__desc">{description}</p>}
        <div className="site-cta__actions">
          <Link to={primaryTo} className="site-btn site-btn--primary">
            {primaryLabel} <ArrowRight size={15} />
          </Link>
          {secondaryLabel && secondaryTo && (
            <Link to={secondaryTo} className="site-btn site-btn--outline">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
