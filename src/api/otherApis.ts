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
  Cart,
} from "../types";

// ============================================================
// REVIEWS API
// ============================================================

// POST /api/reviews — create review for a book
export async function createReview(
  data: CreateReviewRequest
): Promise<ApiResponse<{ review: Review }>> {
  const response = await axiosClient.post<ApiResponse<{ review: Review }>>(
    "/reviews",
    data
  );
  return response.data;
}

// GET /api/reviews/book/:bookId — get reviews for a book
export async function getBookReviews(params?: {
  bookId?: number;
  page?: number;
  limit?: number;
  sort?: string;
  comment?: string;
  book?: string;
  minRating?: number;
}): Promise<ReviewsResponse> {
  const response = await axiosClient.get<ReviewsResponse>("/reviews", {
    params,
  });
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

// GET /api/categories — list all categories
export async function getCategories(): Promise<
  ApiResponse<{ categories: Category[] }>
> {
  const response = await axiosClient.get<
    ApiResponse<{ categories: Category[] }>
  >("/categories");
  return response.data;
}

// POST /api/categories — create category (admin)
export async function createCategory(data: {
  name: string;
}): Promise<ApiResponse<{ category: Category }>> {
  const response = await axiosClient.post<ApiResponse<{ category: Category }>>(
    "/categories",
    data
  );
  return response.data;
}

// PUT /api/categories/:id — update category (admin)
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

// DELETE /api/categories/:id — delete category (admin)
export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(
    `/categories/${id}`
  );
  return response.data;
}

// ============================================================
// AUTHORS API
// ============================================================

// GET /api/authors — list authors (optional search by name)
export async function getAuthors(params?: {
  q?: string;
}): Promise<ApiResponse<{ authors: Author[] }>> {
  const response = await axiosClient.get<ApiResponse<{ authors: Author[] }>>(
    "/authors",
    { params }
  );
  return response.data;
}

// GET /api/authors/popular — popular authors
export async function getPopularAuthors(): Promise<
  ApiResponse<{ authors: Author[] }>
> {
  const response = await axiosClient.get<ApiResponse<{ authors: Author[] }>>(
    "/authors/popular"
  );
  return response.data;
}

// POST /api/authors — create author (admin)
export async function createAuthor(
  data: CreateAuthorRequest
): Promise<ApiResponse<{ author: Author }>> {
  const response = await axiosClient.post<ApiResponse<{ author: Author }>>(
    "/authors",
    data
  );
  return response.data;
}

// PUT /api/authors/:id — update author (admin)
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

// DELETE /api/authors/:id — delete author (admin)
export async function deleteAuthor(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(
    `/authors/${id}`
  );
  return response.data;
}

// ============================================================
// USER PROFILE API
// ============================================================

// GET /api/me — get own profile + loan stats
export async function getMyProfile(): Promise<ApiResponse<UserProfile>> {
  const response = await axiosClient.get<ApiResponse<UserProfile>>("/me");
  return response.data;
}

// PATCH /api/me — update own profile
export async function updateMyProfile(
  data: UpdateProfileRequest
): Promise<ApiResponse<UserProfile>> {
  const response = await axiosClient.patch<ApiResponse<UserProfile>>(
    "/me",
    data
  );
  return response.data;
}

// GET /api/admin/users — list all users (admin)
export async function getAdminUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<{ users: UserProfile[]; pagination?: object }>> {
  const response = await axiosClient.get("/admin/users", { params });
  return response.data;
}

// ============================================================
// CART API
// ============================================================

// GET /api/cart — get my cart
export async function getCart(): Promise<ApiResponse<Cart>> {
  const response = await axiosClient.get<ApiResponse<Cart>>("/cart");
  return response.data;
}

// DELETE /api/cart — clear cart
export async function clearCart(): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>("/cart");
  return response.data;
}

// GET /api/cart/checkout — checkout cart (borrow all books in cart)
export async function checkoutCart(): Promise<ApiResponse<{ loans: import("../types").Loan[] }>> {
  const response = await axiosClient.get("/cart/checkout");
  return response.data;
}

// POST /api/cart/items — add book to cart
export async function addToCart(
  bookId: number
): Promise<ApiResponse<Cart>> {
  const response = await axiosClient.post<ApiResponse<Cart>>("/cart/items", {
    bookId,
  });
  return response.data;
}

// DELETE /api/cart/items/:itemId — remove item from cart
export async function removeFromCart(
  itemId: number
): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(
    `/cart/items/${itemId}`
  );
  return response.data;
}

export async function getAuthorDetail(authorId: number) {
  const response = await axiosClient.get(`/authors/${authorId}`);
  return response.data;
}