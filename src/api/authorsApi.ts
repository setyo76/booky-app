// api/authorsApi.ts
import axiosClient from "./axiosClient";
import { Author, ApiResponse, BooksResponse } from "../types";

// GET /api/authors - List authors with optional search
export async function getAuthors(params?: { 
  q?: string; 
  page?: number; 
  limit?: number 
}): Promise<ApiResponse<Author[]>> {
  const response = await axiosClient.get('/authors', { params });
  return response.data;
}

// GET /api/authors/popular - Popular authors
export async function getPopularAuthors(params?: { 
  limit?: number 
}): Promise<ApiResponse<Author[]>> {
  const response = await axiosClient.get('/authors/popular', { params });
  return response.data;
}

// GET /api/authors/{id}/books - Books by author
export async function getAuthorBooks(
  id: number, 
  params?: { page?: number; limit?: number }
): Promise<BooksResponse> {
  const response = await axiosClient.get(`/authors/${id}/books`, { params });
  return response.data;
}

// POST /api/authors - Create author (admin)
export async function createAuthor(data: { 
  name: string; 
  bio?: string 
}): Promise<ApiResponse<Author>> {
  const response = await axiosClient.post('/authors', data);
  return response.data;
}

// PUT /api/authors/{id} - Update author (admin)
export async function updateAuthor(
  id: number, 
  data: { name?: string; bio?: string }
): Promise<ApiResponse<Author>> {
  const response = await axiosClient.put(`/authors/${id}`, data);
  return response.data;
}

// DELETE /api/authors/{id} - Delete author (admin)
export async function deleteAuthor(id: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete(`/authors/${id}`);
  return response.data;
}