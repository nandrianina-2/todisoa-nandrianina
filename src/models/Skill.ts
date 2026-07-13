import { Schema, models, model } from "mongoose";

export interface ISkill {
  _id?: string;
  name: string;
  category: "frontend" | "backend" | "mobile" | "database" | "devops";
  strength: number; // 1 à 5, affiché comme des barres de signal
  order: number;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["frontend", "backend", "mobile", "database", "devops"],
    required: true,
  },
  strength: { type: Number, min: 1, max: 5, default: 3 },
  order: { type: Number, default: 0 },
});

export default models.Skill || model<ISkill>("Skill", SkillSchema);
