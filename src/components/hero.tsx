"use client";

import { motion } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import type { Profile } from "@/types";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative flex min-h-[92vh] flex-col justify-center py-24 md:pl-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-14 md:grid-cols-[1.3fr_0.9fr] md:items-center"
      >
        <div>
          <motion.p
            variants={item}
            className="signal-tag flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-node rounded-full bg-live" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            {profile.availableForWork
              ? "Disponible pour un nouveau projet"
              : "Actuellement occupé"}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-7xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 font-display text-xl text-accent sm:text-2xl"
          >
            {profile.title}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projets"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03] hover:bg-accentStrong"
            >
              Voir les projets
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              Me contacter
            </a>
          </motion.div>
        </div>

        {/* Panneau "signal" — écho visuel du produit phare (pont téléphone / dashboard) */}
        <motion.div
          variants={item}
          className="relative rounded-2xl border border-border bg-surface p-6 font-mono text-sm shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
              connexion
            </span>
            <span className="flex items-center gap-2 text-xs text-live">
              <span className="h-1.5 w-1.5 rounded-full bg-live" />
              stable
            </span>
          </div>

          <ul className="mt-4 space-y-3 text-muted">
            <li className="flex items-center justify-between">
              <span>appareil</span>
              <span className="text-text">web ⇄ mobile</span>
            </li>
            <li className="flex items-center justify-between">
              <span>latence</span>
              <span className="text-text">~40ms</span>
            </li>
            <li className="flex items-center justify-between">
              <span>stack</span>
              <span className="text-text">next.js · mongodb</span>
            </li>
            <li className="flex items-center justify-between">
              <span>localisation</span>
              <span className="text-text">{profile.location}</span>
            </li>
          </ul>

          <div className="mt-5 flex gap-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <span
                key={bar}
                className="h-4 w-1.5 rounded-full bg-accent"
                style={{ opacity: 0.4 + bar * 0.12 }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#a-propos"
        variants={item}
        initial="hidden"
        animate="show"
        className="mt-16 flex items-center gap-2 text-xs text-muted transition-colors hover:text-accent md:mt-24"
      >
        <ArrowDown className="h-3.5 w-3.5" />
        défiler
      </motion.a>
    </section>
  );
}
