import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const lerp = THREE.MathUtils.lerp;
const clamp = THREE.MathUtils.clamp;

function RobotModel({ waving, interactive, reducedMotion, stationary }) {
  const still = reducedMotion || stationary;
  const group = useRef();
  const body = useRef();
  const head = useRef();
  const eyeL = useRef();
  const eyeR = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const leftForearm = useRef();
  const rightForearm = useRef();
  const leftLeg = useRef();
  const rightLeg = useRef();

  const pointer = useRef({ x: 0, y: 0 });
  const anim = useRef({ jump: 0, jumpCd: 2.5 + Math.random() * 2, wave: 0, waveCd: 3, blink: 0 });

  useEffect(() => {
    if (!interactive) return undefined;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [interactive]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const a = anim.current;
    const dt = Math.min(delta, 0.05);
    if (!group.current) return;

    // ── Horizontal follow: chase the cursor (or auto-roam when non-interactive)
    const pointerX = still ? 0 : (interactive ? pointer.current.x : Math.sin(t * 0.4) * 0.7);
    const pointerY = interactive && !still ? pointer.current.y : 0;
    const targetX = still ? 0 : clamp(pointerX * 1.05, -0.95, 0.95);
    const prevX = group.current.position.x;
    group.current.position.x = lerp(prevX, targetX, 0.045);
    const velX = group.current.position.x - prevX;
    const speed = Math.abs(velX);
    const running = !still && speed > 0.0035;

    // ── Jump state machine (auto-hops; more often while running)
    if (!still && a.jump <= 0) {
      a.jumpCd -= dt * (running ? 2.2 : 1);
      if (a.jumpCd <= 0) {
        a.jump = 1;
        a.jumpCd = 3 + Math.random() * 3.5;
      }
    }
    let jumpY = 0;
    if (a.jump > 0) {
      a.jump -= dt / 0.72;
      const p = clamp(1 - a.jump, 0, 1);
      jumpY = Math.sin(p * Math.PI) * 0.6;
      if (a.jump <= 0) a.jump = 0;
    }
    const jumping = jumpY > 0.04;

    // ── Vertical: idle breathing bob + running bounce + jump arc
    const idleBob = Math.sin(t * 2.2) * 0.025;
    const runBounce = running && !jumping ? Math.abs(Math.sin(t * 15)) * 0.11 : 0;
    group.current.position.y = -0.55 + idleBob + runBounce + jumpY;

    // ── Lean into motion + gentle yaw toward cursor
    const targetLean = clamp(-velX * 11, -0.45, 0.45);
    group.current.rotation.z = lerp(group.current.rotation.z, jumping ? 0 : targetLean, 0.12);
    group.current.rotation.y = lerp(group.current.rotation.y, pointerX * 0.3, 0.05);

    // ── Landing squash / jump stretch
    if (body.current) {
      const stretch = jumping ? 1 + jumpY * 0.12 : 1 + Math.sin(t * 2.2) * 0.015;
      body.current.scale.y = lerp(body.current.scale.y, stretch, 0.3);
      body.current.scale.x = lerp(body.current.scale.x, 2 - stretch, 0.3);
    }

    // ── Head: look at the cursor, tuck up a touch on jumps
    if (head.current) {
      head.current.rotation.y = lerp(head.current.rotation.y, pointerX * 0.45, 0.08);
      head.current.rotation.x = lerp(head.current.rotation.x, -pointerY * 0.28 + (jumping ? -0.18 : 0), 0.08);
    }

    // ── Blink
    a.blink += dt;
    const blinkOn = a.blink % 3.4 > 3.25;
    const eyeScale = blinkOn ? 0.1 : 1;
    if (eyeL.current) eyeL.current.scale.y = lerp(eyeL.current.scale.y, eyeScale, 0.5);
    if (eyeR.current) eyeR.current.scale.y = lerp(eyeR.current.scale.y, eyeScale, 0.5);

    // ── Legs: pump while running, tuck on jump, rest otherwise
    const legPhase = Math.sin(t * 15);
    if (leftLeg.current && rightLeg.current) {
      if (jumping) {
        leftLeg.current.rotation.x = lerp(leftLeg.current.rotation.x, -0.85, 0.25);
        rightLeg.current.rotation.x = lerp(rightLeg.current.rotation.x, -0.55, 0.25);
      } else if (running) {
        leftLeg.current.rotation.x = legPhase * 0.7;
        rightLeg.current.rotation.x = -legPhase * 0.7;
      } else {
        leftLeg.current.rotation.x = lerp(leftLeg.current.rotation.x, 0, 0.12);
        rightLeg.current.rotation.x = lerp(rightLeg.current.rotation.x, 0, 0.12);
      }
    }

    // ── Wave scheduling (only when calm)
    let doWave = waving;
    if (!running && !jumping) {
      if (a.wave > 0) a.wave -= dt;
      a.waveCd -= dt;
      if (a.waveCd <= 0 && a.wave <= 0) {
        a.wave = 1.8;
        a.waveCd = 4 + Math.random() * 4;
      }
      if (a.wave > 0) doWave = true;
    }

    // ── Arms
    if (rightArm.current && leftArm.current && rightForearm.current && leftForearm.current) {
      if (jumping) {
        // Both arms up — celebratory hop
        rightArm.current.rotation.z = lerp(rightArm.current.rotation.z, -2.7, 0.22);
        leftArm.current.rotation.z = lerp(leftArm.current.rotation.z, 2.7, 0.22);
        rightArm.current.rotation.x = lerp(rightArm.current.rotation.x, 0, 0.2);
        leftArm.current.rotation.x = lerp(leftArm.current.rotation.x, 0, 0.2);
        rightForearm.current.rotation.z = lerp(rightForearm.current.rotation.z, 0, 0.2);
      } else if (running) {
        // Swing arms opposite to legs
        rightArm.current.rotation.x = -legPhase * 0.6;
        leftArm.current.rotation.x = legPhase * 0.6;
        rightArm.current.rotation.z = lerp(rightArm.current.rotation.z, -0.2, 0.12);
        leftArm.current.rotation.z = lerp(leftArm.current.rotation.z, 0.2, 0.12);
        rightForearm.current.rotation.z = lerp(rightForearm.current.rotation.z, 0.1, 0.12);
      } else if (doWave) {
        // Raise right arm and wag the hand
        rightArm.current.rotation.z = lerp(rightArm.current.rotation.z, -2.4, 0.16);
        rightArm.current.rotation.x = lerp(rightArm.current.rotation.x, 0.15, 0.16);
        rightForearm.current.rotation.z = Math.sin(t * 10) * 0.55;
        leftArm.current.rotation.z = lerp(leftArm.current.rotation.z, 0.18, 0.1);
        leftArm.current.rotation.x = lerp(leftArm.current.rotation.x, 0, 0.1);
      } else {
        rightArm.current.rotation.x = lerp(rightArm.current.rotation.x, 0, 0.1);
        leftArm.current.rotation.x = lerp(leftArm.current.rotation.x, 0, 0.1);
        rightArm.current.rotation.z = lerp(rightArm.current.rotation.z, -0.16, 0.1);
        leftArm.current.rotation.z = lerp(leftArm.current.rotation.z, 0.16, 0.1);
        rightForearm.current.rotation.z = lerp(rightForearm.current.rotation.z, 0.1, 0.1);
        leftForearm.current.rotation.z = lerp(leftForearm.current.rotation.z, -0.1, 0.1);
      }
    }
  });

  const shell = { color: '#f4f6fb', metalness: 0.35, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 };
  const blue = { color: '#0a84ff', metalness: 0.5, roughness: 0.3, clearcoat: 0.8 };
  const dark = { color: '#141821', metalness: 0.4, roughness: 0.3 };
  const accent = '#22d3ff';

  const Arm = ({ side, armRef, forearmRef }) => (
    <group ref={armRef} position={[0.5 * side, 1.0, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.14, 14, 12]} />
        <meshPhysicalMaterial {...blue} />
      </mesh>
      <mesh position={[0, -0.2, 0]} castShadow>
        <capsuleGeometry args={[0.09, 0.22, 4, 12]} />
        <meshPhysicalMaterial {...shell} />
      </mesh>
      <group ref={forearmRef} position={[0, -0.36, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshPhysicalMaterial {...blue} />
        </mesh>
        <mesh position={[0, -0.18, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.16, 4, 12]} />
          <meshPhysicalMaterial {...shell} />
        </mesh>
        {/* Mitten hand */}
        <mesh position={[0, -0.34, 0]} castShadow>
          <sphereGeometry args={[0.12, 14, 12]} />
          <meshPhysicalMaterial {...blue} />
        </mesh>
      </group>
    </group>
  );

  return (
    <group ref={group} position={[0, -0.55, 0]} scale={0.95}>
      <group ref={body}>
        {/* Head / helmet */}
        <group ref={head} position={[0, 1.42, 0]}>
          <RoundedBox args={[1, 0.86, 0.78]} radius={0.22} smoothness={3} castShadow receiveShadow>
            <meshPhysicalMaterial {...shell} />
          </RoundedBox>
          {/* Visor */}
          <RoundedBox args={[0.78, 0.5, 0.12]} radius={0.16} smoothness={3} position={[0, 0.02, 0.34]}>
            <meshPhysicalMaterial color="#070c18" metalness={0.3} roughness={0.12} clearcoat={1} />
          </RoundedBox>
          {/* Big glowing eyes */}
          <mesh ref={eyeL} position={[-0.17, 0.05, 0.42]}>
            <capsuleGeometry args={[0.075, 0.09, 4, 14]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
          <mesh ref={eyeR} position={[0.17, 0.05, 0.42]}>
            <capsuleGeometry args={[0.075, 0.09, 4, 14]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
          {/* Smile */}
          <mesh position={[0, -0.16, 0.42]}>
            <boxGeometry args={[0.22, 0.028, 0.02]} />
            <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          {/* Ear pods */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.52 * s, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.08, 14]} />
              <meshPhysicalMaterial {...blue} />
            </mesh>
          ))}
          {/* Antenna */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.16, 6]} />
            <meshPhysicalMaterial {...shell} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.05, 12, 10]} />
            <meshStandardMaterial color="#ff5a7a" emissive="#ff5a7a" emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        </group>

        {/* Neck */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 0.12, 12]} />
          <meshPhysicalMaterial {...blue} />
        </mesh>

        {/* Torso */}
        <RoundedBox args={[0.74, 0.66, 0.56]} radius={0.2} smoothness={3} position={[0, 0.72, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...shell} />
        </RoundedBox>
        {/* Chest core */}
        <mesh position={[0, 0.74, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} toneMapped={false} />
        </mesh>
        {[-0.18, 0.18].map((x, i) => (
          <mesh key={i} position={[x, 0.9, 0.29]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial
              color={['#ff5a7a', '#0be881'][i]}
              emissive={['#ff5a7a', '#0be881'][i]}
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Arms */}
        <Arm side={-1} armRef={leftArm} forearmRef={leftForearm} />
        <Arm side={1} armRef={rightArm} forearmRef={rightForearm} />
      </group>

      {/* Legs (outside squash group so they stay planted) */}
      {[-1, 1].map((s) => (
        <group key={s} ref={s === -1 ? leftLeg : rightLeg} position={[0.17 * s, 0.42, 0]}>
          <mesh position={[0, -0.16, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.16, 4, 12]} />
            <meshPhysicalMaterial {...blue} />
          </mesh>
          {/* Boot */}
          <RoundedBox args={[0.22, 0.14, 0.32]} radius={0.06} smoothness={3} position={[0, -0.32, 0.05]} castShadow receiveShadow>
            <meshPhysicalMaterial {...shell} />
          </RoundedBox>
        </group>
      ))}
    </group>
  );
}

function Scene({ waving, interactive, reducedMotion, stationary }) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.35} castShadow shadow-mapSize={[512, 512]} />
      <directionalLight position={[-3, 2, -2]} intensity={0.55} color="#0078d4" />
      {/* Rim/back light replaces the remote HDR environment for cheap highlights */}
      <directionalLight position={[0, 3, -4]} intensity={0.8} color="#dbeafe" />
      <pointLight position={[0, 1.6, 2.4]} intensity={0.7} color="#22d3ff" />
      <RobotModel waving={waving} interactive={interactive} reducedMotion={reducedMotion} stationary={stationary} />
      <ContactShadows position={[0, -0.52, 0]} opacity={0.35} scale={5} blur={2.6} far={1.6} />
    </>
  );
}

function RobotFallback() {
  return (
    <div className="robot-3d-fallback">
      <img src="/logo-mu.png" alt="" width={80} height={80} />
    </div>
  );
}

export default function Robot3D({ waving = false, interactive = true, stationary = false, className = '' }) {
  const [webglOk, setWebglOk] = useState(true);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  // Respect the user's reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Pause the render loop when the robot is scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!webglOk) return <RobotFallback />;

  return (
    <div ref={containerRef} className={`robot-3d ${className}`.trim()}>
      <Suspense fallback={<RobotFallback />}>
        <Canvas
          shadows
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, 1.25]}
          camera={{ position: [0, 1.1, 4], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <Scene waving={waving} interactive={interactive} reducedMotion={reducedMotion} stationary={stationary} />
        </Canvas>
      </Suspense>
    </div>
  );
}
