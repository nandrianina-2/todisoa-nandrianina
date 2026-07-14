import { z } from "zod";

// Accepte soit une URL valide, soit une chaîne vide (champ non renseigné)
const optionalUrl = z
  .string()
  .trim()
  .refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Doit être une URL valide ou vide",
  })
  .optional()
  .or(z.literal(""));

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100),
  title: z.string().trim().min(1, "Le titre est requis").max(150),
  tagline: z.string().trim().min(1, "La tagline est requise").max(300),
  bio: z.string().trim().min(1, "La bio est requise").max(5000),
  location: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email("Email invalide"),
  socials: z
    .object({
      github: optionalUrl,
      linkedin: optionalUrl,
      twitter: optionalUrl,
      website: optionalUrl,
    })
    .default({}),
  avatarUrl: optionalUrl,
  resumeUrl: optionalUrl,
  availableForWork: z.boolean().default(true),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis").max(150),
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est requis")
    .max(150)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug ne peut contenir que des minuscules, chiffres et tirets"
    ),
  pitch: z.string().trim().min(1, "Le pitch est requis").max(300),
  description: z.string().trim().min(1, "La description est requise").max(3000),
  stack: z.array(z.string().trim().min(1)).default([]),
  role: z.string().trim().max(150).optional().default(""),
  status: z.enum(["live", "paused", "archived"]).default("live"),
  category: z.enum(["web", "mobile", "extension", "outil"]).default("web"),
  imageUrl: optionalUrl,
  demoUrl: optionalUrl,
  repoUrl: optionalUrl,
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(80),
  category: z.enum(["frontend", "backend", "mobile", "database", "devops"]),
  strength: z.number().int().min(1).max(5).default(3),
  order: z.number().int().default(0),
});

export function formatZodError(error: z.ZodError) {
  return error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" · ");
}
