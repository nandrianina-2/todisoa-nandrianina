import { SectionHeader } from "./section-header";
import type { Profile } from "@/types";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="a-propos" className="py-24 md:pl-10">
      <SectionHeader index="N.01" label="profil" title="À propos" />
      <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted md:pl-10 sm:text-lg">
        {profile.bio.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
