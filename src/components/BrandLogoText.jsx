import { BRAND } from '../config/brand';

const SIZES = {
  sm: { line1: '1.1rem', line2: '0.72rem' },
  md: { line1: '1.25rem', line2: '0.82rem' },
  lg: { line1: '1.5rem', line2: '0.95rem' },
};

export default function BrandLogoText({ variant = 'light', size = 'md', className = '' }) {
  const isDark = variant === 'dark';
  const { line1, line2 } = SIZES[size] ?? SIZES.md;

  const line1Color = isDark ? 'white' : '#0d0d12';
  const line2BoldColor = isDark ? 'rgba(255,255,255,0.9)' : '#0d0d12';
  const line2RestColor = isDark ? 'rgba(255,255,255,0.55)' : '#666';

  return (
    <div className={`flex flex-col ${className}`}>
      <span
        style={{
          fontWeight: 800,
          letterSpacing: '1px',
          fontSize: line1,
          color: line1Color,
          lineHeight: 1.1,
        }}
      >
        {BRAND.logo.line1}
      </span>
      <span
        style={{
          fontSize: line2,
          letterSpacing: '0.3px',
          lineHeight: 1.2,
          marginTop: size === 'lg' ? 4 : 2,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        <span style={{ fontWeight: 800, color: line2BoldColor }}>{BRAND.logo.line2Bold}</span>
        <span style={{ fontWeight: 500, color: line2RestColor }}>{BRAND.logo.line2Rest}</span>
      </span>
    </div>
  );
}
