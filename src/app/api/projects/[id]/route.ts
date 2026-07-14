import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";
import { projectSchema, formatZodError } from "@/lib/validation";

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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await Project.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!updated) {
      return NextResponse.json({ error: "Projet introuvable." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return NextResponse.json(
        { error: "Un projet avec ce slug existe déjà." },
        { status: 409 }
      );
    }
    console.error("PUT /api/projects/[id]", err);
    return NextResponse.json(
      { error: "Impossible de modifier le projet." },
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
    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/projects/[id]", err);
    return NextResponse.json(
      { error: "Impossible de supprimer le projet." },
      { status: 500 }
    );
  }
}
