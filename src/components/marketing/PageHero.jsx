import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PageHero({ eyebrow, title, subtitle, actions, children }) {
  return (
    <header className="site-page-hero">
      <div className="site-page-hero__inner">
        {children && <div className="site-page-hero__visual">{children}</div>}
        <div className="site-page-hero__content">
          {eyebrow && <p className="site-page-hero__eyebrow">{eyebrow}</p>}
          <h1 className="site-page-hero__title">{title}</h1>
          {subtitle && <p className="site-page-hero__subtitle">{subtitle}</p>}
          {actions && <div className="site-page-hero__actions">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

export function HeroLink({ to, children, primary = false }) {
  return (
    <Link to={to} className={primary ? 'site-btn site-btn--primary' : 'site-btn site-btn--outline'}>
      {children}
      {primary && <ArrowRight size={15} />}
    </Link>
  );
}
