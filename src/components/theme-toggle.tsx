"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-pressed={isDark}
      className="group relative flex h-8 w-14 items-center rounded-full border border-border bg-surface2 px-1 transition-colors"
    >
      <span
        className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 0 0 1px var(--accent)`,
        }}
      />
      <span
        className={`h-5 w-5 rounded-full bg-accent shadow-sm transition-transform duration-300 ease-out ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      />
      <span className="sr-only">Basculer le thème</span>
    </button>
  );
}
