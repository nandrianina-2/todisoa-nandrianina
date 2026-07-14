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
        <span
          key={bar}
          className={`w-1.5 rounded-sm ${
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
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="signal-tag mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              {categoryLabels[category as SkillCategory] ?? category}
            </h3>
            <ul className="space-y-3">
              {items.map((skill) => (
                <li
                  key={skill._id ?? skill.name}
                  className="flex items-center justify-between border-b border-border pb-3"
                >
                  <span className="text-sm text-text">{skill.name}</span>
                  <SignalBars strength={skill.strength} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
