import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { auth } from "@/lib/auth";
import { skillSchema, formatZodError } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find().sort({ category: 1, order: 1 }).lean();
    return NextResponse.json(skills);
  } catch (err) {
    console.error("GET /api/skills", err);
    return NextResponse.json(
      { error: "Impossible de charger les compétences." },
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
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();
    const created = await Skill.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/skills", err);
    return NextResponse.json(
      { error: "Impossible de créer la compétence." },
      { status: 500 }
    );
  }
}
