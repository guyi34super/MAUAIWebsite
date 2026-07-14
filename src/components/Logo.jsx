import { Link } from 'react-router-dom';
import { BRAND } from '../config/brand';
import BrandLogoText from './BrandLogoText';

export default function Logo({ size = 'md', variant = 'light' }) {
  const logoHeight = size === 'sm' ? 32 : 38;

  return (
    <Link to="/" className="site-logo no-underline">
      <img
        src="/logo-mu.png"
        alt={BRAND.name}
        style={{ height: logoHeight, width: 'auto', objectFit: 'contain', flexShrink: 0 }}
      />
      <span className="site-logo__text">
        <BrandLogoText variant={variant} size={size} />
      </span>
    </Link>
  );
}
