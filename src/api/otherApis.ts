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

// POST /api/reviews — create or update review for a book
export async function createReview(
  data: CreateReviewRequest
): Promise<ApiResponse<{ review: Review }>> {
  const response = await axiosClient.post<ApiResponse<{ review: Review }>>(
    "/reviews",
    data
  );
  return response.data;
}

// ✅ GET /api/reviews/book/:bookId — get reviews for a book (path param, bukan query param)
export async function getBookReviews(params?: {
  bookId?: number;
  page?: number;
  limit?: number;
}): Promise<ReviewsResponse> {
  const { bookId, ...rest } = params ?? {};
  const response = await axiosClient.get<ReviewsResponse>(
    `/reviews/book/${bookId}`,
    { params: rest }
  );
  return response.data;
}

// DELETE /api/reviews/:id — delete own review
export async function deleteReview(
  reviewId: number
): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(
    `/reviews/${reviewId}`
  );
  return response.data;
}

// GET /api/me/reviews — my reviews
export async function getMyReviews(params?: {
  page?: number;
  limit?: number;
}): Promise<ReviewsResponse> {
  const response = await axiosClient.get<ReviewsResponse>("/me/reviews", {
    params,
  });
  return response.data;
}

// ============================================================
// CATEGORIES API
// ============================================================

export async function getCategories(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  const response = await axiosClient.get<
    ApiResponse<{ categories: Category[] }>
  >("/categories");
  return response.data;
}

export async function createCategory(data: {
  name: string;
}): Promise<ApiResponse<{ category: Category }>> {
  const response = await axiosClient.post<ApiResponse<{ category: Category }>>(
    "/categories",
    data
  );
  return response.data;
}

export async function updateCategory(
  id: number,
  data: { name: string }
): Promise<ApiResponse<{ category: Category }>> {
  const response = await axiosClient.put<ApiResponse<{ category: Category }>>(
    `/categories/${id}`,
    data
  );
  return response.data;
}

export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(
    `/categories/${id}`
  );
  return response.data;
}

// ============================================================
// AUTHORS API
// ============================================================

export async function getAuthors(params?: {
  q?: string;
}): Promise<ApiResponse<{ authors: Author[] }>> {
  const response = await axiosClient.get<ApiResponse<{ authors: Author[] }>>(
    "/authors",
    { params }
  );
  return response.data;
}

export async function getPopularAuthors(): Promise<
  ApiResponse<{ authors: Author[] }>
> {
  const response = await axiosClient.get<ApiResponse<{ authors: Author[] }>>(
    "/authors/popular"
  );
  return response.data;
}

export async function getAuthorDetail(authorId: number) {
  const response = await axiosClient.get(`/authors/${authorId}`);
  return response.data;
}

export async function createAuthor(
  data: CreateAuthorRequest
): Promise<ApiResponse<{ author: Author }>> {
  const response = await axiosClient.post<ApiResponse<{ author: Author }>>(
    "/authors",
    data
  );
  return response.data;
}

export async function updateAuthor(
  id: number,
  data: CreateAuthorRequest
): Promise<ApiResponse<{ author: Author }>> {
  const response = await axiosClient.put<ApiResponse<{ author: Author }>>(
    `/authors/${id}`,
    data
  );
  return response.data;
}

export async function deleteAuthor(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(
    `/authors/${id}`
  );
  return response.data;
}

// ============================================================
// USER PROFILE API
// ============================================================

export async function getMyProfile(): Promise<ApiResponse<UserProfile>> {
  const response = await axiosClient.get<ApiResponse<UserProfile>>("/me");
  return response.data;
}

export async function updateMyProfile(
  data: UpdateProfileRequest
): Promise<ApiResponse<UserProfile>> {
  const response = await axiosClient.patch<ApiResponse<UserProfile>>(
    "/me",
    data
  );
  return response.data;
}

export async function getAdminUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ users: UserProfile[]; pagination?: object }>> {
  const response = await axiosClient.get("/admin/users", { params });
  return response.data;
}

// ============================================================
// PROFILE (legacy — tetap ada agar tidak break)
// ============================================================

export async function getProfile() {
  const response = await axiosClient.get("/me");
  return response.data;
}

export async function updateProfile(data: UpdateProfileRequest) {
  const response = await axiosClient.patch("/me", data);
  return response.data;
}