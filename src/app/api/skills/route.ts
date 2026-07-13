import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { auth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const skills = await Skill.find().sort({ category: 1, order: 1 }).lean();
  return NextResponse.json(skills);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const created = await Skill.create(body);
  return NextResponse.json(created, { status: 201 });
}
