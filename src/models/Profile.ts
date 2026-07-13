import mongoose, { Schema, models, model } from "mongoose";

export interface IProfile {
  _id?: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  avatarUrl?: string;
  resumeUrl?: string;
  availableForWork: boolean;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  bio: { type: String, required: true },
  location: { type: String, default: "" },
  email: { type: String, required: true },
  socials: {
    github: String,
    linkedin: String,
    twitter: String,
    website: String,
  },
  avatarUrl: String,
  resumeUrl: String,
  availableForWork: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

export default models.Profile ||
  model<IProfile>("Profile", ProfileSchema);
