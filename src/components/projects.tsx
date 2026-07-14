"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { SectionHeader } from "./section-header";
import type { Project } from "@/types";

const statusMeta: Record<Project["status"], { label: string; color: string }> = {
  live: { label: "actif", color: "bg-live" },
  paused: { label: "en pause", color: "bg-idle" },
  archived: { label: "archivé", color: "bg-off" },
};

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projets" className="py-16 md:pl-10">
      <SectionHeader
        index="N.02"
        label={`${projects.length} projets`}
        title="Projets"
      />

      <div className="grid gap-6 md:pl-10 lg:grid-cols-2">
        {projects.map((project, i) => {
          const status = statusMeta[project.status];
          return (
            <motion.article
              key={project._id ?? project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className="group relative flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl font-medium text-text">
                  {project.title}
                </h3>
                <span className="flex shrink-0 items-center gap-1.5 signal-tag text-[11px] uppercase tracking-wide text-muted">
                  <span className={`h-1.5 w-1.5 rounded-full ${status.color}`} />
                  {status.label}
                </span>
              </div>

              <p className="mt-2 text-sm font-medium text-accent">
                {project.pitch}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="signal-tag rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex gap-4 text-sm">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-text transition-colors hover:text-accent"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Démo
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-text transition-colors hover:text-accent"
                  >
                    <Github className="h-3.5 w-3.5" />
                    Code
                  </a>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
