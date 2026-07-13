import { connectDB } from "@/lib/mongodb";
import ProfileModel from "@/models/Profile";
import ProjectModel from "@/models/Project";
import SkillModel from "@/models/Skill";
import { PageShell } from "@/components/page-shell";
import type { Profile, Project, Skill } from "@/types";

export const dynamic = "force-dynamic";

async function getData() {
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
  };
}

export default async function Home() {
  const { profile, projects, skills } = await getData();

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
