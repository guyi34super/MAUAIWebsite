import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import DocsSidebar from './DocsSidebar';

export default function DocsBodyLayout({ children, sidebarOpen, setSidebarOpen }) {
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="docs-layout">
      <aside className={`docs-sidebar${sidebarOpen ? ' docs-sidebar--open' : ''}`}>
        <div className="docs-sidebar__mobile-header">
          <span className="docs-sidebar__mobile-title">Documentation</span>
          <button
            type="button"
            className="docs-sidebar__close"
            onClick={closeSidebar}
            aria-label="Close documentation menu"
          >
            <X size={18} />
          </button>
        </div>
        <DocsSidebar onNavigate={closeSidebar} />
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="docs-sidebar__overlay"
          onClick={closeSidebar}
          aria-label="Close documentation menu"
        />
      )}

      <div className="docs-main">{children}</div>
    </div>
  );
}
