"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";
import type { Skill, SkillCategory } from "@/types";

const categoryLabels: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  database: "Base de données",
  devops: "Déploiement",
};

function SignalBars({ strength }: { strength: number }) {
  return (
    <div className="flex items-end gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((bar) => (
        <motion.span
          key={bar}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: bar * 0.05, ease: "easeOut" }}
          className={`w-1.5 origin-bottom rounded-sm ${
            bar <= strength ? "bg-accent" : "bg-border"
          }`}
          style={{ height: `${8 + bar * 3}px` }}
        />
      ))}
    </div>
  );
}

export function Skills({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="competences" className="py-16 md:pl-10">
      <SectionHeader index="N.03" label="stack" title="Compétences" />

      <div className="grid gap-10 md:pl-10 lg:grid-cols-2">
        {Object.entries(grouped).map(([category, items], groupIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: groupIndex * 0.06, ease: "easeOut" }}
          >
            <h3 className="signal-tag mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              {categoryLabels[category as SkillCategory] ?? category}
            </h3>
            <ul className="space-y-3">
              {items.map((skill) => (
                <li
                  key={skill._id ?? skill.name}
                  className="group flex items-center justify-between border-b border-border pb-3 transition-colors hover:border-accent"
                >
                  <span className="text-sm text-text transition-transform group-hover:translate-x-1">
                    {skill.name}
                  </span>
                  <SignalBars strength={skill.strength} />
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
