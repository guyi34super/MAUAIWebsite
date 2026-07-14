import { Info, Lightbulb, AlertCircle } from 'lucide-react';

const VARIANTS = {
  note: { icon: Info, className: 'docs-callout--note', label: 'Note' },
  tip: { icon: Lightbulb, className: 'docs-callout--tip', label: 'Tip' },
  important: { icon: AlertCircle, className: 'docs-callout--important', label: 'Important' },
};

export default function DocsCallout({ variant = 'note', title, children }) {
  const config = VARIANTS[variant] || VARIANTS.note;
  const Icon = config.icon;

  return (
    <aside className={`docs-callout ${config.className}`}>
      <div className="docs-callout__header">
        <Icon size={16} />
        <span>{title || config.label}</span>
      </div>
      <div className="docs-callout__body">{children}</div>
    </aside>
  );
}
