import axiosClient from "./axiosClient";
import { ApiResponse } from "../types";

export interface CartItemServer {
  id: number;       // itemId — dipakai saat checkout
  bookId: number;
  book?: {
    id: number;
    title: string;
    coverImage?: string;
    author?: { name: string };
    category?: { id: number; name: string };
    availableCopies?: number;
  };
}

export interface CartCheckoutPayload {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  items: CartItemServer[];
}

// GET /api/cart — ambil isi cart
export async function getCart(): Promise<ApiResponse<{ items: CartItemServer[] }>> {
  const response = await axiosClient.get<ApiResponse<{ items: CartItemServer[] }>>("/cart");
  return response.data;
}

// GET /api/cart/checkout — user info + book list untuk halaman checkout
export async function getCartCheckout(): Promise<ApiResponse<CartCheckoutPayload>> {
  const response = await axiosClient.get<ApiResponse<CartCheckoutPayload>>("/cart/checkout");
  return response.data;
}

// POST /api/cart/items — tambah buku ke cart
export async function addToCart(bookId: number): Promise<ApiResponse<{ item: CartItemServer }>> {
  const response = await axiosClient.post<ApiResponse<{ item: CartItemServer }>>("/cart/items", { bookId });
  return response.data;
}

// DELETE /api/cart/items/:itemId — hapus item dari cart
export async function removeFromCart(itemId: number): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>(`/cart/items/${itemId}`);
  return response.data;
}

// DELETE /api/cart — clear semua cart
export async function clearCart(): Promise<ApiResponse<null>> {
  const response = await axiosClient.delete<ApiResponse<null>>("/cart");
  return response.data;
}