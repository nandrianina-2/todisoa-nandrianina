"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/types";

const empty: Profile = {
  name: "",
  title: "",
  tagline: "",
  bio: "",
  location: "",
  email: "",
  socials: {},
  availableForWork: true,
};

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<Profile>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data) setProfile({ ...empty, ...data, socials: data.socials ?? {} });
        setLoading(false);
      });
  }, []);

  async function uploadFile(
    file: File,
    kind: "avatar" | "resume"
  ): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", kind);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "Échec de l'upload.");
    }

    return data.url as string;
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const url = await uploadFile(file, "avatar");
      setProfile((p) => ({ ...p, avatarUrl: url ?? p.avatarUrl }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setResumeError("");

    try {
      const url = await uploadFile(file, "resume");
      setProfile((p) => ({ ...p, resumeUrl: url ?? p.resumeUrl }));
    } catch (err) {
      setResumeError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setUploadingResume(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    setSaving(false);
    setMessage(res.ok ? "Profil enregistré." : "Erreur lors de l'enregistrement.");
  }

  if (loading) return <p className="text-sm text-muted">Chargement...</p>;

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <div>
        <p className="signal-tag text-xs uppercase tracking-[0.2em] text-muted">
          admin
        </p>
        <h1 className="mt-2 font-display text-3xl text-text">Profil</h1>
      </div>

      <Field label="Nom">
        <input
          className="input"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          required
        />
      </Field>

      <Field label="Titre (ex: Développeur Full-Stack)">
        <input
          className="input"
          value={profile.title}
          onChange={(e) => setProfile({ ...profile, title: e.target.value })}
          required
        />
      </Field>

      <Field label="Tagline (courte phrase d'accroche)">
        <input
          className="input"
          value={profile.tagline}
          onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
          required
        />
      </Field>

      <Field label="Photo de profil">
        <div className="flex items-start gap-4">
          {profile.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt="Aperçu"
              className="h-16 w-16 rounded-xl border border-border object-cover"
            />
          )}
          <div className="flex-1 space-y-2">
            <input
              className="input"
              placeholder="https://... (lien direct vers une image)"
              value={profile.avatarUrl ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, avatarUrl: e.target.value })
              }
            />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-xs text-muted hover:border-accent hover:text-accent">
                {uploading ? "Envoi..." : "Uploader une image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <span className="text-xs text-red-500">{uploadError}</span>
              )}
            </div>
          </div>
        </div>
      </Field>

      <Field label="CV (PDF)">
        <div className="space-y-2">
          <input
            className="input"
            placeholder="https://... (lien direct vers un PDF)"
            value={profile.resumeUrl ?? ""}
            onChange={(e) =>
              setProfile({ ...profile, resumeUrl: e.target.value })
            }
          />
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-xs text-muted hover:border-accent hover:text-accent">
              {uploadingResume ? "Envoi..." : "Uploader un PDF"}
              <input
                type="file"
                accept="application/pdf"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent hover:underline"
              >
                Voir le fichier actuel
              </a>
            )}
            {resumeError && (
              <span className="text-xs text-red-500">{resumeError}</span>
            )}
          </div>
        </div>
      </Field>

      <Field label="Bio (paragraphes séparés par une ligne vide)">
        <textarea
          className="input min-h-[160px]"
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Localisation">
          <input
            className="input"
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className="input"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="GitHub">
          <input
            className="input"
            value={profile.socials.github ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                socials: { ...profile.socials, github: e.target.value },
              })
            }
          />
        </Field>
        <Field label="LinkedIn">
          <input
            className="input"
            value={profile.socials.linkedin ?? ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                socials: { ...profile.socials, linkedin: e.target.value },
              })
            }
          />
        </Field>
      </div>

      <Field label="Site web">
        <input
          className="input"
          value={profile.socials.website ?? ""}
          onChange={(e) =>
            setProfile({
              ...profile,
              socials: { ...profile.socials, website: e.target.value },
            })
          }
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={profile.availableForWork}
          onChange={(e) =>
            setProfile({ ...profile, availableForWork: e.target.checked })
          }
        />
        Disponible pour de nouveaux projets
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accentStrong disabled:opacity-60"
      >
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>

      {message && <p className="text-sm text-muted">{message}</p>}

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
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted">{label}</label>
      {children}
    </div>
  );
}
