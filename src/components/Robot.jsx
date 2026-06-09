import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function Robot() {
  const containerRef = useRef(null);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [blink, setBlink] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 500);
    const f = dist / 500;
    const angle = Math.atan2(dy, dx);
    setEye({ x: Math.cos(angle) * f * 7, y: Math.sin(angle) * f * 5 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    // Periodic blink
    const blinker = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3500 + Math.random() * 2000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinker);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center select-none"
      style={{ width: 420, height: 520 }}
    >
      {/* Soft shadow underneath robot */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{ width: 220, height: 28, background: 'rgba(0,0,0,0.1)', filter: 'blur(16px)' }} />

      {/* Orbit rings */}
      <div className="orbit-ring absolute pointer-events-none" style={{ width: 380, height: 380 }}>
        <div style={{ position: 'absolute', top: -3.5, left: '50%', transform: 'translateX(-50%)', width: 7, height: 7, borderRadius: '50%', background: '#888', opacity: 0.5 }} />
      </div>
      <div className="orbit-ring orbit-ring-2 absolute pointer-events-none" style={{ width: 470, height: 470 }}>
        <div style={{ position: 'absolute', bottom: -3, right: '24%', width: 6, height: 6, borderRadius: '50%', background: '#aaa', opacity: 0.4 }} />
      </div>

      {/* Robot SVG */}
      <motion.svg
        width="300" height="420"
        viewBox="0 0 300 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 2, cursor: 'pointer', filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.14))' }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => { setClicked(true); setTimeout(() => setClicked(false), 380); }}
        whileHover={{ filter: 'drop-shadow(0 22px 55px rgba(0,0,0,0.22))' }}
      >
        <defs>
          {/* Rainbow gradient for head top strip */}
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"    stopColor="#ff4757" />
            <stop offset="14%"   stopColor="#ff6b35" />
            <stop offset="28%"   stopColor="#ffd32a" />
            <stop offset="42%"   stopColor="#0be881" />
            <stop offset="57%"   stopColor="#00d2d3" />
            <stop offset="72%"   stopColor="#1e90ff" />
            <stop offset="86%"   stopColor="#7158e2" />
            <stop offset="100%"  stopColor="#cd84f1" />
          </linearGradient>
          {/* Head shell gradient (dark) */}
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#3d3d3d" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          {/* Body gradient (light gray) */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#e2e2e2" />
            <stop offset="100%" stopColor="#b8b8b8" />
          </linearGradient>
          {/* Arm gradient */}
          <linearGradient id="armGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#d8d8d8" />
            <stop offset="100%" stopColor="#b0b0b0" />
          </linearGradient>
          {/* Screen face */}
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#141414" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          {/* Eye glow */}
          <radialGradient id="eyeGrad">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%"  stopColor="#e8f4ff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#90c8ff" stopOpacity="0.5" />
          </radialGradient>
          {/* Highlight */}
          <linearGradient id="hlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="eyeBlur">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.18" />
          </filter>
          {/* Clip for rainbow strip (top half of head only) */}
          <clipPath id="headTopClip">
            <rect x="55" y="22" width="190" height="55" />
          </clipPath>
        </defs>

        {/* ─── HEAD ─── */}
        {/* Head shell */}
        <rect x="55" y="22" width="190" height="158" rx="32"
          fill="url(#headGrad)" filter="url(#softShadow)" />
        {/* Rainbow strip at top (clipped to top portion) */}
        <rect x="55" y="22" width="190" height="158" rx="32"
          fill="url(#rainbow)" opacity="0.9" clipPath="url(#headTopClip)" />
        {/* Separator line between rainbow and screen */}
        <rect x="55" y="72" width="190" height="4" fill="rgba(0,0,0,0.35)" />
        {/* Screen face area */}
        <rect x="64" y="76" width="172" height="96" rx="18"
          fill="url(#screenGrad)" />
        {/* Screen inner glow reflection */}
        <rect x="66" y="78" width="168" height="40" rx="16"
          fill="url(#hlGrad)" />

        {/* Left ear knob */}
        <circle cx="55" cy="120" r="16" fill="url(#bodyGrad)" />
        <circle cx="55" cy="120" r="9" fill="#c8c8c8" />
        <circle cx="55" cy="120" r="5" fill="#a0a0a0" />
        {/* Right ear knob */}
        <circle cx="245" cy="120" r="16" fill="url(#bodyGrad)" />
        <circle cx="245" cy="120" r="9" fill="#c8c8c8" />
        <circle cx="245" cy="120" r="5" fill="#a0a0a0" />

        {/* Antenna nub on top */}
        <rect x="135" y="8" width="30" height="18" rx="8"
          fill="url(#bodyGrad)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <motion.circle cx="150" cy="12" r="4" fill="#ff4757"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }} />

        {/* ── EYES (track cursor, blink) ── */}
        {/* Left eye background glow */}
        <motion.ellipse cx={100 + eye.x} cy={123 + eye.y} rx="22" ry="22"
          fill="rgba(100,180,255,0.25)" filter="url(#eyeBlur)"
          animate={clicked ? { rx: [22, 30, 22], opacity: [0.25, 0.6, 0.25] } : {}}
          transition={{ duration: 0.4 }} />
        {/* Left eye */}
        <motion.ellipse
          cx={100 + eye.x}
          cy={123 + eye.y}
          rx={22}
          ry={blink ? 2 : 24}
          fill="url(#eyeGrad)"
          style={{ transition: 'ry 0.08s ease' }}
        />
        {/* Left eye pupil */}
        <motion.circle cx={100 + eye.x * 0.5} cy={123 + eye.y * 0.5} r="9" fill="#1a1a2e" />
        <motion.circle cx={100 + eye.x * 0.5} cy={123 + eye.y * 0.5} r="5" fill="white" opacity="0.35" />
        {/* Left eye shine */}
        <motion.circle cx={106 + eye.x} cy={115 + eye.y} r="5" fill="white" opacity="0.9" />
        <motion.circle cx={112 + eye.x} cy={118 + eye.y} r="2.5" fill="white" opacity="0.55" />

        {/* Right eye background glow */}
        <motion.ellipse cx={200 + eye.x} cy={123 + eye.y} rx="22" ry="22"
          fill="rgba(100,180,255,0.25)" filter="url(#eyeBlur)"
          animate={clicked ? { rx: [22, 30, 22], opacity: [0.25, 0.6, 0.25] } : {}}
          transition={{ duration: 0.4 }} />
        {/* Right eye */}
        <motion.ellipse
          cx={200 + eye.x}
          cy={123 + eye.y}
          rx={22}
          ry={blink ? 2 : 24}
          fill="url(#eyeGrad)"
          style={{ transition: 'ry 0.08s ease' }}
        />
        {/* Right eye pupil */}
        <motion.circle cx={200 + eye.x * 0.5} cy={123 + eye.y * 0.5} r="9" fill="#1a1a2e" />
        <motion.circle cx={200 + eye.x * 0.5} cy={123 + eye.y * 0.5} r="5" fill="white" opacity="0.35" />
        {/* Right eye shine */}
        <motion.circle cx={206 + eye.x} cy={115 + eye.y} r="5" fill="white" opacity="0.9" />
        <motion.circle cx={212 + eye.x} cy={118 + eye.y} r="2.5" fill="white" opacity="0.55" />

        {/* Head bottom — mouth/speaker grille */}
        <rect x="110" y="155" width="80" height="14" rx="7"
          fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        {[118, 126, 134, 142, 150, 158, 166, 174, 182].map((x, i) => (
          <motion.rect key={x} x={x} y="158" width="2.5" height="8" rx="1.2"
            fill="rgba(255,255,255,0.3)"
            animate={{ height: [4, 8, 4], y: [160, 158, 160] }}
            transition={{ duration: 0.4 + i * 0.08, repeat: Infinity, delay: i * 0.06 }}
          />
        ))}

        {/* Head shine overlay */}
        <rect x="55" y="22" width="190" height="158" rx="32"
          fill="url(#hlGrad)" />

        {/* ─── NECK ─── */}
        <rect x="122" y="178" width="56" height="20" rx="8"
          fill="url(#bodyGrad)" />
        <rect x="130" y="182" width="14" height="12" rx="4" fill="rgba(0,0,0,0.1)" />
        <rect x="156" y="182" width="14" height="12" rx="4" fill="rgba(0,0,0,0.1)" />

        {/* ─── BODY ─── */}
        <rect x="52" y="196" width="196" height="118" rx="34"
          fill="url(#bodyGrad)" filter="url(#softShadow)" />
        {/* Body highlight strip */}
        <rect x="54" y="198" width="192" height="48" rx="32"
          fill="url(#hlGrad)" />
        {/* Body inner panel */}
        <rect x="76" y="212" width="148" height="88" rx="20"
          fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />

        {/* Chest LED dots */}
        <motion.circle cx="136" cy="278" r="6" fill="#ff4757"
          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />
        <motion.circle cx="150" cy="278" r="6" fill="#0be881"
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity }} />
        <motion.circle cx="164" cy="278" r="6" fill="#1e90ff"
          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }} />

        {/* MAU text on chest (subtle) */}
        <text x="150" y="252" textAnchor="middle"
          fontFamily="'Space Grotesk', sans-serif" fontWeight="800"
          fontSize="11" letterSpacing="3" fill="rgba(0,0,0,0.18)">
          MAU AI
        </text>

        {/* ─── LEFT ARM ─── */}
        {/* Shoulder joint */}
        <circle cx="52" cy="224" r="18" fill="url(#armGrad)" />
        <circle cx="52" cy="224" r="11" fill="#c8c8c8" />
        <circle cx="52" cy="224" r="6" fill="#aaa" />
        {/* Upper arm */}
        <rect x="20" y="224" width="36" height="70" rx="18"
          fill="url(#armGrad)" />
        {/* Lower arm / hand */}
        <rect x="18" y="290" width="40" height="46" rx="20"
          fill="url(#armGrad)" />
        {/* Hand highlight */}
        <rect x="20" y="292" width="36" height="20" rx="16"
          fill="url(#hlGrad)" />

        {/* ─── RIGHT ARM ─── */}
        {/* Shoulder joint */}
        <circle cx="248" cy="224" r="18" fill="url(#armGrad)" />
        <circle cx="248" cy="224" r="11" fill="#c8c8c8" />
        <circle cx="248" cy="224" r="6" fill="#aaa" />
        {/* Upper arm */}
        <rect x="244" y="224" width="36" height="70" rx="18"
          fill="url(#armGrad)" />
        {/* Lower arm / hand */}
        <rect x="242" y="290" width="40" height="46" rx="20"
          fill="url(#armGrad)" />
        <rect x="244" y="292" width="36" height="20" rx="16"
          fill="url(#hlGrad)" />

        {/* ─── WAIST CONNECTOR ─── */}
        <rect x="88" y="312" width="124" height="18" rx="8"
          fill="url(#bodyGrad)" />

        {/* ─── LEFT LEG ─── */}
        <rect x="82" y="326" width="58" height="52" rx="18"
          fill="url(#armGrad)" />
        <rect x="84" y="328" width="54" height="24" rx="14"
          fill="url(#hlGrad)" />

        {/* ─── RIGHT LEG ─── */}
        <rect x="160" y="326" width="58" height="52" rx="18"
          fill="url(#armGrad)" />
        <rect x="162" y="328" width="54" height="24" rx="14"
          fill="url(#hlGrad)" />

        {/* ─── LEFT BOOT ─── */}
        <rect x="68" y="368" width="76" height="30" rx="15"
          fill="url(#armGrad)" />
        <rect x="70" y="370" width="72" height="14" rx="12"
          fill="url(#hlGrad)" />

        {/* ─── RIGHT BOOT ─── */}
        <rect x="156" y="368" width="76" height="30" rx="15"
          fill="url(#armGrad)" />
        <rect x="158" y="370" width="72" height="14" rx="12"
          fill="url(#hlGrad)" />

        {/* Small platform the robot stands on */}
        <rect x="80" y="394" width="140" height="12" rx="6"
          fill="url(#bodyGrad)" opacity="0.6" />
        <rect x="88" y="402" width="124" height="8" rx="4"
          fill="url(#armGrad)" opacity="0.4" />
      </motion.svg>
    </div>
  );
}
