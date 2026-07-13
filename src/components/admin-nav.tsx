"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/profile", label: "Profil" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/skills", label: "Compétences" },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname === "/admin/login") return null;

  return (
    <nav className="border-b border-border">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`signal-tag text-xs uppercase tracking-wide transition-colors ${
                pathname === link.href
                  ? "text-accent"
                  : "text-muted hover:text-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {session && (
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="text-xs text-muted transition-colors hover:text-accent"
          >
            Se déconnecter
          </button>
        )}
      </div>
    </nav>
  );
}
