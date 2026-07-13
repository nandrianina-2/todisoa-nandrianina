import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { auth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const created = await Project.create(body);
  return NextResponse.json(created, { status: 201 });
}
