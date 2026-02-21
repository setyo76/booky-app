// hooks/useBorrowBook.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants";
import axiosClient from "@/api/axiosClient";

interface BorrowResponse {
  success: boolean;
  message: string;
  data: {
    loan: {
      id: number;
      bookId: number;
      userId: number;
      borrowDate: string;
      dueDate: string;
      status: string;
    };
  };
}

async function borrowBook(bookId: number): Promise<BorrowResponse> {
  const response = await axiosClient.post<BorrowResponse>("/loans", { bookId });
  return response.data;
}

export function useBorrowBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number) => borrowBook(bookId),
    onSuccess: (data) => {
      toast.success("Buku berhasil dipinjam!");
      // Invalidate queries yang terkait
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTHOR_BOOKS] });
    },
    onError: (error: any) => {
      console.error("Error borrowing book:", error);
      const errorMessage = error.response?.data?.message || "Gagal meminjam buku. Silakan coba lagi.";
      toast.error(errorMessage);
    },
  });
}