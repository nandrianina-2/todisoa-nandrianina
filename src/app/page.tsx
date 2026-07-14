import { connectDB } from "@/lib/mongodb";
import ProfileModel from "@/models/Profile";
import ProjectModel from "@/models/Project";
import SkillModel from "@/models/Skill";
import { PageShell } from "@/components/page-shell";
import type { Profile, Project, Skill } from "@/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    await connectDB();

    const [profile, projects, skills] = await Promise.all([
      ProfileModel.findOne().lean(),
      ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean(),
      SkillModel.find().sort({ category: 1, order: 1 }).lean(),
    ]);

    return {
      profile: JSON.parse(JSON.stringify(profile)) as Profile | null,
      projects: JSON.parse(JSON.stringify(projects)) as Project[],
      skills: JSON.parse(JSON.stringify(skills)) as Skill[],
      error: null as string | null,
    };
  } catch (err) {
    console.error("Erreur de connexion MongoDB sur la page d'accueil", err);
    return {
      profile: null,
      projects: [] as Project[],
      skills: [] as Skill[],
      error: "db",
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getData();

  if (!profile) {
    return {
      title: "Portfolio",
      description: "Portfolio full-stack.",
    };
  }

  const title = `${profile.name} — ${profile.title}`;
  const description = profile.tagline;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.avatarUrl ? [profile.avatarUrl] : undefined,
    },
  };
}

export default async function Home() {
  const { profile, projects, skills, error } = await getData();

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
            connexion indisponible
          </p>
          <h1 className="mt-4 font-display text-2xl text-text">
            Impossible de contacter la base de données
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted">
            Vérifie que <code>MONGODB_URI</code> est correct et que ton IP est
            autorisée sur MongoDB Atlas, puis recharge la page.
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
            configuration requise
          </p>
          <h1 className="mt-4 font-display text-2xl text-text">
            Aucun profil trouvé
          </h1>
          <p className="mt-2 max-w-md text-sm text-muted">
            Lance le script de seed (<code>npm run seed</code>) ou crée ton
            profil depuis <code>/admin</code> pour afficher ton portfolio.
          </p>
        </div>
      </main>
    );
  }

  return <PageShell profile={profile} projects={projects} skills={skills} />;
}
