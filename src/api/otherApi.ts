import axiosClient from "./axiosClient";
import {
  ReviewsResponse,
  Review,
  CreateReviewRequest,
  ApiResponse,
  Category,
  Author,
  CreateAuthorRequest,
  UserProfile,
  UpdateProfileRequest,
} from "../types";

// ============================================================
// REVIEWS API
// ============================================================

/**
 * POST /api/reviews — Create or Update review
 * API expects: { bookId: number, star: number, comment: string }
 */
export async function createReview(
  data: CreateReviewRequest
): Promise<ApiResponse<{ review: Review }>> {
 const payload = {
  bookId: Number(data.bookId),
  star: Number(data.star ?? (data as any).rating), 
  comment: data.comment || ""
};

  const response = await axiosClient.post<ApiResponse<{ review: Review }>>(
    "/reviews",
    payload
  );
  return response.data;
}

/**
 * GET /api/reviews/book/:bookId
 */
export async function getBookReviews(params?: {
  bookId?: number;
  page?: number;
  limit?: number;
}): Promise<ReviewsResponse> {
  const { bookId, ...rest } = params ?? {};

  if (!bookId) throw new Error("bookId is required");

  const response = await axiosClient.get<ReviewsResponse>(
    `/reviews/book/${bookId}`,
    { params: rest }
  );
  return response.data;
}

export async function deleteReview(reviewId: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(`/reviews/${reviewId}`);
  return response.data;
}

export async function getMyReviews(params?: {
  page?: number;
  limit?: number;
}): Promise<ReviewsResponse> {
  const response = await axiosClient.get<ReviewsResponse>("/me/reviews", { params });
  return response.data;
}

// ============================================================
// CATEGORIES
// ============================================================

export async function getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
  const response = await axiosClient.get("/categories");
  return response.data;
}

export async function createCategory(data: { name: string }): Promise<ApiResponse<{ category: Category }>> {
  const response = await axiosClient.post("/categories", data);
  return response.data;
}

export async function updateCategory(id: number, data: { name: string }): Promise<ApiResponse<{ category: Category }>> {
  const response = await axiosClient.put(`/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete(`/categories/${id}`);
  return response.data;
}

// ============================================================
// AUTHORS
// ============================================================

export async function getAuthors(params?: { q?: string }): Promise<ApiResponse<{ authors: Author[] }>> {
  const response = await axiosClient.get("/authors", { params });
  return response.data;
}

export async function getPopularAuthors(): Promise<ApiResponse<{ authors: Author[] }>> {
  const response = await axiosClient.get("/authors/popular");
  return response.data;
}

export async function getAuthorDetail(authorId: number) {
  const response = await axiosClient.get(`/authors/${authorId}`);
  return response.data;
}

export async function createAuthor(data: CreateAuthorRequest): Promise<ApiResponse<{ author: Author }>> {
  const response = await axiosClient.post("/authors", data);
  return response.data;
}

export async function updateAuthor(id: number, data: CreateAuthorRequest): Promise<ApiResponse<{ author: Author }>> {
  const response = await axiosClient.put(`/authors/${id}`, data);
  return response.data;
}

export async function deleteAuthor(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete(`/authors/${id}`);
  return response.data;
}

// ============================================================
// PROFILE
// ============================================================

export async function getMyProfile(): Promise<ApiResponse<UserProfile>> {
  const response = await axiosClient.get("/me");
  return response.data;
}

export async function updateMyProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
  const response = await axiosClient.patch("/me", data);
  return response.data;
}

export async function getAdminUsers(params?: { search?: string; page?: number; limit?: number }) {
  const response = await axiosClient.get("/admin/users", { params });
  return response.data;
}

// Alias untuk hooks
export async function getProfile() { return getMyProfile(); }
export async function updateProfile(data: UpdateProfileRequest) { return updateMyProfile(data); }