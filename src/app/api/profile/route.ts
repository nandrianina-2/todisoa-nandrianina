import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { auth } from "@/lib/auth";
import { profileSchema, formatZodError } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    const profile = await Profile.findOne().lean();
    return NextResponse.json(profile);
  } catch (err) {
    console.error("GET /api/profile", err);
    return NextResponse.json(
      { error: "Impossible de charger le profil." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await Profile.findOneAndUpdate(
      {},
      { ...parsed.data, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true, context: "query" }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/profile", err);
    return NextResponse.json(
      { error: "Impossible d'enregistrer le profil." },
      { status: 500 }
    );
  }
}
