import mongoose, { Schema, Document } from "mongoose";

export interface ILoginLog extends Document {
  email: string;
  action: "LOGIN" | "REGISTER";
  status: "SUCCESS" | "FAILURE";
  timestamp: Date;
}

const LoginLogSchema: Schema = new Schema({
  email: { type: String, required: true },
  action: { type: String, enum: ["LOGIN", "REGISTER"], required: true },
  status: { type: String, enum: ["SUCCESS", "FAILURE"], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ILoginLog>("LoginLog", LoginLogSchema);
