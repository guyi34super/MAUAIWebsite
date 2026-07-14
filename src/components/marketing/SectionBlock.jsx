export default function SectionBlock({ id, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`site-section ${className}`.trim()}>
      <div className="site-section__inner">
        {(title || subtitle) && (
          <header className="site-section__header">
            {title && <h2 className="site-section__title">{title}</h2>}
            {subtitle && <p className="site-section__subtitle">{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
