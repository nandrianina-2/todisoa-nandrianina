# Portfolio — Todisoa

Portfolio full-stack avec contenu éditable stocké dans MongoDB.

**Stack :** Next.js 15 (App Router) · MongoDB / Mongoose · NextAuth v5 · Tailwind CSS · Framer Motion

## Design

Le fil conducteur visuel du site s'appelle **le Fil** : une ligne verticale qui traverse
toute la page et se remplit d'un accent bleu signal au fil du scroll (clin d'œil à ton
projet *LeFilMobile*, sans reprendre une teinte orange/terracotta trop associée aux
designs génériques). Chaque section est marquée par un "nœud" sur ce fil, comme un
point de soudure. Un fond animé discret (petits nœuds qui s'échangent des impulsions
lumineuses) prolonge cette idée de signal en arrière-plan. Les compétences sont
affichées sous forme de barres de signal plutôt que de barres de progression
classiques, et le toggle clair/sombre est stylisé comme un interrupteur.

Palette : fond graphite neutre (ni le beige crème, ni le noir pur), accent bleu
électrique (façon fibre optique / voyant LED) — volontairement froid et technique,
à l'opposé des accents chauds (orange, terracotta, doré) devenus des réflexes
reconnaissables des designs générés par IA.
Typographie : Bricolage Grotesque (titres), Work Sans (texte), IBM Plex Mono
(données, tags de stack).

Deux thèmes : sombre (par défaut) et clair, mémorisés en local sur le navigateur du
visiteur.

## Installation (PowerShell / Windows)

```powershell
cd portfolio
npm install
Copy-Item .env.example .env.local
```

Édite `.env.local` :

1. `MONGODB_URI` — ta chaîne de connexion (Atlas ou locale).
2. `ADMIN_EMAIL` — l'email avec lequel tu te connecteras à `/admin`.
3. `ADMIN_PASSWORD_HASH` — génère-le avec :
   ```powershell
   node -e "console.log(require('bcryptjs').hashSync('ton-mot-de-passe', 10))"
   ```
4. `AUTH_SECRET` — génère-le avec :
   ```powershell
   npx auth secret
   ```

## Remplir le contenu de départ

Le script de seed insère un profil et des projets basés sur ce que je connais déjà de
ton travail (Le Fil, Moozik, StockFlow, MeChat, l'extension Media→MP3, pred.js).
Modifie librement `scripts/seed.ts` avant de lancer, ou édite tout ensuite depuis `/admin`.

```powershell
npm run seed
```

## Lancer en développement

```powershell
npm run dev
```

- Portfolio public : http://localhost:3000
- Panel admin : http://localhost:3000/admin/login

## Déploiement (Vercel)

1. Pousse le repo sur GitHub.
2. Importe-le dans Vercel.
3. Ajoute les mêmes variables d'environnement (`MONGODB_URI`, `ADMIN_EMAIL`,
   `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`) dans les Project Settings.
4. Déploie. Le contenu vient directement de MongoDB Atlas, donc aucune donnée
   n'est perdue entre les déploiements.

## Structure

```
src/
  app/
    page.tsx              → page publique (récupère les données MongoDB)
    admin/                 → panel d'administration protégé
    api/                   → routes CRUD (profile, projects, skills)
  components/               → Hero, About, Projects, Skills, Contact, Trace...
  models/                    → schémas Mongoose (Profile, Project, Skill)
  lib/
    mongodb.ts               → connexion réutilisable
    auth.ts                   → configuration NextAuth v5
scripts/seed.ts              → contenu de départ
```

## Modifier le contenu

Tout le contenu affiché (profil, projets, compétences) est modifiable depuis `/admin`
sans toucher au code : ajoute, modifie ou supprime des projets et compétences, ou
change ta bio et ta disponibilité. Les changements apparaissent sur le site public
au rechargement (revalidation automatique toutes les 60 secondes).
