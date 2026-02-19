import axiosClient, { getMultipartHeaders } from "./axiosClient";
import {
  BooksResponse,
  BookDetailResponse,
  BooksQueryParams,
  RecommendedBooksParams,
  CreateBookRequest,
  UpdateBookRequest,
  ApiResponse,
} from "../types";

// GET /api/books — list with filters & pagination
export async function getBooks(
  params: BooksQueryParams = {}
): Promise<BooksResponse> {
  const response = await axiosClient.get<BooksResponse>("/books", { params });
  return response.data;
}

// GET /api/books/recommend — recommended books
export async function getRecommendedBooks(
  params: RecommendedBooksParams = {}
): Promise<BooksResponse> {
  const response = await axiosClient.get<BooksResponse>("/books/recommend", {
    params,
  });
  return response.data;
}

// GET /api/books/:id — book detail
export async function getBookById(id: number): Promise<BookDetailResponse> {
  const response = await axiosClient.get<BookDetailResponse>(`/books/${id}`);
  return response.data;
}

// POST /api/books — create book (admin, multipart/form-data)
export async function createBook(
  data: CreateBookRequest
): Promise<ApiResponse<{ book: import("../types").Book }>> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("isbn", data.isbn);
  formData.append("categoryId", String(data.categoryId));
  if (data.authorId) formData.append("authorId", String(data.authorId));
  if (data.authorName) formData.append("authorName", data.authorName);
  if (data.coverImage) formData.append("coverImage", data.coverImage);
  if (data.description) formData.append("description", data.description);
  if (data.publishedYear)
    formData.append("publishedYear", String(data.publishedYear));
  if (data.totalCopies)
    formData.append("totalCopies", String(data.totalCopies));
  if (data.availableCopies)
    formData.append("availableCopies", String(data.availableCopies));

  const response = await axiosClient.post("/books", formData, {
    headers: getMultipartHeaders(),
  });
  return response.data;
}

// PUT /api/books/:id — update book (admin)
export async function updateBook(
  id: number,
  data: UpdateBookRequest
): Promise<ApiResponse<{ book: import("../types").Book }>> {
  const response = await axiosClient.put(`/books/${id}`, data);
  return response.data;
}

// DELETE /api/books/:id — delete book (admin)
export async function deleteBook(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete(`/books/${id}`);
  return response.data;
}

// GET /api/admin/books — admin book list with extra filters
export async function getAdminBooks(
  params: BooksQueryParams = {}
): Promise<BooksResponse> {
  const response = await axiosClient.get<BooksResponse>("/admin/books", {
    params,
  });
  return response.data;
}