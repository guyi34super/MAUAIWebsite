import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteShell from '../layout/SiteShell';
import DocsBodyLayout from '../docs/DocsBodyLayout';

export default function AppLayout() {
  const { pathname } = useLocation();
  const isDocs = pathname.startsWith('/docs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SiteShell
      docsMode={isDocs}
      onDocsMenuClick={isDocs ? () => setSidebarOpen(true) : undefined}
    >
      {isDocs ? (
        <DocsBodyLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
          <Outlet />
        </DocsBodyLayout>
      ) : (
        <Outlet />
      )}
    </SiteShell>
  );
}
