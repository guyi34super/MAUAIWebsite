import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Robot from './Robot';

const MIN_DISPLAY_MS = 1800;

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.round(Math.min(elapsed / MIN_DISPLAY_MS, 1) * 100));

      if (elapsed < MIN_DISPLAY_MS) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setFadeOut(true);
      }
    };

    frame = requestAnimationFrame(tick);

    const done = setTimeout(() => {
      onCompleteRef.current();
    }, MIN_DISPLAY_MS + 700);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
    };
  }, []);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
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
  );
}
