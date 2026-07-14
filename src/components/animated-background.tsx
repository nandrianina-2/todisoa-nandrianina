"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Pulse {
  from: Node;
  to: Node;
  progress: number; // 0 à 1
  speed: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let frameId = 0;
    let visible = !document.hidden;

    const MAX_LINK_DIST = 170;
    const MAX_PULSES = 5;
    const HOVER_RADIUS = 150;
    const REPEL_RADIUS = 110;
    const REPEL_DISTANCE = 16; // décalage max en px, purement visuel

    const mouse = { x: -9999, y: -9999, active: false };

    function getColors() {
      const styles = getComputedStyle(document.documentElement);
      return {
        dot: styles.getPropertyValue("--border").trim() || "#333",
        signal: styles.getPropertyValue("--accent").trim() || "#0284c7",
      };
    }

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = 22000; // px² par nœud, ajuste la densité globale
      const count = Math.min(90, Math.max(28, Math.floor((width * height) / density)));

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
      pulses = [];
    }

    function maybeSpawnPulse() {
      if (pulses.length >= MAX_PULSES || Math.random() > 0.02) return;

      const from = nodes[Math.floor(Math.random() * nodes.length)];
      let best: Node | null = null;
      let bestDist = MAX_LINK_DIST;

      for (const candidate of nodes) {
        if (candidate === from) continue;
        const d = Math.hypot(candidate.x - from.x, candidate.y - from.y);
        if (d < bestDist) {
          bestDist = d;
          best = candidate;
        }
      }

      if (best) {
        pulses.push({ from, to: best, progress: 0, speed: 0.006 + Math.random() * 0.006 });
      }
    }

    // Position affichée d'un nœud : sa position ambiante + un léger décalage
    // s'il est proche du curseur. Purement visuel, ne modifie jamais vx/vy,
    // donc la dérive de fond n'est jamais perturbée par le survol.
    function displayPos(n: Node): { x: number; y: number } {
      if (!mouse.active) return { x: n.x, y: n.y };

      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d >= REPEL_RADIUS || d < 0.001) return { x: n.x, y: n.y };

      const push = ((REPEL_RADIUS - d) / REPEL_RADIUS) * REPEL_DISTANCE;
      return { x: n.x + (dx / d) * push, y: n.y + (dy / d) * push };
    }

    function draw() {
      if (!ctx) return;
      const { dot, signal } = getColors();
      ctx.clearRect(0, 0, width, height);

      // Nœuds : points discrets, quasi immobiles (+ léger écart si proches du curseur)
      ctx.fillStyle = dot;
      ctx.globalAlpha = 0.55;
      for (const n of nodes) {
        const { x, y } = displayPos(n);
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Impulsions : segment qui s'illumine en voyageant d'un nœud à l'autre
      for (const p of pulses) {
        const from = displayPos(p.from);
        const to = displayPos(p.to);
        const x = from.x + (to.x - from.x) * p.progress;
        const y = from.y + (to.y - from.y) * p.progress;

        const fade = Math.sin(Math.PI * p.progress); // monte puis redescend

        ctx.strokeStyle = signal;
        ctx.globalAlpha = fade * 0.35;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();

        ctx.globalAlpha = fade * 0.9;
        ctx.fillStyle = signal;
        ctx.shadowColor = signal;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // Réaction au curseur : lueur douce + lignes de proximité vers les nœuds proches
      if (mouse.active) {
        for (const n of nodes) {
          const { x, y } = displayPos(n);
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d > HOVER_RADIUS) continue;

          const proximity = 1 - d / HOVER_RADIUS;

          ctx.strokeStyle = signal;
          ctx.globalAlpha = proximity * 0.3;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();

          ctx.fillStyle = signal;
          ctx.globalAlpha = 0.4 + proximity * 0.6;
          ctx.beginPath();
          ctx.arc(x, y, 1.1 + proximity * 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          HOVER_RADIUS
        );
        glow.addColorStop(0, signal);
        glow.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, HOVER_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
      }
    }

    function step() {
      if (!reduceMotion) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }

        maybeSpawnPulse();
        pulses = pulses.filter((p) => p.progress <= 1);
        for (const p of pulses) p.progress += p.speed;
      }

      draw();

      if (!reduceMotion && visible) {
        frameId = requestAnimationFrame(step);
      }
    }

    function handleVisibility() {
      visible = !document.hidden;
      if (visible && !reduceMotion) {
        frameId = requestAnimationFrame(step);
      }
    }

    function handlePointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      if (reduceMotion) draw(); // redessine ponctuellement, sans boucle continue
    }

    function handlePointerLeave() {
      mouse.active = false;
      if (reduceMotion) draw();
    }

    resize();
    draw();
    if (!reduceMotion) {
      frameId = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
