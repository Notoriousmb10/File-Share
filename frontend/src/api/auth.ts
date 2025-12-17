import { apiClient } from "./client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types";

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    credentials
  );
  return response.data;
};
