"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Globe } from "lucide-react";
import { SectionHeader } from "./section-header";
import type { Profile } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="py-16 pb-20 md:pl-10">
      <SectionHeader index="N.04" label="disponibilité" title="Contact" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="max-w-xl md:pl-10"
      >
        <motion.p
          variants={fadeUp}
          className="text-base leading-relaxed text-muted sm:text-lg"
        >
          {profile.availableForWork
            ? "Un projet en tête ? Discutons de ce que je peux construire pour vous."
            : "Pas disponible pour de nouveaux projets pour le moment, mais n'hésitez pas à me contacter."}
        </motion.p>

        <motion.a
          variants={fadeUp}
          href={`mailto:${profile.email}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.03] hover:bg-accentStrong"
        >
          <Mail className="h-4 w-4" />
          {profile.email}
        </motion.a>

        <motion.div variants={fadeUp} className="mt-10 flex gap-5">
          {profile.socials.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-muted transition-all hover:-translate-y-0.5 hover:text-accent"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          {profile.socials.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-muted transition-all hover:-translate-y-0.5 hover:text-accent"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {profile.socials.website && (
            <a
              href={profile.socials.website}
              target="_blank"
              rel="noreferrer"
              aria-label="Site web"
              className="text-muted transition-all hover:-translate-y-0.5 hover:text-accent"
            >
              <Globe className="h-5 w-5" />
            </a>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
