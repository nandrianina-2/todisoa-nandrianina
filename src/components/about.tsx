import { SectionHeader } from "./section-header";
import type { Profile } from "@/types";

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="a-propos" className="py-24 md:pl-10">
      <SectionHeader index="N.01" label="profil" title="À propos" />
      <div className="grid gap-10 md:grid-cols-[auto_1fr] md:pl-10">
        {profile.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-28 w-28 rounded-2xl border border-border object-cover"
          />
        )}
        <div className="max-w-2xl space-y-4 text-base leading-relaxed text-muted sm:text-lg">
          {profile.bio.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
