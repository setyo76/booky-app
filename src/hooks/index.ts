import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS, PAGINATION, TOAST_MESSAGES } from "../constants";
import * as booksApi from "../api/booksApi";
import * as loansApi from "../api/loansApi";
import * as otherApis from "../api/otherApis";
import { BooksQueryParams, RecommendedBooksParams, Book } from "../types";
import { getErrorMessage } from "../api/axiosClient";
import { getProfile, updateProfile, getMyLoans, getMyReviews } from "../api/meApi";
import * as cartApi from "../api/cartApi";

// ============================================================
// BOOKS HOOKS
// ============================================================

export function useBooks(params: BooksQueryParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS, params],
    queryFn: () =>
      booksApi.getBooks({
        limit: PAGINATION.DEFAULT_LIMIT,
        page: PAGINATION.DEFAULT_PAGE,
        ...params,
      }),
    staleTime: 1000 * 60 * 2,
  });
}

export function useBookDetail(id: number, options?: UseQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOK_DETAIL, id],
    queryFn: () => booksApi.getBookById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...(options as object),
  });
}

export function useRecommendedBooks(params: RecommendedBooksParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS_RECOMMENDED, params],
    queryFn: () =>
      booksApi.getRecommendedBooks({
        by: "rating",
        limit: PAGINATION.RECOMMENDED_LIMIT,
        page: 1,
        ...params,
      }),
    staleTime: 1000 * 60 * 10,
  });
}

export function useAdminBooks(params: BooksQueryParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.ADMIN_BOOKS, params],
    queryFn: () => booksApi.getAdminBooks(params),
    staleTime: 1000 * 60 * 1,
  });
}

// ============================================================
// CATEGORIES & AUTHORS HOOKS
// ============================================================

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: otherApis.getCategories,
    staleTime: 1000 * 60 * 30,
  });
}

export function useAuthors(q?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHORS, q],
    queryFn: () => otherApis.getAuthors(q ? { q } : undefined),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePopularAuthors() {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHORS, "popular"],
    queryFn: otherApis.getPopularAuthors,
    staleTime: 1000 * 60 * 10,
  });
}

// ============================================================
// LOANS HOOKS
// ============================================================

export function useAdminLoans(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [QUERY_KEYS.LOANS_ADMIN, params],
    queryFn: () => loansApi.getAdminLoans(params),
    staleTime: 1000 * 30,
  });
}

export function useOverdueLoans() {
  return useQuery({
    queryKey: [QUERY_KEYS.LOANS_OVERDUE],
    queryFn: loansApi.getOverdueLoans,
    staleTime: 1000 * 60,
  });
}

// ============================================================
// BORROW MUTATION — with Optimistic UI
// ============================================================

export function useBorrowBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: number) => loansApi.borrowBook({ bookId }),

    onMutate: async (bookId: number) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.BOOK_DETAIL, bookId],
      });

      const previousBook = queryClient.getQueryData([
        QUERY_KEYS.BOOK_DETAIL,
        bookId,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.BOOK_DETAIL, bookId],
        (old: { data: Book } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              availableCopies: Math.max(0, (old.data.availableCopies ?? 1) - 1),
            },
          };
        }
      );

      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.BOOKS] },
        (old: { data?: { books?: Book[] } } | undefined) => {
          if (!old?.data?.books) return old;
          return {
            ...old,
            data: {
              ...old.data,
              books: old.data.books.map((book) =>
                book.id === bookId
                  ? {
                      ...book,
                      availableCopies: Math.max(0, (book.availableCopies ?? 1) - 1),
                    }
                  : book
              ),
            },
          };
        }
      );

      return { previousBook };
    },

    onSuccess: (_, bookId) => {
      toast.success(TOAST_MESSAGES.BORROW_SUCCESS);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });

      // ✅ Cek apakah buku ini ada di server cart — jika ada, hapus manual
      // karena backend tidak otomatis menghapus cart item saat borrow langsung
      const cartData = queryClient.getQueryData<{
        data: { items: { id: number; bookId: number }[] };
      }>([QUERY_KEYS.CART]);

      const cartItem = cartData?.data?.items?.find(
        (item) => item.bookId === bookId
      );

      if (cartItem) {
        // Hapus dari server cart lalu invalidate
        cartApi.removeFromCart(cartItem.id).then(() => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
        }).catch(() => {
          // Jika hapus gagal, tetap invalidate agar UI sync
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
        });
      } else {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      }
    },

    onError: (error, bookId, context) => {
      if (context?.previousBook) {
        queryClient.setQueryData(
          [QUERY_KEYS.BOOK_DETAIL, bookId],
          context.previousBook
        );
      }
      toast.error(getErrorMessage(error) || TOAST_MESSAGES.BORROW_ERROR);
    },

    onSettled: (_, __, bookId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BOOK_DETAIL, bookId],
      });
    },
  });
}

// ============================================================
// RETURN MUTATION
// ============================================================

export function useReturnBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: number) => loansApi.returnBook(loanId),
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.RETURN_SUCCESS);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || TOAST_MESSAGES.RETURN_ERROR);
    },
  });
}

// ============================================================
// REVIEWS HOOKS
// ============================================================

export function useBookReviews(bookId?: number, params?: { page?: number }) {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS_BOOK, bookId, params],
    queryFn: () => otherApis.getBookReviews({ bookId, ...params }),
    enabled: !!bookId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: otherApis.createReview,
    onSuccess: (_, variables) => {
      toast.success(TOAST_MESSAGES.REVIEW_SUCCESS);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEWS_BOOK, variables.bookId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.BOOK_DETAIL, variables.bookId],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || TOAST_MESSAGES.REVIEW_ERROR);
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: otherApis.deleteReview,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.REVIEW_DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS_BOOK] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS_MY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ============================================================
// PROFILE HOOKS
// ============================================================

export function useMyProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: otherApis.getMyProfile,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAuthorDetail(authorId: number) {
  return useQuery({
    queryKey: ["author-detail", authorId],
    queryFn: () => otherApis.getAuthorDetail(authorId),
    enabled: !!authorId && authorId > 0,
  });
}

export function useProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => getProfile(),
    // ✅ Response struktur: { success, data: { profile: {...}, loanStats, reviewsCount } }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (response: any) => response?.data?.profile ?? response?.data ?? response,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name?: string; phone?: string; bio?: string }) =>
      updateProfile(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] }),
  });
}

export function useMyLoans(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [QUERY_KEYS.LOANS_MY, params],
    queryFn: () => getMyLoans(params),
  });
}

export function useMyReviews(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS_MY, params],
    queryFn: () => getMyReviews(params),
  });
}

// ============================================================
// CART HOOKS
// ============================================================

export function useCart() {
  return useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: cartApi.getCart,
    staleTime: 1000 * 60,
  });
}

export function useCartCheckout() {
  return useQuery({
    queryKey: [QUERY_KEYS.CART, "checkout"],
    queryFn: cartApi.getCartCheckout,
    staleTime: 0,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: number) => cartApi.addToCart(bookId),
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CART_ADDED);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Gagal menambahkan ke keranjang.");
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeFromCart(itemId),
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CART_REMOVED);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || "Gagal menghapus dari keranjang.");
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });
}

// ============================================================
// BORROW FROM CART
// ============================================================

export function useBorrowFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      itemIds: number[];
      borrowDate: string;
      duration: 3 | 5 | 10;
    }) => loansApi.borrowFromCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || TOAST_MESSAGES.BORROW_ERROR);
    },
  });
}