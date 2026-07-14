"use client";

import { useEffect, useState } from "react";
import { GripVertical } from "lucide-react";
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
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    setError("");

    const res = editingId
      ? await fetch(`/api/skills/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      return;
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

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [reorderError, setReorderError] = useState("");

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    // On ne réordonne qu'à l'intérieur d'une même catégorie (les compétences
    // sont groupées par catégorie sur le site public).
    if (skills[dragIndex].category !== skills[index].category) return;

    setSkills((current) => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDragIndex(index);
  }

  async function handleDragEnd() {
    setDragIndex(null);
    setReorderError("");

    const items: { id: string; order: number }[] = [];
    let counter = 0;
    let lastCategory: string | null = null;

    for (const s of skills) {
      if (s.category !== lastCategory) {
        counter = 0;
        lastCategory = s.category;
      }
      if (s._id) items.push({ id: s._id, order: counter });
      counter++;
    }

    const res = await fetch("/api/skills/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      setReorderError("Impossible d'enregistrer le nouvel ordre.");
    }
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
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accentStrong disabled:opacity-60"
          >
            {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setForm(emptySkill);
                setEditingId(null);
                setError("");
              }}
              className="rounded-full border border-border px-6 py-2.5 text-sm text-muted hover:text-text"
            >
              Annuler
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      <div className="mt-10 space-y-3">
        {loading && <p className="text-sm text-muted">Chargement...</p>}
        {!loading && skills.length > 1 && (
          <p className="text-xs text-muted">
            Glisse-dépose les compétences pour changer leur ordre (à
            l&apos;intérieur d&apos;une même catégorie).
          </p>
        )}
        {reorderError && <p className="text-xs text-red-500">{reorderError}</p>}
        {skills.map((skill, index) => (
          <div
            key={skill._id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3 transition-opacity ${
              dragIndex === index ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted active:cursor-grabbing" />
              <div>
                <p className="text-sm font-medium text-text">{skill.name}</p>
                <p className="text-xs text-muted">
                  {skill.category} — niveau {skill.strength}/5
                </p>
              </div>
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
