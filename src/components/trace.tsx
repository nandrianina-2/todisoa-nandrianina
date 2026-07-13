"use client";

import { useScroll, useSpring, motion } from "framer-motion";
import type { RefObject } from "react";

export function Trace({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.3,
  });

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 hidden h-full w-px md:block"
      aria-hidden="true"
    >
      {/* Base : le fil au repos */}
      <div className="absolute inset-0 w-px bg-border" />

      {/* Signal : progresse avec la lecture de la page */}
      <motion.div
        className="absolute left-0 top-0 w-px origin-top bg-accent"
        style={{
          scaleY: smoothProgress,
          height: "100%",
          boxShadow: "0 0 8px var(--accent)",
        }}
      />
    </div>
  );
}
