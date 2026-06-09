import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { Logo } from './Navbar';

export default function Footer() {
  return (
    <footer className="relative z-10" style={{ background: '#0d0d12', color: '#fff' }}>
      <div className="max-w-6xl mx-auto px-14 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="md:col-span-2">
            {/* Footer logo (white version) */}
            <Link to="/" className="flex items-center gap-3 no-underline">
              <svg width="34" height="34" viewBox="0 0 42 42" fill="none">
                <rect x="1" y="1" width="40" height="40" rx="9" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <path d="M9 31 L9 13 L21 25 L33 13 L33 31" fill="none" stroke="white" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
                <path d="M15 36 L21 30 L27 36 Z" fill="#ff4757" />
              </svg>
              <div className="flex flex-col">
                <span style={{ fontWeight: 800, letterSpacing: '3px', fontSize: '1.1rem', color: 'white', lineHeight: 1 }}>
                  MAU<span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)', verticalAlign: 'super', letterSpacing: '1px' }}>ai</span>
                </span>
                <span style={{ fontSize: '0.42rem', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>INTELLIGENCE THAT WORKS</span>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-7" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: 280 }}>
              Transforming Mauritian businesses through practical, measurable AI solutions.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <Mail size={13} color="rgba(255,255,255,0.4)" />
              <a href="mailto:team.mau.ai@gmail.com" className="text-sm no-underline transition-colors"
                style={{ color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                team.mau.ai@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={13} color="rgba(255,255,255,0.4)" />
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Mauritius 🇲🇺</span>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Navigation</h4>
            <ul className="flex flex-col gap-3 list-none">
              {[['/', 'Home'], ['/services', 'Services'], ['/contact', 'Contact']].map(([to, l]) => (
                <li key={to}>
                  <Link to={to} className="text-sm no-underline transition-colors"
                    style={{ color: 'rgba(255,255,255,0.42)' }}
                    onMouseEnter={e => e.target.style.color = 'white'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.42)'}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Services</h4>
            <ul className="flex flex-col gap-3 list-none">
              {['AI Chatbot', 'AI Receptionist', 'Custom AI', 'AI Website', 'AI Marketing', 'Voice AI'].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-sm no-underline transition-colors"
                    style={{ color: 'rgba(255,255,255,0.42)' }}
                    onMouseEnter={e => e.target.style.color = 'white'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.42)'}>{s}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-7">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            &copy; {new Date().getFullYear()} MAU AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs no-underline transition-colors"
              style={{ color: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}>
              Privacy Policy
            </Link>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Intelligence That Works — Mauritius
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
