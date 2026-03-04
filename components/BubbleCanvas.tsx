"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ── */
interface Bubble {
  id: number;
  x: number;
  startY: number;
  size: number;
  color: string;
  rgbCore: string;
  speed: number;
  wobbleAmp: number;
  wobbleSpeed: number;
}

interface Burst {
  id: number;
  x: number;
  y: number;
  color: string;
  rgbCore: string;
  size: number;
}

/* ── Constants ── */
const PALETTE = [
  { fill: "rgba(255, 107, 157, 0.22)", rgb: "255,107,157" },
  { fill: "rgba(255, 133, 177, 0.18)", rgb: "255,133,177" },
  { fill: "rgba(69, 183, 209, 0.22)", rgb: "69,183,209" },
  { fill: "rgba(78, 205, 196, 0.18)", rgb: "78,205,196" },
  { fill: "rgba(180, 130, 255, 0.16)", rgb: "180,130,255" },
];
const MAX_BUBBLES = 20;
const PARTICLES_PER_BURST = 10;

/* ── Helpers ── */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createBubble(id: number): Bubble {
  const palette = pick(PALETTE);
  return {
    id,
    x: 5 + Math.random() * 90,
    startY: 85 + Math.random() * 25,
    size: 22 + Math.random() * 55,
    color: palette.fill,
    rgbCore: palette.rgb,
    speed: 10 + Math.random() * 14,
    wobbleAmp: 30 + Math.random() * 50,
    wobbleSpeed: 3 + Math.random() * 3,
  };
}

/* ── Burst Particle ── */
function BurstParticle({
  angle,
  color,
  distance,
  size,
}: {
  angle: number;
  color: string;
  distance: number;
  size: number;
}) {
  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;

  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: tx, y: ty, scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 + Math.random() * 0.3, ease: "easeOut" }}
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(${color},0.9), rgba(${color},0.3))`,
        top: "50%",
        left: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }}
    />
  );
}

/* ── Burst Effect ── */
function BurstEffect({
  burst,
  onDone,
}: {
  burst: Burst;
  onDone: () => void;
}) {
  const particles = useRef(
    Array.from({ length: PARTICLES_PER_BURST }, (_, i) => ({
      angle: (360 / PARTICLES_PER_BURST) * i + (Math.random() * 30 - 15),
      distance: burst.size * 0.8 + Math.random() * 40,
      size: 4 + Math.random() * 8,
    }))
  );

  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: burst.x, top: burst.y }}
    >
      {/* Central flash ring */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0.9 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{
          width: burst.size,
          height: burst.size,
          top: "50%",
          left: "50%",
          marginLeft: -burst.size / 2,
          marginTop: -burst.size / 2,
          border: `2px solid rgba(${burst.rgbCore}, 0.5)`,
          boxShadow: `0 0 12px rgba(${burst.rgbCore}, 0.3)`,
        }}
      />

      {/* Scattered droplets */}
      {particles.current.map((p, i) => (
        <BurstParticle
          key={i}
          angle={p.angle}
          distance={p.distance}
          size={p.size}
          color={burst.rgbCore}
        />
      ))}
    </div>
  );
}

/* ── Single Floating Bubble ── */
function FloatingBubble({
  bubble,
  onPop,
}: {
  bubble: Bubble;
  onPop: (id: number, x: number, y: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onPop(bubble.id, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, [bubble.id, onPop]);

  const handleReachTop = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    onPop(bubble.id, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, [bubble.id, onPop]);

  return (
    <motion.div
      ref={ref}
      initial={{
        top: `${bubble.startY}%`,
        x: 0,
        opacity: 0,
        scale: 0.3,
      }}
      animate={{
        top: "-8%",
        x: [
          0,
          bubble.wobbleAmp * 0.6,
          -bubble.wobbleAmp * 0.4,
          bubble.wobbleAmp * 0.3,
          -bubble.wobbleAmp * 0.5,
          bubble.wobbleAmp * 0.2,
          0,
        ],
        opacity: [0, 1, 1, 1, 0.6],
        scale: [0.3, 1, 1, 1, 1.15],
      }}
      transition={{
        top: {
          duration: bubble.speed,
          ease: "linear",
        },
        x: {
          duration: bubble.wobbleSpeed,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
        opacity: {
          duration: bubble.speed,
          times: [0, 0.05, 0.7, 0.9, 1],
          ease: "linear",
        },
        scale: {
          duration: bubble.speed,
          times: [0, 0.08, 0.85, 0.95, 1],
          ease: "easeInOut",
        },
      }}
      onAnimationComplete={handleReachTop}
      onClick={handleClick}
      className="absolute rounded-full pointer-events-auto cursor-pointer"
      style={{
        left: `${bubble.x}%`,
        width: bubble.size,
        height: bubble.size,
        background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 35%, ${bubble.color} 100%)`,
        boxShadow: `inset 0 -3px 8px rgba(0,0,0,0.04), inset 0 3px 8px rgba(255,255,255,0.5), 0 2px 12px rgba(${bubble.rgbCore},0.12)`,
        willChange: "transform, top",
      }}
    >
      {/* Specular highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: "35%",
          height: "25%",
          top: "15%",
          left: "20%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.7), transparent)",
          transform: "rotate(-20deg)",
        }}
      />
    </motion.div>
  );
}

/* ── Main Canvas ── */
export default function BubbleCanvas() {
  const nextId = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  bubblesRef.current = bubbles;

  // Only create bubbles on the client to avoid hydration mismatch
  useEffect(() => {
    const initial = Array.from({ length: MAX_BUBBLES }, (_, i) => createBubble(i));
    nextId.current = MAX_BUBBLES;
    setBubbles(initial);
    setMounted(true);
  }, []);

  const handlePop = useCallback(
    (id: number, screenX: number, screenY: number) => {
      const bubble = bubblesRef.current.find((b) => b.id === id);
      if (!bubble) return;

      setBursts((prev) => [
        ...prev,
        {
          id,
          x: screenX,
          y: screenY,
          color: bubble.color,
          rgbCore: bubble.rgbCore,
          size: bubble.size,
        },
      ]);

      setBubbles((prev) => prev.filter((b) => b.id !== id));

      setTimeout(() => {
        setBubbles((prev) => {
          if (prev.length >= MAX_BUBBLES) return prev;
          const newId = nextId.current++;
          return [...prev, createBubble(newId)];
        });
      }, 600);
    },
    []
  );

  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // Continuously replenish bubbles
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length >= MAX_BUBBLES) return prev;
        const newId = nextId.current++;
        return [...prev, createBubble(newId)];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating bubbles */}
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <FloatingBubble key={bubble.id} bubble={bubble} onPop={handlePop} />
        ))}
      </AnimatePresence>

      {/* Burst effects (fixed position overlay) */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        {bursts.map((burst) => (
          <BurstEffect
            key={burst.id}
            burst={burst}
            onDone={() => removeBurst(burst.id)}
          />
        ))}
      </div>
    </div>
  );
}
