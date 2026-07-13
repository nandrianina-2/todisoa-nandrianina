import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { auth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const profile = await Profile.findOne().lean();
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const updated = await Profile.findOneAndUpdate(
    {},
    { ...body, updatedAt: new Date() },
    { new: true, upsert: true }
  );

  return NextResponse.json(updated);
}
