"use client";

import { useEffect, useState } from "react";
import type { Skill, SkillCategory } from "@/types";

const emptySkill: Skill = {
  name: "",
  category: "frontend",
  strength: 3,
  order: 0,
};

const categories: { value: SkillCategory; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "mobile", label: "Mobile" },
  { value: "database", label: "Base de données" },
  { value: "devops", label: "Déploiement" },
];

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<Skill>(emptySkill);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/skills");
    setSkills(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      await fetch(`/api/skills/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm(emptySkill);
    setEditingId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette compétence ?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
        admin
      </p>
      <h1 className="mt-2 font-display text-3xl text-text">Compétences</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Nom (ex: React)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className="input"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as SkillCategory })
            }
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-muted">
              Niveau (1 à 5)
            </label>
            <input
              className="input"
              type="number"
              min={1}
              max={5}
              value={form.strength}
              onChange={(e) =>
                setForm({ ...form, strength: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted">Ordre</label>
            <input
              className="input"
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accentStrong"
          >
            {editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptySkill);
                setEditingId(null);
              }}
              className="rounded-full border border-border px-6 py-2.5 text-sm text-muted hover:text-text"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="mt-10 space-y-3">
        {loading && <p className="text-sm text-muted">Chargement...</p>}
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3"
          >
            <div>
              <p className="text-sm font-medium text-text">{skill.name}</p>
              <p className="text-xs text-muted">
                {skill.category} — niveau {skill.strength}/5
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <button
                onClick={() => {
                  setForm(skill);
                  setEditingId(skill._id ?? null);
                }}
                className="text-muted hover:text-accent"
              >
                Modifier
              </button>
              <button
                onClick={() => skill._id && handleDelete(skill._id)}
                className="text-muted hover:text-red-500"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}
