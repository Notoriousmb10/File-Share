import { FileModel, IFile } from "../models/file.model";
import { ShareLinkModel, IShareLink } from "../models/share.model";
import * as s3Service from "./s3.service";
import { v4 as uuidv4 } from "uuid";

export const uploadFile = async (
  ownerId: string,
  file: Express.Multer.File
): Promise<IFile> => {
  const s3Key = `${uuidv4()}-${file.originalname}`;

  await s3Service.uploadToS3(file.buffer, s3Key, file.mimetype);

  const newFile = new FileModel({
    ownerId,
    fileName: file.originalname,
    fileType: file.mimetype,
    fileSize: file.size,
    s3Key,
    sharedWith: [],
  });

  await newFile.save();

  return newFile;
};

export const getUserFiles = async (userId: string): Promise<any[]> => {
  const files = await FileModel.find({
    $or: [{ ownerId: userId }, { sharedWith: userId }],
  } as any)
    .sort({ uploadedAt: -1 })
    .populate("ownerId", "username email");

  return files.map((file) => ({
    _id: file._id,
    fileName: file.fileName,
    fileType: file.fileType,
    fileSize: file.fileSize,
    uploadedAt: file.uploadedAt,
    isOwner: (file.ownerId as any)._id.toString() === userId.toString(),
    ownerName: (file.ownerId as any).username,
  }));
};

export const shareFileWithUsers = async (
  fileId: string,
  ownerId: string,
  targetUserIds: string[]
): Promise<void> => {
  const file = await FileModel.findOne({ _id: fileId, ownerId } as any);

  if (!file) {
    throw new Error("File not found or you are not the owner");
  }
  await FileModel.updateOne(
    { _id: fileId },
    { $addToSet: { sharedWith: { $each: targetUserIds } } }
  );
};

export const generateShareLink = async (
  fileId: string,
  ownerId: string
): Promise<string> => {
  const file = await FileModel.findOne({ _id: fileId, ownerId } as any);
  if (!file) {
    throw new Error("File not found or you are not the owner");
  }

  const shareId = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await ShareLinkModel.create({
    shareId,
    fileId,
    createdBy: ownerId,
    expiresAt,
    isActive: true,
  } as any);

  return shareId;
};

export const getViewLink = async (
  identifier: string,
  userId?: string,
  isShareId: boolean = false
): Promise<string> => {
  let file: IFile | null = null;

  if (isShareId) {
    const shareLink = await ShareLinkModel.findOne({
      shareId: identifier,
      isActive: true,
      expiresAt: { $gt: new Date() },
    } as any).populate("fileId");

    if (!shareLink || !shareLink.fileId) {
      throw new Error("Invalid or expired share link");
    }
    file = shareLink.fileId as unknown as IFile;
  } else {
    if (!userId) throw new Error("Unauthorized");

    file = await FileModel.findOne({
      _id: identifier,
      $or: [{ ownerId: userId }, { sharedWith: userId }],
    } as any);

    if (!file) {
      throw new Error("File not found or access denied");
    }
  }

  // Generate S3 Signed URL
  return await s3Service.getSignedUrl(file.s3Key);
};
