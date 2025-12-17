import { IUser } from "../models/user.model";
import * as authService from "../service/auth.service";
import { Request, Response, NextFunction } from "express";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.register(req.body as unknown as IUser).then((details) => {
      return res.status(200).json({
        message: "User registered successfully",
        status: details.status,
        data: details,
        token: details.token,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authService.login(req.body).then((details) => {
      return res.status(200).json({
        message: "User logged in successfully",
        data: details,
      });
    });
  } catch (error) {
    next(error);
  }
};
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.id;
    const users = await authService.getAllUsers(userId);
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
