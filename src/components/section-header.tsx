"use client";

import { motion } from "framer-motion";

export function SectionHeader({
  index,
  label,
  title,
}: {
  index: string;
  label: string;
  title: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mb-8 md:pl-10"
    >
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4, delay: 0.2, ease: "backOut" }}
        className="absolute -left-[5px] top-2 hidden h-3 w-3 rounded-full border-2 border-accent bg-bg md:block"
      />
      <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
        {index} — {label}
      </p>
      <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="mt-4 h-px w-16 origin-left bg-accent"
      />
    </motion.div>
  );
}
