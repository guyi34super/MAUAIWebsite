import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MESSAGES = [
  "Hi! I'm MO",
  'Looking for AI for your business?',
  'Peek at our Services',
  'Got questions? Hit Contact',
  'Read the Docs to learn more',
];

const INTERVAL_MS = 3500;

export default function SpeechBubble({ messages = MESSAGES, className = '' }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className={`robot-speech ${className}`.trim()} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="robot-speech__bubble"
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {messages[index]}
          <span className="robot-speech__tail" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
