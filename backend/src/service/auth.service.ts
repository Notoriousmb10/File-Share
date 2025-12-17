import UserModel, { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "3d",
  });
};

export const register = async (data: IUser) => {
  try {
    const user = await UserModel.findOne({ email: data.email });
    if (user) {
      throw new Error("User already exists");
    }

    const newUser = await UserModel.create(data);
    const token = generateToken(newUser._id.toString());

    return {
      message: "User registered successfully",
      data: newUser,
      token,
      status: 200,
    };
  } catch (error) {
    throw error;
  }
};

export const login = async (data: Partial<IUser>) => {
  try {
    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await user.comparePassword(data.password!);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    return {
      message: "Login successful",
      data: user,
      token,
      status: 200,
    };
  } catch (error) {
    throw error;
  }
};
