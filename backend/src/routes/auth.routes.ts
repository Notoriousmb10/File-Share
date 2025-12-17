import express from "express";
import * as authController from "../controllers/auth.controllers";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/users", authenticate as any, authController.getUsers);

export default router;
