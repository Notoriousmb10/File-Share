import loginLogModel from "../models/login-log.model";
import UserModel, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "3d",
  });
};

export const register = async (data: IUser) => {
  try {
    console.log(data, "sadas");
    const user = await UserModel.findOne({ email: data.email });
    if (user) {
      await loginLogModel.create({
        email: data.email,
        action: "REGISTER",
        status: "FAILURE",
      });
      throw new Error("User already exists");
    }
    const newUser = await UserModel.create(data);
    const token = generateToken(newUser._id.toString());

    await loginLogModel.create({
      email: data.email,
      action: "REGISTER",
      status: "SUCCESS",
    });

    return {
      message: "User registered successfully",
      data: newUser,
      token,
      status: 200,
    };
  } catch (error) {
    if (error instanceof Error && error.message !== "User already exists") {
      if (data.email) {
        await loginLogModel.create({
          email: data.email,
          action: "REGISTER",
          status: "FAILURE",
        });
      }
    }
    throw error;
  }
};

export const login = async (data: Partial<IUser>) => {
  try {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      await loginLogModel.create({
        email: data.email,
        action: "LOGIN",
        status: "FAILURE",
      });
      throw new Error("Invalid email or password");
    }

    const isMatch = await user.comparePassword(data.password!);
    if (!isMatch) {
      await loginLogModel.create({
        email: data.email,
        action: "LOGIN",
        status: "FAILURE",
      });
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    await loginLogModel.create({
      email: data.email,
      action: "LOGIN",
      status: "SUCCESS",
    });

    return {
      message: "Login successful",
      data: user,
      token,
      status: 200,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message !== "Invalid email or password"
    ) {
      if (data.email) {
        await loginLogModel.create({
          email: data.email,
          action: "LOGIN",
          status: "FAILURE",
        });
      }
    }
    throw error;
  }
};
export const getAllUsers = async (currentUserId: string) => {
  try {
    const users = await UserModel.find(
      { _id: { $ne: currentUserId } },
      "name email _id"
    );
    return users;
  } catch (error) {
    throw error;
  }
};
