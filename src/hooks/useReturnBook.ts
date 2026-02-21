import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants";
import axiosClient from "@/api/axiosClient";

async function returnBook(loanId: number) {
  const res = await axiosClient.patch(`/loans/${loanId}/return`);
  return res.data;
}

export function useReturnBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (loanId: number) => returnBook(loanId),
    onSuccess: () => {
      toast.success("The book was successfully returned.");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] });
    },
    onError: () => {
      toast.error("Failed to return the book.");
    },
  });
}