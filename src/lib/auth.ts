import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import LoginAttempt from "@/models/LoginAttempt";
import { authConfig } from "@/lib/auth.config";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // fenêtre de comptage : 15 min
const LOCK_MS = 15 * 60 * 1000; // durée du blocage : 15 min

// Config complète, avec accès MongoDB : utilisée uniquement côté Node.js
// (routes API /api/auth, pages serveur). Ne jamais importer ce fichier
// depuis middleware.ts (environnement Edge, incompatible avec Mongoose).
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error(
            "ADMIN_EMAIL / ADMIN_PASSWORD_HASH non configurés dans .env.local"
          );
        }

        const key = email.toLowerCase();

        await connectDB();
        const now = new Date();
        const attempt = await LoginAttempt.findOne({ key });

        // Déjà bloqué : on refuse sans même vérifier le mot de passe
        if (attempt?.blockedUntil && attempt.blockedUntil > now) {
          return null;
        }

        if (
          key !== adminEmail.toLowerCase() ||
          !(await bcrypt.compare(password, adminPasswordHash))
        ) {
          // Échec : on incrémente le compteur (fenêtre glissante de 15 min)
          if (!attempt || now.getTime() - attempt.firstAttemptAt.getTime() > WINDOW_MS) {
            await LoginAttempt.findOneAndUpdate(
              { key },
              { key, count: 1, firstAttemptAt: now, blockedUntil: undefined },
              { upsert: true }
            );
          } else {
            const count = attempt.count + 1;
            await LoginAttempt.findOneAndUpdate(
              { key },
              {
                count,
                blockedUntil:
                  count >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCK_MS) : undefined,
              }
            );
          }
          return null;
        }

        // Connexion réussie : on réinitialise le compteur
        await LoginAttempt.deleteOne({ key });

        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],
});
