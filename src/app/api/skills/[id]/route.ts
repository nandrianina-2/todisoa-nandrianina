import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { auth } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const updated = await Skill.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();
  await Skill.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
