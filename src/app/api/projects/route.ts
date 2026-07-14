import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";
import { projectSchema, formatZodError } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json(projects);
  } catch (err) {
    console.error("GET /api/projects", err);
    return NextResponse.json(
      { error: "Impossible de charger les projets." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await Project.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === 11000) {
      return NextResponse.json(
        { error: "Un projet avec ce slug existe déjà." },
        { status: 409 }
      );
    }
    console.error("POST /api/projects", err);
    return NextResponse.json(
      { error: "Impossible de créer le projet." },
      { status: 500 }
    );
  }
}
