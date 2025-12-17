import { Request, Response } from "express";
import * as fileService from "../service/file.service";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const upload = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      if (!req.file) {
        return res.status(400).json({ message: "No files uploaded" });
      }
    }

    const filesToCheck =
      (req.files as Express.Multer.File[]) || (req.file ? [req.file] : []); // made sure this exist, or else aws team will come at home
    for (const file of filesToCheck) {
      if (file.size > 1024 * 1024 * 10) {
        return res.status(400).json({ message: "File size too large" });
      }
    }

    const userId = req.user!.id;
    const files = (req.files as Express.Multer.File[]) || [req.file];
    const uploadPromises = files.map((file) =>
      fileService.uploadFile(userId, file)
    );
    await Promise.all(uploadPromises);

    return res.status(201).json({ message: "Upload successful" });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Upload failed",
    });
  }
};

export const getFiles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const files = await fileService.getUserFiles(userId);
    return res.status(200).json(files);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch files" });
  }
};

export const shareWithUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { fileId } = req.params;
    const { users, expiresAt } = req.body;
    const userId = req.user!.id;

    if (!users || !Array.isArray(users)) {
      return res.status(400).json({ message: "Invalid users list" });
    }

    await fileService.shareFileWithUsers(fileId, userId, users, expiresAt);
    return res.status(200).json({ message: "File shared successfully" });
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Share failed",
    });
  }
};

export const createShareLink = async (req: AuthRequest, res: Response) => {
  try {
    const { fileId } = req.params;
    const { expiresInHours } = req.body;
    const userId = req.user!.id;

    const shareId = await fileService.generateShareLink(
      fileId,
      userId,
      expiresInHours
    );

    const shareUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/view-file/${shareId}`;

    return res.status(200).json({ shareUrl });
  } catch (error) {
    return res.status(400).json({
      message:
        error instanceof Error ? error.message : "Link generation failed",
    });
  }
};

export const viewFile = async (req: AuthRequest, res: Response) => {
  try {
    const { shareId } = req.params;

    const url = await fileService.getViewLink(shareId, undefined, true);
    return res.status(200).json({ signedUrl: url });
  } catch (error) {
    return res.status(403).json({
      message:
        "Forbidden: " +
        (error instanceof Error ? error.message : "Access denied"),
    });
  }
};

export const viewFileAuthenticated = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { fileId } = req.params;
    const userId = req.user!.id;

    const url = await fileService.getViewLink(fileId, userId, false);
    return res.status(200).json({ signedUrl: url });
  } catch (error) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
