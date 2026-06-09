import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function Robot() {
  const containerRef = useRef(null);
  const [visor, setVisor] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const cap = 550;
    const f = Math.min(dist, cap) / cap;
    const angle = Math.atan2(dy, dx);
    setVisor({ x: Math.cos(angle) * f * 11, y: Math.sin(angle) * f * 5 });
    setTilt({ x: (dy / cap) * -9, y: (dx / cap) * 9 });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 500);
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: 440, height: 560 }}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 340, height: 340,
          background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbit ring 1 */}
      <div
        className="orbit-ring absolute pointer-events-none"
        style={{ width: 400, height: 400 }}
      >
        <div style={{
          position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8, borderRadius: '50%',
          background: '#00d4ff', boxShadow: '0 0 14px #00d4ff',
        }} />
      </div>

      {/* Orbit ring 2 */}
      <div
        className="orbit-ring orbit-ring-2 absolute pointer-events-none"
        style={{ width: 490, height: 490 }}
      >
        <div style={{
          position: 'absolute', bottom: -4, right: '22%',
          width: 6, height: 6, borderRadius: '50%',
          background: '#00ff88', boxShadow: '0 0 12px #00ff88',
        }} />
      </div>

      {/* Robot SVG */}
      <motion.svg
        width="320" height="468"
        viewBox="0 0 320 468"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: clicked
            ? 'drop-shadow(0 0 60px rgba(0,212,255,1))'
            : 'drop-shadow(0 0 26px rgba(0,212,255,0.48))',
          rotateX: tilt.x,
          rotateY: tilt.y,
          cursor: 'pointer',
          position: 'relative',
          zIndex: 2,
          transformStyle: 'preserve-3d',
          perspective: 900,
          transition: 'filter 0.4s',
        }}
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleClick}
        whileHover={{ filter: 'drop-shadow(0 0 55px rgba(0,212,255,0.85))' }}
      >
        <defs>
          <radialGradient id="vg" cx={`${50 + visor.x * 1.8}%`} cy="50%" r="65%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#0066aa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#001122" stopOpacity="0.1" />
          </radialGradient>
          <filter id="g3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
          <filter id="g7" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feComposite in="SourceGraphic" in2="b" operator="over" />
          </filter>
          <filter id="g12">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <radialGradient id="coreGrad">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#00d4ff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#002244" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="160" cy="463" rx="80" ry="6" fill="rgba(0,212,255,0.12)" />

        {/* ─── ANTENNA ─── */}
        <line x1="160" y1="14" x2="160" y2="46" stroke="#00d4ff" strokeWidth="1.8" strokeLinecap="round" />
        <motion.circle cx="160" cy="11" r="5" fill="#00d4ff"
          animate={{ r: [4, 7.5, 4], opacity: [1, 0.25, 1] }}
          transition={{ duration: 2.1, repeat: Infinity }} />
        <motion.circle cx="160" cy="11" r="13" fill="none" stroke="#00d4ff" strokeWidth="0.8"
          animate={{ r: [6, 22, 6], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.1, repeat: Infinity }} />
        <rect x="149" y="42" width="22" height="9" rx="3.5" fill="#0f1722" stroke="rgba(0,212,255,0.42)" strokeWidth="0.8" />

        {/* ─── HEAD (angular mech helmet) ─── */}
        <path
          d="M 94 50 L 226 50 L 252 84 L 252 136 L 212 154 L 108 154 L 68 136 L 68 84 Z"
          fill="#0c1120"
          stroke="#00d4ff"
          strokeWidth="1.3"
          strokeOpacity="0.68"
        />
        {/* Bevel inner */}
        <path
          d="M 96 52 L 224 52 L 249 85 L 249 134 L 211 151 L 109 151 L 71 134 L 71 85 Z"
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />

        {/* Left ear fin */}
        <path d="M 68 90 L 43 76 L 37 112 L 68 118 Z" fill="#0c1120" stroke="rgba(0,212,255,0.4)" strokeWidth="0.9" />
        <line x1="48" y1="86" x2="42" y2="108" stroke="rgba(0,212,255,0.22)" strokeWidth="0.6" />
        {/* Right ear fin */}
        <path d="M 252 90 L 277 76 L 283 112 L 252 118 Z" fill="#0c1120" stroke="rgba(0,212,255,0.4)" strokeWidth="0.9" />
        <line x1="272" y1="86" x2="278" y2="108" stroke="rgba(0,212,255,0.22)" strokeWidth="0.6" />

        {/* Forehead status strip */}
        <rect x="118" y="56" width="84" height="12" rx="3.5" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.7" />
        <motion.circle cx="130" cy="62" r="2.8" fill="#00ff88"
          animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.9, repeat: Infinity }} />
        <motion.circle cx="141" cy="62" r="2.8" fill="#00d4ff"
          animate={{ opacity: [0.25, 1, 0.25] }} transition={{ duration: 1.3, repeat: Infinity }} />
        <circle cx="152" cy="62" r="2.8" fill="#7b2fff" />
        <motion.rect x="160" y="58" width="34" height="8" rx="2" fill="rgba(0,212,255,0.32)"
          animate={{ width: [8, 34, 8] }} transition={{ duration: 2.6, repeat: Infinity }} />

        {/* ─── VISOR ─── (the reactive centerpiece) */}
        {/* Housing */}
        <rect x="82" y="84" width="156" height="40" rx="11" fill="#03080e" stroke="#00d4ff" strokeWidth="1.4" strokeOpacity="0.75" />

        {/* Visor glow background */}
        <rect x="84" y="86" width="152" height="36" rx="10" fill="url(#vg)" opacity="0.22" />

        {/* Animated scan line */}
        <motion.rect x="84" y="100" width="152" height="2.5" rx="1.2" fill="rgba(0,212,255,0.65)"
          animate={{ y: [86, 120, 86], opacity: [0, 0.85, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }} />

        {/* Main glow core that tracks mouse */}
        <motion.ellipse
          cx={160 + visor.x}
          cy={104 + visor.y}
          rx="40" ry="14"
          fill="#00d4ff"
          opacity="0.42"
          filter="url(#g7)"
        />
        {/* Bright pupil that tracks mouse */}
        <motion.circle
          cx={160 + visor.x * 0.65}
          cy={104 + visor.y * 0.5}
          r="9"
          fill="#00d4ff"
          opacity="0.8"
          filter="url(#g3)"
        />
        <motion.circle
          cx={160 + visor.x * 0.65}
          cy={104 + visor.y * 0.5}
          r="4.5"
          fill="white"
          opacity="0.95"
        />

        {/* HUD brackets */}
        <path d="M 82 95 L 82 86 L 91 86" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.9" />
        <path d="M 238 95 L 238 86 L 229 86" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.9" />
        <path d="M 82 113 L 82 122 L 91 122" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.9" />
        <path d="M 238 113 L 238 122 L 229 122" stroke="#00d4ff" strokeWidth="1" fill="none" opacity="0.9" />
        {/* HUD tick lines */}
        <line x1="104" y1="86" x2="104" y2="122" stroke="rgba(0,212,255,0.3)" strokeWidth="0.6" />
        <line x1="124" y1="86" x2="124" y2="122" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />
        <line x1="196" y1="86" x2="196" y2="122" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />
        <line x1="216" y1="86" x2="216" y2="122" stroke="rgba(0,212,255,0.3)" strokeWidth="0.6" />

        {/* ─── CHIN GUARD ─── */}
        <path d="M 108 154 L 212 154 L 220 174 L 100 174 Z" fill="#0a1020" stroke="rgba(0,212,255,0.32)" strokeWidth="0.9" />
        <rect x="122" y="158" width="76" height="10" rx="3.5" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.18)" strokeWidth="0.6" />
        {/* Voice bars in chin */}
        {[130, 138, 146, 154, 162, 170, 178, 186].map((x, i) => (
          <motion.rect
            key={x} x={x} y="160" width="3.5" height="6" rx="1.5"
            fill={i % 3 === 1 ? '#00ff88' : '#00d4ff'}
            opacity="0.65"
            animate={{ height: [3, 10, 3], y: [162, 159, 162] }}
            transition={{ duration: 0.45 + i * 0.09, repeat: Infinity, delay: i * 0.07 }}
          />
        ))}

        {/* ─── NECK ─── */}
        <rect x="124" y="172" width="72" height="26" rx="8" fill="#0c1120" stroke="rgba(0,212,255,0.28)" strokeWidth="0.9" />
        <rect x="134" y="177" width="18" height="16" rx="4" fill="rgba(0,212,255,0.08)" />
        <rect x="168" y="177" width="18" height="16" rx="4" fill="rgba(0,212,255,0.08)" />

        {/* ─── SHOULDERS ─── */}
        {/* Left shoulder (asymmetric, larger) */}
        <path d="M 70 194 L 70 258 L 96 265 L 96 228 L 116 214 L 116 194 Z"
          fill="#0c1120" stroke="rgba(0,212,255,0.38)" strokeWidth="0.9" />
        <line x1="72" y1="212" x2="94" y2="226" stroke="rgba(0,212,255,0.22)" strokeWidth="0.7" />
        <line x1="72" y1="222" x2="94" y2="236" stroke="rgba(0,212,255,0.14)" strokeWidth="0.5" />
        {/* Right shoulder */}
        <path d="M 250 194 L 250 258 L 224 265 L 224 228 L 204 214 L 204 194 Z"
          fill="#0c1120" stroke="rgba(0,212,255,0.38)" strokeWidth="0.9" />
        <line x1="248" y1="212" x2="226" y2="226" stroke="rgba(0,212,255,0.22)" strokeWidth="0.7" />

        {/* ─── TORSO ─── */}
        <path
          d="M 96 194 L 224 194 L 246 220 L 248 312 L 226 328 L 94 328 L 72 312 L 74 220 Z"
          fill="#09101e"
          stroke="#00d4ff"
          strokeWidth="1.15"
          strokeOpacity="0.46"
        />
        {/* Top edge highlight */}
        <line x1="96" y1="194" x2="224" y2="194" stroke="rgba(0,212,255,0.44)" strokeWidth="0.9" />

        {/* Chest armor plate */}
        <path d="M 112 206 L 208 206 L 222 228 L 218 282 L 102 282 L 98 228 Z"
          fill="rgba(0,212,255,0.02)"
          stroke="rgba(0,212,255,0.18)"
          strokeWidth="0.7"
        />

        {/* ─── CHEST EMBLEM ─── */}
        {/* Outer ripple */}
        <motion.circle cx="160" cy="244" r="46"
          fill="none" stroke="rgba(0,212,255,0.07)" strokeWidth="1"
          animate={{ r: [42, 52, 42], opacity: [0.4, 0.1, 0.4] }}
          transition={{ duration: 3.4, repeat: Infinity }} />
        {/* Mid ring */}
        <motion.circle cx="160" cy="244" r="34"
          fill="none" stroke="rgba(0,212,255,0.22)" strokeWidth="1"
          animate={{ r: [30, 38, 30] }}
          transition={{ duration: 2.7, repeat: Infinity }} />
        {/* Hexagon */}
        <polygon
          points="160,222 180,233 180,255 160,266 140,255 140,233"
          fill="rgba(0,212,255,0.05)"
          stroke="#00d4ff"
          strokeWidth="1.4"
          strokeOpacity="0.78"
        />
        {/* Inner glow circle */}
        <circle cx="160" cy="244" r="15" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="1.6" />
        {/* Core pulse */}
        <motion.circle cx="160" cy="244" r="8" fill="#00d4ff"
          animate={{ opacity: [1, 0.35, 1], r: [7, 10, 7] }}
          transition={{ duration: 1.9, repeat: Infinity }} />
        <circle cx="160" cy="244" r="3.5" fill="white" opacity="0.92" />

        {/* Circuit lines */}
        <path d="M 100 268 L 126 268 L 126 281" stroke="rgba(0,212,255,0.3)" strokeWidth="0.7" fill="none" />
        <path d="M 220 268 L 194 268 L 194 281" stroke="rgba(0,212,255,0.3)" strokeWidth="0.7" fill="none" />
        <circle cx="100" cy="268" r="2.5" fill="rgba(0,212,255,0.55)" />
        <circle cx="220" cy="268" r="2.5" fill="rgba(0,212,255,0.55)" />
        <motion.circle cx="126" cy="281" r="2.5" fill="#00ff88"
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <motion.circle cx="194" cy="281" r="2.5" fill="#00ff88"
          animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />

        {/* Data panel */}
        <rect x="116" y="286" width="88" height="22" rx="6" fill="rgba(0,212,255,0.04)" stroke="rgba(0,212,255,0.18)" strokeWidth="0.7" />
        <motion.rect x="122" y="291" width="30" height="12" rx="3" fill="rgba(0,212,255,0.18)"
          animate={{ opacity: [0.8, 0.28, 0.8] }} transition={{ duration: 1.6, repeat: Infinity }} />
        <motion.rect x="160" y="291" width="30" height="12" rx="3" fill="rgba(0,255,136,0.14)"
          animate={{ opacity: [0.28, 0.8, 0.28] }} transition={{ duration: 1.6, repeat: Infinity }} />
        <line x1="156" y1="291" x2="156" y2="303" stroke="rgba(0,212,255,0.25)" strokeWidth="0.6" />

        {/* ─── LEFT ARM ─── */}
        <rect x="36" y="200" width="38" height="78" rx="14" fill="#0c1120" stroke="rgba(0,212,255,0.28)" strokeWidth="0.9" />
        <rect x="42" y="218" width="26" height="42" rx="8" fill="rgba(0,212,255,0.04)" />
        {/* Left elbow */}
        <circle cx="55" cy="282" r="15" fill="#09101e" stroke="rgba(0,212,255,0.44)" strokeWidth="1.1" />
        <motion.circle cx="55" cy="282" r="7" fill="rgba(0,212,255,0.12)"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.1, repeat: Infinity }} />
        <circle cx="55" cy="282" r="3.5" fill="rgba(0,212,255,0.38)" />
        {/* Left forearm */}
        <rect x="36" y="297" width="38" height="64" rx="13" fill="#0c1120" stroke="rgba(0,212,255,0.24)" strokeWidth="0.8" />
        {/* Left gauntlet */}
        <rect x="32" y="356" width="46" height="26" rx="11" fill="#09101e" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" />
        <rect x="38" y="361" width="34" height="16" rx="6" fill="rgba(0,212,255,0.07)" />

        {/* ─── RIGHT ARM ─── */}
        <rect x="246" y="200" width="38" height="78" rx="14" fill="#0c1120" stroke="rgba(0,212,255,0.28)" strokeWidth="0.9" />
        <rect x="252" y="218" width="26" height="42" rx="8" fill="rgba(0,212,255,0.04)" />
        {/* Right elbow */}
        <circle cx="265" cy="282" r="15" fill="#09101e" stroke="rgba(0,212,255,0.44)" strokeWidth="1.1" />
        <motion.circle cx="265" cy="282" r="7" fill="rgba(0,212,255,0.12)"
          animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 2.1, repeat: Infinity }} />
        <circle cx="265" cy="282" r="3.5" fill="rgba(0,212,255,0.38)" />
        {/* Right forearm */}
        <rect x="246" y="297" width="38" height="64" rx="13" fill="#0c1120" stroke="rgba(0,212,255,0.24)" strokeWidth="0.8" />
        {/* Right gauntlet */}
        <rect x="242" y="356" width="46" height="26" rx="11" fill="#09101e" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" />
        <rect x="248" y="361" width="34" height="16" rx="6" fill="rgba(0,212,255,0.07)" />

        {/* ─── WAIST ─── */}
        <rect x="72" y="328" width="176" height="22" rx="8" fill="#07090e" stroke="rgba(0,212,255,0.3)" strokeWidth="0.9" />
        <rect x="116" y="332" width="88" height="14" rx="5" fill="rgba(0,212,255,0.05)" />

        {/* ─── LEGS ─── */}
        {/* Left thigh */}
        <rect x="78" y="350" width="66" height="62" rx="15" fill="#09101e" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" />
        {/* Left knee */}
        <circle cx="111" cy="416" r="16" fill="#0c1120" stroke="rgba(0,212,255,0.42)" strokeWidth="1.1" />
        <circle cx="111" cy="416" r="8" fill="rgba(0,212,255,0.1)" />
        <motion.circle cx="111" cy="416" r="4" fill="rgba(0,212,255,0.25)"
          animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2.4, repeat: Infinity }} />
        {/* Left shin */}
        <rect x="93" y="432" width="36" height="44" rx="12" fill="#0c1120" stroke="rgba(0,212,255,0.2)" strokeWidth="0.7" />
        {/* Left foot */}
        <rect x="82" y="468" width="58" height="14" rx="9" fill="#09101e" stroke="rgba(0,212,255,0.18)" strokeWidth="0.7" />

        {/* Right thigh */}
        <rect x="176" y="350" width="66" height="62" rx="15" fill="#09101e" stroke="rgba(0,212,255,0.2)" strokeWidth="0.8" />
        {/* Right knee */}
        <circle cx="209" cy="416" r="16" fill="#0c1120" stroke="rgba(0,212,255,0.42)" strokeWidth="1.1" />
        <circle cx="209" cy="416" r="8" fill="rgba(0,212,255,0.1)" />
        <motion.circle cx="209" cy="416" r="4" fill="rgba(0,212,255,0.25)"
          animate={{ opacity: [0.9, 0.4, 0.9] }} transition={{ duration: 2.4, repeat: Infinity }} />
        {/* Right shin */}
        <rect x="191" y="432" width="36" height="44" rx="12" fill="#0c1120" stroke="rgba(0,212,255,0.2)" strokeWidth="0.7" />
        {/* Right foot */}
        <rect x="180" y="468" width="58" height="14" rx="9" fill="#09101e" stroke="rgba(0,212,255,0.18)" strokeWidth="0.7" />
      </motion.svg>

      {/* Click hint */}
      <motion.p
        className="absolute bottom-2 text-xs tracking-widest text-center pointer-events-none"
        style={{ color: 'rgba(0,212,255,0.45)', letterSpacing: '3px', fontSize: '0.6rem' }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        CLICK TO INTERACT
      </motion.p>
    </div>
  );
}
