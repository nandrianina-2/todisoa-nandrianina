import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

const RULES = {
  avatar: {
    accept: (type: string) => type.startsWith("image/"),
    label: "une image",
    maxSize: 5 * 1024 * 1024,
    prefix: "avatar",
  },
  resume: {
    accept: (type: string) => type === "application/pdf",
    label: "un PDF",
    maxSize: 10 * 1024 * 1024,
    prefix: "cv",
  },
} as const;

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob n'est pas configuré. Ajoute le stockage Blob à ton projet Vercel, ou colle simplement un lien existant.",
      },
      { status: 501 }
    );
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const kind = (form.get("kind") as string) || "avatar";
  const rule = RULES[kind as keyof typeof RULES] ?? RULES.avatar;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }

  if (!rule.accept(file.type)) {
    return NextResponse.json(
      { error: `Le fichier doit être ${rule.label}` },
      { status: 400 }
    );
  }

  if (file.size > rule.maxSize) {
    return NextResponse.json(
      { error: `Fichier trop lourd (${rule.maxSize / (1024 * 1024)} Mo max)` },
      { status: 400 }
    );
  }

  const blob = await put(`${rule.prefix}-${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
