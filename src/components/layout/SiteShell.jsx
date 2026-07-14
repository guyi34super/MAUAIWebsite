import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function SiteShell({ children, docsMode = false, onDocsMenuClick }) {
  return (
    <div className="site-shell">
      <SiteHeader docsMode={docsMode} onDocsMenuClick={onDocsMenuClick} />
      <div className="site-shell__main">{children}</div>
      <SiteFooter />
    </div>
  );
}
