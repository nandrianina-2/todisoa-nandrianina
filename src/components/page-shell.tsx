"use client";

import { useRef } from "react";
import { Trace } from "./trace";
import { Hero } from "./hero";
import { About } from "./about";
import { Projects } from "./projects";
import { Skills } from "./skills";
import { Contact } from "./contact";
import { ThemeToggle } from "./theme-toggle";
import type { Profile, Project, Skill } from "@/types";

export function PageShell({
  profile,
  projects,
  skills,
}: {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-5xl px-6">
      <Trace containerRef={containerRef} />

      <header className="flex items-center justify-between py-8">
        <span className="signal-tag text-sm tracking-tight text-text">
          {profile.name.split(" ")[0]}<span className="text-accent">.</span>
        </span>
        <ThemeToggle />
      </header>

      <Hero profile={profile} />
      <About profile={profile} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Contact profile={profile} />

      <footer className="border-t border-border py-8 text-xs text-muted md:pl-10">
        © {new Date().getFullYear()} {profile.name} — construit avec Next.js
        &amp; MongoDB.
      </footer>
    </div>
  );
}
