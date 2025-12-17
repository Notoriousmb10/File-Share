import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  ownerId: mongoose.Schema.Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  s3Key: string;
  sharedWith: {
    userId: mongoose.Schema.Types.ObjectId;
    expiresAt: Date | null;
  }[];
}

const FileSchema: Schema = new Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
  s3Key: { type: String, required: true, unique: true },
  sharedWith: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      expiresAt: { type: Date, default: null },
    },
  ],
});

export const FileModel = mongoose.model<IFile>("File", FileSchema);
