import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import ChatPanel from './ChatPanel';
import useChat from '../../hooks/useChat';

const COOKIE_STORAGE_KEY = 'mauai-cookie-notice-dismissed';

function useCookieVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!localStorage.getItem(COOKIE_STORAGE_KEY));
    } catch {
      setVisible(true);
    }

    const onDismiss = () => setVisible(false);
    const onStorage = (e) => {
      if (e.key === COOKIE_STORAGE_KEY) setVisible(!e.newValue);
    };
    window.addEventListener('mauai-cookie-dismissed', onDismiss);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('mauai-cookie-dismissed', onDismiss);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return visible;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const cookieVisible = useCookieVisible();
  const { messages, options, loading, sending, syncing, error, ready, sendMessage, retry } = useChat({
    isOpen: open,
  });

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      className={`site-chat ${cookieVisible ? 'site-chat--cookie-visible' : ''}`.trim()}
      data-open={open || undefined}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="site-chat__panel-wrap"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChatPanel
              onClose={() => setOpen(false)}
              messages={messages}
              options={options}
              loading={loading}
              sending={sending}
              syncing={syncing}
              error={error}
              ready={ready}
              onSend={sendMessage}
              onRetry={retry}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="site-chat__launcher"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
      >
        <MessageSquare size={22} />
      </button>
    </div>
  );
}
