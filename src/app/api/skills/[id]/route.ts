import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { auth } from "@/lib/auth";
import { skillSchema, formatZodError } from "@/lib/validation";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await Skill.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Compétence introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/skills/[id]", err);
    return NextResponse.json(
      { error: "Impossible de modifier la compétence." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/skills/[id]", err);
    return NextResponse.json(
      { error: "Impossible de supprimer la compétence." },
      { status: 500 }
    );
  }
}
