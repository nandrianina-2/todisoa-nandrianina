"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/types";

const emptyProject: Project = {
  title: "",
  slug: "",
  pitch: "",
  description: "",
  stack: [],
  role: "",
  status: "live",
  category: "web",
  featured: false,
  order: 0,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/projects");
    setProjects(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form };

    if (editingId) {
      await fetch(`/api/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(emptyProject);
    setEditingId(null);
    load();
  }

  function startEdit(project: Project) {
    setForm(project);
    setEditingId(project._id ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
        admin
      </p>
      <h1 className="mt-2 font-display text-3xl text-text">Projets</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6"
      >
        <h2 className="font-display text-lg text-text">
          {editingId ? "Modifier le projet" : "Nouveau projet"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Titre"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            className="input"
            placeholder="Slug (ex: moozik)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>

        <input
          className="input"
          placeholder="Pitch (une phrase)"
          value={form.pitch}
          onChange={(e) => setForm({ ...form, pitch: e.target.value })}
          required
        />

        <textarea
          className="input min-h-[100px]"
          placeholder="Description détaillée"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Stack, séparée par des virgules (Next.js, MongoDB, ...)"
          value={form.stack.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              stack: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Rôle (ex: Développeur solo)"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <input
            className="input"
            type="number"
            placeholder="Ordre d'affichage"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Lien démo (optionnel)"
            value={form.demoUrl ?? ""}
            onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
          />
          <input
            className="input"
            placeholder="Lien repo (optionnel)"
            value={form.repoUrl ?? ""}
            onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            className="input"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as Project["status"],
              })
            }
          >
            <option value="live">Actif</option>
            <option value="paused">En pause</option>
            <option value="archived">Archivé</option>
          </select>
          <select
            className="input"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as Project["category"],
              })
            }
          >
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="extension">Extension</option>
            <option value="outil">Outil</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Mettre en avant
        </label>

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
                setForm(emptyProject);
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
        {projects.map((project) => (
          <div
            key={project._id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3"
          >
            <div>
              <p className="text-sm font-medium text-text">{project.title}</p>
              <p className="text-xs text-muted">{project.pitch}</p>
            </div>
            <div className="flex gap-3 text-xs">
              <button
                onClick={() => startEdit(project)}
                className="text-muted hover:text-accent"
              >
                Modifier
              </button>
              <button
                onClick={() => project._id && handleDelete(project._id)}
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
