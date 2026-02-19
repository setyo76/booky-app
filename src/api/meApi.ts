import axiosClient from "./axiosClient";

// ── Profile ───────────────────────────────────────────────────
export async function getProfile() {
  const response = await axiosClient.get("/me");
  return response.data;
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  bio?: string;
}) {
  const response = await axiosClient.patch("/me", data);
  return response.data;
}

// ── My Loans ──────────────────────────────────────────────────
export async function getMyLoans(params?: { page?: number; limit?: number }) {
  const response = await axiosClient.get("/me/loans", { params });
  return response.data;
}

// ── My Reviews ────────────────────────────────────────────────
export async function getMyReviews(params?: { page?: number; limit?: number }) {
  const response = await axiosClient.get("/me/reviews", { params });
  return response.data;
}