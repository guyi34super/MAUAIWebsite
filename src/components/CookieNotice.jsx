import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'mauai-cookie-notice-dismissed';

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // localStorage unavailable — hide for this session only
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4"
      style={{
        background: '#0d0d12',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
      }}
      role="dialog"
      aria-label="Cookie notice"
    >
      <p className="text-sm leading-6" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: 640 }}>
        This site does not use tracking cookies. We only store a local preference when you dismiss this notice.{' '}
        <Link to="/privacy" className="underline" style={{ color: 'white' }}>Learn more</Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="flex-shrink-0 rounded-lg px-5 py-2.5 text-sm font-bold"
        style={{ background: 'white', color: '#0d0d12', border: 'none', cursor: 'pointer' }}
      >
        Got it
      </button>
    </div>
  );
}
