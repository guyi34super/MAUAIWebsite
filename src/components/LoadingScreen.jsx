import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Robot from './Robot';

const MIN_DISPLAY_MS = 2200;

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      const loaded = document.readyState === 'complete';
      const timeProgress = Math.min(elapsed / MIN_DISPLAY_MS, 1);
      const loadProgress = loaded ? 1 : Math.min(elapsed / (MIN_DISPLAY_MS * 1.4), 0.85);
      setProgress(Math.round(Math.max(timeProgress, loadProgress) * 100));

      if (!loaded || elapsed < MIN_DISPLAY_MS) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setVisible(false);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="loading-screen__glow" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="loading-screen__content"
          >
            <Robot waving interactive={false} />

            <div className="loading-screen__text">
              <p className="loading-screen__brand">MAU AI</p>
              <p className="loading-screen__tagline">Intelligence That Works</p>
            </div>

            <div className="loading-screen__progress">
              <div className="loading-screen__progress-track">
                <motion.div
                  className="loading-screen__progress-bar"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>
              <p className="loading-screen__status">
                {progress < 100 ? 'Warming up…' : 'Ready'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
