"use client";

import { useEffect, useRef, useCallback } from "react";

/* ── Types ── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  settled: boolean;
  life: number;
  maxLife: number;
}

interface Cannon {
  side: "left" | "right";
  x: number;
  y: number;
  angle: number;
  targetAngle: number;
  barrelLen: number;
}

interface Ledge {
  x: number;
  y: number;
  w: number;
  h: number;
}

/* ── Responsive config ── */
function getConfig(w: number) {
  const mobile = w < 640;
  const tablet = w < 1024;
  return {
    maxParticles: mobile ? 300 : tablet ? 550 : 900,
    emitRate: mobile ? 2 : tablet ? 3 : 5,
    emitEvery: mobile ? 3 : 2, // emit every N frames
    particleSizeMin: mobile ? 6 : 8,
    particleSizeMax: mobile ? 18 : 26,
    cannonInset: mobile ? 12 : tablet ? 20 : 30,
    barrelLen: mobile ? 32 : tablet ? 44 : 55,
    drawSpecular: !mobile, // skip specular highlight on mobile
  };
}

const GRAVITY = 0.05;
const DRAG = 0.993;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/* ── Draw 3D cannon ── */
function drawCannon(ctx: CanvasRenderingContext2D, cannon: Cannon) {
  const { x, y, angle, barrelLen } = cannon;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const bw = barrelLen;
  const bh = Math.max(14, barrelLen * 0.4);
  const scale = barrelLen / 55; // relative to desktop size

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.roundRect(-4, -bh / 2 + 2, bw + 8, bh + 4, 6);
  ctx.fill();

  // Barrel
  const grad = ctx.createLinearGradient(0, -bh / 2, 0, bh / 2);
  grad.addColorStop(0, "#e8e8e8");
  grad.addColorStop(0.3, "#ffffff");
  grad.addColorStop(0.5, "#f0f0f0");
  grad.addColorStop(0.7, "#d8d8d8");
  grad.addColorStop(1, "#b0b0b0");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, -bh / 2, bw, bh, [4, 8, 8, 4]);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Stripes
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.moveTo(bw * i * 0.22, -bh / 2 + 2);
    ctx.lineTo(bw * i * 0.22, bh / 2 - 2);
    ctx.stroke();
  }

  // Nozzle
  const nw = 12 * scale;
  const nh = bh + 8 * scale;
  ctx.fillStyle = "#c0c0c0";
  ctx.beginPath();
  ctx.roundRect(bw - 4, -nh / 2, nw, nh, [0, 6, 6, 0]);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "rgba(80,80,80,0.4)";
  ctx.beginPath();
  ctx.ellipse(bw + nw - 5 * scale, 0, 4 * scale, nh / 2 - 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Base
  const baseR = 14 * scale;
  ctx.fillStyle = "#d0d0d0";
  ctx.beginPath();
  ctx.arc(0, 0, baseR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#a0a0a0";
  ctx.beginPath();
  ctx.arc(0, 0, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Nozzle foam drips
  const tipX = bw + nw - 2;
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  for (let j = 0; j < 3; j++) {
    ctx.beginPath();
    ctx.arc(tipX + rand(0, 4 * scale), rand(-6 * scale, 6 * scale), rand(2, 5) * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/* ── Draw a foam blob ── */
function drawFoam(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  opacity: number,
  specular: boolean
) {
  ctx.globalAlpha = opacity;

  // Outer glow
  const grad = ctx.createRadialGradient(x, y, r * 0.05, x, y, r);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.92)");
  grad.addColorStop(0.75, "rgba(250,252,255,0.5)");
  grad.addColorStop(1, "rgba(245,248,255,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Solid core
  ctx.globalAlpha = opacity * 0.92;
  ctx.fillStyle = "rgba(255,255,255,0.97)";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Specular (skipped on mobile for perf)
  if (specular) {
    ctx.globalAlpha = opacity * 0.55;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x - r * 0.2, y - r * 0.22, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ── Component ── */
export default function FoamCannons() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const ledgesRef = useRef<Ledge[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const cannonsRef = useRef<Cannon[]>([]);
  const configRef = useRef(getConfig(800));
  const mountedRef = useRef(false);

  const updateLedges = useCallback(() => {
    const container = canvasRef.current?.parentElement;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const els = container.querySelectorAll("[data-foam-ledge]");
    const ledges: Ledge[] = [];
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      ledges.push({ x: r.left - cRect.left, y: r.top - cRect.top, w: r.width, h: r.height });
    });
    ledgesRef.current = ledges;
  }, []);

  const initCannons = useCallback(() => {
    const { w, h } = sizeRef.current;
    const cfg = configRef.current;
    cannonsRef.current = [
      { side: "left", x: cfg.cannonInset, y: h * 0.4, angle: 0, targetAngle: 0, barrelLen: cfg.barrelLen },
      { side: "right", x: w - cfg.cannonInset, y: h * 0.4, angle: Math.PI, targetAngle: Math.PI, barrelLen: cfg.barrelLen },
    ];
  }, []);

  const emitFromCannon = useCallback((cannon: Cannon) => {
    const particles = particlesRef.current;
    const cfg = configRef.current;
    if (particles.length >= cfg.maxParticles) return;
    const tipX = cannon.x + Math.cos(cannon.angle) * (cannon.barrelLen + 10);
    const tipY = cannon.y + Math.sin(cannon.angle) * (cannon.barrelLen + 10);

    for (let i = 0; i < cfg.emitRate; i++) {
      if (particles.length >= cfg.maxParticles) break;
      const spread = rand(-0.3, 0.3);
      const speed = rand(4, 8);
      const a = cannon.angle + spread;
      particles.push({
        x: tipX + rand(-4, 4),
        y: tipY + rand(-4, 4),
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        radius: rand(cfg.particleSizeMin, cfg.particleSizeMax),
        opacity: rand(0.8, 1),
        settled: false,
        life: 0,
        maxLife: rand(350, 700),
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    mountedRef.current = true;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for mobile perf
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height };
      configRef.current = getConfig(rect.width);
      updateLedges();
      initCannons();
    };
    resize();
    window.addEventListener("resize", resize);

    // Events on parent section so canvas stays pointer-events:none
    const section = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onLeave = () => { mouseRef.current.active = false; };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top, active: true };
    };

    section?.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);
    section?.addEventListener("touchmove", onTouch, { passive: true });
    section?.addEventListener("touchstart", onTouch, { passive: true });
    section?.addEventListener("touchend", onLeave);

    let frame = 0;

    function animate() {
      if (!mountedRef.current) return;
      const { w, h } = sizeRef.current;
      const cfg = configRef.current;
      const ledges = ledgesRef.current;
      const particles = particlesRef.current;
      const cannons = cannonsRef.current;
      const mouse = mouseRef.current;

      ctx!.clearRect(0, 0, w, h);

      // Default: auto-sweep aim when no interaction (great for mobile on load)
      let aimX: number;
      let aimY: number;
      if (mouse.active) {
        aimX = mouse.x;
        aimY = mouse.y;
      } else {
        // Gentle auto-sweep across the text area
        const t = frame * 0.008;
        aimX = w / 2 + Math.sin(t) * w * 0.25;
        aimY = h * 0.35 + Math.cos(t * 0.7) * h * 0.08;
      }

      // Aim cannons
      for (const c of cannons) {
        const dx = aimX - c.x;
        const dy = aimY - c.y;
        c.targetAngle = Math.atan2(dy, dx);
        if (c.side === "left") {
          c.targetAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, c.targetAngle));
        } else {
          if (c.targetAngle > 0) c.targetAngle = Math.max(Math.PI * 2 / 3, c.targetAngle);
          else c.targetAngle = Math.min(-Math.PI * 2 / 3, c.targetAngle);
        }
        c.angle = lerp(c.angle, c.targetAngle, 0.08);
      }

      // Emit
      if (frame % cfg.emitEvery === 0) {
        for (const c of cannons) emitFromCannon(c);
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life > p.maxLife) {
          p.opacity -= 0.012;
          if (p.opacity <= 0) { particles.splice(i, 1); continue; }
        }

        if (!p.settled) {
          p.vy += GRAVITY;
          p.vx *= DRAG;
          p.vy *= DRAG;
          p.x += p.vx;
          p.y += p.vy;

          // Ledge collisions (snow on letters)
          for (const ledge of ledges) {
            const onLedgeX = p.x > ledge.x - 10 && p.x < ledge.x + ledge.w + 10;
            const landingOnTop = p.vy > 0 && p.y + p.radius > ledge.y && p.y < ledge.y + ledge.h * 0.5;

            if (onLedgeX && landingOnTop) {
              p.y = ledge.y - p.radius * rand(0.2, 0.9);
              p.vy = 0;
              p.vx *= 0.3;
              if (Math.abs(p.vx) < 0.8) {
                p.settled = true;
                p.vx = 0;
              }
              break;
            }

            const onSideLeft = p.x + p.radius > ledge.x && p.x < ledge.x + 10 && p.y > ledge.y && p.y < ledge.y + ledge.h;
            const onSideRight = p.x - p.radius < ledge.x + ledge.w && p.x > ledge.x + ledge.w - 10 && p.y > ledge.y && p.y < ledge.y + ledge.h;
            if ((onSideLeft || onSideRight) && Math.abs(p.vx) < 2) {
              p.vx *= -0.2;
              p.vy *= 0.5;
            }
          }

          // Floor
          if (p.y > h - p.radius) {
            p.y = h - p.radius;
            p.vy *= -0.15;
            p.vx *= 0.7;
            if (Math.abs(p.vy) < 0.5) {
              p.settled = true;
              p.vx = 0;
              p.vy = 0;
            }
          }

          if (p.x < -80 || p.x > w + 80 || p.y > h + 30) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          p.x += rand(-0.06, 0.06);
        }

        drawFoam(ctx!, p.x, p.y, p.radius, p.opacity, cfg.drawSpecular);
      }

      ctx!.globalAlpha = 1;
      for (const c of cannons) drawCannon(ctx!, c);

      // Aim reticle (desktop only — no reticle for touch)
      if (mouse.active && w >= 640) {
        ctx!.strokeStyle = "rgba(255,107,157,0.25)";
        ctx!.lineWidth = 1.5;
        ctx!.setLineDash([4, 4]);
        ctx!.beginPath();
        ctx!.arc(aimX, aimY, 14, 0, Math.PI * 2);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.moveTo(aimX - 8, aimY);
        ctx!.lineTo(aimX + 8, aimY);
        ctx!.moveTo(aimX, aimY - 8);
        ctx!.lineTo(aimX, aimY + 8);
        ctx!.stroke();
        ctx!.setLineDash([]);
      }

      frame++;
      frameRef.current = requestAnimationFrame(animate);
    }

    const startTimer = setTimeout(() => {
      updateLedges();
      initCannons();
      animate();
    }, 500);

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(frameRef.current);
      clearTimeout(startTimer);
      window.removeEventListener("resize", resize);
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
      section?.removeEventListener("touchmove", onTouch);
      section?.removeEventListener("touchstart", onTouch);
      section?.removeEventListener("touchend", onLeave);
    };
  }, [emitFromCannon, updateLedges, initCannons]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[15] pointer-events-none"
    />
  );
}
