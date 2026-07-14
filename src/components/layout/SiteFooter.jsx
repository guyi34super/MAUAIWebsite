import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <div className="site-footer__links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/docs">Docs</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
