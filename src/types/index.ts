export interface Profile {
  _id?: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  avatarUrl?: string;
  resumeUrl?: string;
  availableForWork: boolean;
}

export type ProjectStatus = "live" | "paused" | "archived";
export type ProjectCategory = "web" | "mobile" | "extension" | "outil";

export interface Project {
  _id?: string;
  title: string;
  slug: string;
  pitch: string;
  description: string;
  stack: string[];
  role: string;
  status: ProjectStatus;
  category: ProjectCategory;
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
}

export type SkillCategory =
  | "frontend"
  | "backend"
  | "mobile"
  | "database"
  | "devops";

export interface Skill {
  _id?: string;
  name: string;
  category: SkillCategory;
  strength: number;
  order: number;
}
