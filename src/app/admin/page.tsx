import Link from "next/link";

const cards = [
  {
    href: "/admin/profile",
    title: "Profil",
    desc: "Nom, bio, tagline, réseaux, disponibilité.",
  },
  {
    href: "/admin/projects",
    title: "Projets",
    desc: "Ajouter, modifier, réordonner tes projets.",
  },
  {
    href: "/admin/skills",
    title: "Compétences",
    desc: "Gérer les technologies et leur niveau.",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
        admin
      </p>
      <h1 className="mt-2 font-display text-3xl text-text">Tableau de bord</h1>
      <p className="mt-2 text-sm text-muted">
        Le contenu affiché sur ton portfolio public est stocké dans MongoDB.
        Modifie-le ici, les changements apparaissent en direct.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent"
          >
            <h2 className="font-display text-lg text-text">{card.title}</h2>
            <p className="mt-1 text-sm text-muted">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
