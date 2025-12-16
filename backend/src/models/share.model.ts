import mongoose, { Schema, Document } from "mongoose";

export interface IShareLink extends Document {
  shareId: string;
  fileId: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
  expiresAt: Date;
  isActive: boolean;
}

const ShareLinkSchema: Schema = new Schema({
  shareId: { type: String, required: true, unique: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File", required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

export const ShareLinkModel = mongoose.model<IShareLink>(
  "ShareLink",
  ShareLinkSchema
);
