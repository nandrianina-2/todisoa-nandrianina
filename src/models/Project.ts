import { Schema, models, model } from "mongoose";

export type ProjectStatus = "live" | "paused" | "archived";

export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  pitch: string;
  description: string;
  stack: string[];
  role: string;
  status: ProjectStatus;
  category: "web" | "mobile" | "extension" | "outil";
  imageUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  pitch: { type: String, required: true },
  description: { type: String, required: true },
  stack: { type: [String], default: [] },
  role: { type: String, default: "" },
  status: {
    type: String,
    enum: ["live", "paused", "archived"],
    default: "live",
  },
  category: {
    type: String,
    enum: ["web", "mobile", "extension", "outil"],
    default: "web",
  },
  imageUrl: String,
  demoUrl: String,
  repoUrl: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default models.Project || model<IProject>("Project", ProjectSchema);
