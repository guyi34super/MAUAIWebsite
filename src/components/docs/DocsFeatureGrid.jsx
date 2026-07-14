import {
  Phone,
  LayoutDashboard,
  Activity,
  History,
  Receipt,
  BarChart3,
} from 'lucide-react';

const ICONS = {
  Phone,
  LayoutDashboard,
  Activity,
  History,
  Receipt,
  BarChart3,
};

export default function DocsFeatureGrid({ features }) {
  return (
    <div className="docs-feature-grid">
      {features.map(({ id, title, description, icon }) => {
        const Icon = ICONS[icon] || Phone;
        return (
          <article key={id} id={id} className="docs-feature-card">
            <div className="docs-feature-card__icon">
              <Icon size={20} />
            </div>
            <h3 className="docs-feature-card__title">{title}</h3>
            <p className="docs-feature-card__desc">{description}</p>
          </article>
        );
      })}
    </div>
  );
}
