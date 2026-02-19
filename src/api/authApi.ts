import axiosClient from "./axiosClient";
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from "../types";

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await axiosClient.post("/auth/login", data);
  // API mengembalikan { success, message, data: { token, user } }
  // Jadi kita perlu ambil response.data.data
  return response.data.data;
}

export async function registerUser(data: RegisterRequest): Promise<ApiResponse<null>> {
  const response = await axiosClient.post("/auth/register", data);
  return response.data;
}