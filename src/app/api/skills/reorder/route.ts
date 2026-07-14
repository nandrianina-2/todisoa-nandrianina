import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { auth } from "@/lib/auth";
import { z } from "zod";

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      order: z.number().int(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    await connectDB();
    await Promise.all(
      parsed.data.items.map(({ id, order }) =>
        Skill.findByIdAndUpdate(id, { order }, { runValidators: true })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/skills/reorder", err);
    return NextResponse.json(
      { error: "Impossible de réordonner les compétences." },
      { status: 500 }
    );
  }
}
