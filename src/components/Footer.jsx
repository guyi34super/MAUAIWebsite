import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { Logo } from './Navbar';

export default function Footer() {
  return (
    <footer className="relative z-10" style={{ background: '#08080f', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="max-w-6xl mx-auto px-14 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="sm" />
            <p className="mt-5 text-sm leading-7" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 300 }}>
              Transforming Mauritian businesses through practical, measurable
              artificial intelligence solutions that create real results.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <Mail size={14} color="rgba(0,212,255,0.7)" />
              <a href="mailto:team.mau.ai@gmail.com" className="text-sm no-underline transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                team.mau.ai@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <MapPin size={14} color="rgba(0,212,255,0.7)" />
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Mauritius 🇲🇺</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-5 text-xs font-bold tracking-widest uppercase" style={{ color: '#00d4ff' }}>Navigation</h4>
            <ul className="flex flex-col gap-3 list-none">
              {[['/', 'Home'], ['/services', 'Services'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm no-underline transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 text-xs font-bold tracking-widest uppercase" style={{ color: '#00d4ff' }}>Services</h4>
            <ul className="flex flex-col gap-3 list-none">
              {['AI Chatbot', 'AI Receptionist', 'Custom AI', 'AI Website', 'AI Marketing', 'Voice AI'].map(s => (
                <li key={s}>
                  <Link to="/services" className="text-sm no-underline transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-7">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            &copy; {new Date().getFullYear()} MAU AI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Intelligence That Works — Mauritius
          </p>
        </div>
      </div>
    </footer>
  );
}
