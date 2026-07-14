import { useEffect, useState } from 'react';

export default function DocsTableOfContents({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    if (!items.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <aside className="docs-toc" aria-label="On this page">
      <p className="docs-toc__title">On this page</p>
      <ul className="docs-toc__list">
        {items.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`docs-toc__link${activeId === id ? ' docs-toc__link--active' : ''}`}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
