"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import type { Profile } from "@/types";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="a-propos" className="py-16 md:pl-10">
      <SectionHeader index="N.01" label="profil" title="À propos" />
      <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted md:pl-10 sm:text-lg">
        {profile.bio.split("\n\n").map((paragraph, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
