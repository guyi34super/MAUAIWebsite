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
      // localStorage unavailable
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="site-cookie" role="dialog" aria-label="Cookie notice">
      <p className="site-cookie__text">
        This site does not use tracking cookies. We only store a local preference when you dismiss this notice.{' '}
        <Link to="/privacy">Learn more</Link>
      </p>
      <button type="button" onClick={dismiss} className="site-btn site-btn--primary site-cookie__btn">
        Got it
      </button>
    </div>
  );
}
