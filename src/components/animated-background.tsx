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

    function getColors() {
      const styles = getComputedStyle(document.documentElement);
      return {
        dot: styles.getPropertyValue("--border").trim() || "#333",
        signal: styles.getPropertyValue("--accent").trim() || "#b8860b",
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

    function draw() {
      if (!ctx) return;
      const { dot, signal } = getColors();
      ctx.clearRect(0, 0, width, height);

      // Nœuds : points discrets, quasi immobiles
      ctx.fillStyle = dot;
      ctx.globalAlpha = 0.55;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Impulsions : segment qui s'illumine en voyageant d'un nœud à l'autre
      for (const p of pulses) {
        const x = p.from.x + (p.to.x - p.from.x) * p.progress;
        const y = p.from.y + (p.to.y - p.from.y) * p.progress;

        const fade = Math.sin(Math.PI * p.progress); // monte puis redescend

        ctx.strokeStyle = signal;
        ctx.globalAlpha = fade * 0.35;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.from.x, p.from.y);
        ctx.lineTo(p.to.x, p.to.y);
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

    resize();
    draw();
    if (!reduceMotion) {
      frameId = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
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
