import { useMutation, useQueryClient } from "@tanstack/react-query";
import { returnBook } from "@/api/otherApi";
import { toast } from "sonner"; // atau toast dari library yang Anda pakai

export const useReturnBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: number) => returnBook(loanId),
    onSuccess: () => {
      toast.success("Buku berhasil dikembalikan!");
      // Me-refresh data peminjaman agar status berubah di layar secara otomatis
      queryClient.invalidateQueries({ queryKey: ["my-loans"] }); 
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal mengembalikan buku";
      toast.error(msg);
    },
  });
};