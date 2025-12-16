import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middlewares/auth.middleware";
import * as fileController from "../controllers/file.controllers";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(authenticate as any);

router.post("/upload", upload.array("files"), fileController.upload);
