import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import Profile from "../src/models/Profile";
import Project from "../src/models/Project";
import Skill from "../src/models/Skill";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI manquant dans .env.local");

  await mongoose.connect(uri);
  console.log("Connecté à MongoDB");

  await Profile.deleteMany({});
  await Project.deleteMany({});
  await Skill.deleteMany({});

  await Profile.create({
    name: "Todisoa",
    title: "Développeur Full-Stack",
    tagline:
      "Je construis des ponts entre les appareils, les données et les gens — du web au mobile, en temps réel.",
    bio:
      "Développeur full-stack basé à Madagascar, je conçois des applications web et mobiles complètes, du schéma de base de données jusqu'à l'interface.\n\nJ'aime particulièrement les projets où les données circulent en temps réel entre plusieurs appareils : streaming audio, synchronisation téléphone/dashboard, messagerie instantanée. Mon stack de prédilection : Next.js, MongoDB, NextAuth et Tailwind CSS, déployé sur Vercel.\n\nEn dehors du code, je m'intéresse aussi à la production de contenu (rédaction, documents techniques) et à l'agronomie.",
    location: "Madagascar",
    email: "contact@todisoa.dev",
    socials: {
      github: "https://github.com/",
      linkedin: "",
      website: "",
    },
    availableForWork: true,
  });

  await Project.insertMany([
    {
      title: "Le Fil",
      slug: "le-fil",
      pitch: "Un pont temps réel entre ton téléphone et ton dashboard web.",
      description:
        "Application Android (React Native) couplée à un dashboard Next.js : notifications, SMS, appels et état de l'appareil sont mirrorés en direct via Socket.IO. Interface au thème cuivré, pensée comme un véritable poste de contrôle.",
      stack: ["React Native", "Node.js", "Socket.IO", "Next.js", "MongoDB"],
      role: "Développeur solo — architecture complète",
      status: "live",
      category: "mobile",
      featured: true,
      order: 0,
    },
    {
      title: "Moozik",
      slug: "moozik",
      pitch: "Plateforme de streaming musical, installable comme une app.",
      description:
        "Service de streaming audio avec lecteur persistant, mode hors-ligne (PWA + cache Workbox), thèmes clair/sombre et panneau de notifications. Upload des fichiers volumineux géré via un backend dédié.",
      stack: ["Next.js", "MongoDB", "NextAuth", "Tailwind CSS"],
      role: "Développeur solo — full-stack",
      status: "live",
      category: "web",
      featured: true,
      order: 1,
    },
    {
      title: "StockFlow",
      slug: "stockflow",
      pitch: "Gestion d'inventaire pensée pour la production.",
      description:
        "Application de gestion de stock avec une architecture de 15 collections MongoDB, authentification par rôles et un plan de build en 7 phases pour une mise en production propre.",
      stack: ["Next.js", "MongoDB", "TypeScript", "NextAuth"],
      role: "Développeur solo — architecture & développement",
      status: "live",
      category: "web",
      featured: true,
      order: 2,
    },
    {
      title: "MeChat",
      slug: "mechat",
      pitch: "Application de messagerie et d'appels vidéo mobile.",
      description:
        "Chat en temps réel construit avec React Native/Expo, Firebase pour l'authentification et Stream Chat/Video SDK pour la messagerie et les appels vidéo.",
      stack: ["React Native", "Expo", "Firebase", "Stream Chat"],
      role: "Développeur solo",
      status: "paused",
      category: "mobile",
      featured: false,
      order: 3,
    },
    {
      title: "Media → MP3",
      slug: "media-mp3",
      pitch: "Extension Chrome pour convertir des vidéos en audio.",
      description:
        "Extension de navigateur couplée à un backend Python (yt-dlp) supportant le téléchargement multi-plateformes (YouTube, TikTok, Instagram...).",
      stack: ["Chrome Extension", "Python", "yt-dlp", "Render"],
      role: "Développeur solo",
      status: "live",
      category: "extension",
      featured: false,
      order: 4,
    },
    {
      title: "pred.js",
      slug: "pred-js",
      pitch: "Widget statistique d'overlay pour jeu de type crash game.",
      description:
        "Widget injectable dans le navigateur avec un moteur de prédiction multi-modèle à poids adaptatifs, et une interface redimensionnable.",
      stack: ["JavaScript", "Chart.js"],
      role: "Développeur solo",
      status: "archived",
      category: "outil",
      featured: false,
      order: 5,
    },
  ]);

  await Skill.insertMany([
    { name: "React", category: "frontend", strength: 5, order: 0 },
    { name: "Next.js", category: "frontend", strength: 5, order: 1 },
    { name: "TypeScript", category: "frontend", strength: 4, order: 2 },
    { name: "Tailwind CSS", category: "frontend", strength: 5, order: 3 },
    { name: "Framer Motion", category: "frontend", strength: 3, order: 4 },

    { name: "Node.js", category: "backend", strength: 4, order: 0 },
    { name: "Express", category: "backend", strength: 4, order: 1 },
    { name: "NextAuth v5", category: "backend", strength: 4, order: 2 },
    { name: "Socket.IO", category: "backend", strength: 3, order: 3 },

    { name: "React Native", category: "mobile", strength: 4, order: 0 },
    { name: "Expo", category: "mobile", strength: 3, order: 1 },

    { name: "MongoDB", category: "database", strength: 5, order: 0 },
    { name: "Mongoose", category: "database", strength: 4, order: 1 },

    { name: "Vercel", category: "devops", strength: 4, order: 0 },
    { name: "Render", category: "devops", strength: 3, order: 1 },
    { name: "Git", category: "devops", strength: 4, order: 2 },
  ]);

  console.log("Contenu de départ inséré avec succès.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
