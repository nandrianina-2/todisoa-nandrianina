import type { NextAuthConfig } from "next-auth";

// Config partagée, compatible avec l'environnement Edge du middleware :
// aucune dépendance à Mongoose/MongoDB ici. La logique d'authentification
// complète (avec accès DB) vit dans auth.ts, chargé uniquement côté Node.js
// (routes API, pages serveur).
export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
