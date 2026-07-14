import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FeatureGrid({ items, columns = 3, linkPrefix }) {
  return (
    <div className={`site-feature-grid site-feature-grid--${columns}`}>
      {items.map(({ Icon, title, desc, tagline, href, features }) => {
        const inner = (
          <>
            {Icon && (
              <div className="site-feature-card__icon">
                <Icon size={20} />
              </div>
            )}
            <h3 className="site-feature-card__title">{title}</h3>
            {tagline && <p className="site-feature-card__tagline">{tagline}</p>}
            {desc && <p className="site-feature-card__desc">{desc}</p>}
            {features && (
              <ul className="site-feature-card__list">
                {features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
            {href && (
              <span className="site-feature-card__link">
                Learn more <ArrowRight size={14} />
              </span>
            )}
          </>
        );

        const className = 'site-feature-card';
        if (href) {
          return (
            <Link key={title} to={href} className={`${className} site-feature-card--link`}>
              {inner}
            </Link>
          );
        }
        return (
          <div key={title} className={className}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}
