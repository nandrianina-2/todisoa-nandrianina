import { Schema, models, model } from "mongoose";

export interface ILoginAttempt {
  key: string; // email en minuscules
  count: number;
  firstAttemptAt: Date;
  blockedUntil?: Date;
}

const LoginAttemptSchema = new Schema<ILoginAttempt>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  firstAttemptAt: { type: Date, default: Date.now },
  blockedUntil: { type: Date },
});

export default models.LoginAttempt ||
  model<ILoginAttempt>("LoginAttempt", LoginAttemptSchema);
