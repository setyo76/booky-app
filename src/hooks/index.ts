import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { QUERY_KEYS, PAGINATION, TOAST_MESSAGES } from "../constants";
import * as booksApi from "../api/booksApi";
import * as loansApi from "../api/loansApi";
import * as otherApis from "../api/otherApis";
import { BooksQueryParams, RecommendedBooksParams, Book } from "../types";
import { getErrorMessage } from "../api/axiosClient";
import { getProfile, updateProfile, getMyLoans, getMyReviews } from "../api/meApi";

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
    staleTime: 1000 * 60 * 2, // 2 minutes
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
    staleTime: 1000 * 60 * 30, // Categories rarely change
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

    // Optimistic update: decrease availableCopies immediately
    onMutate: async (bookId: number) => {
      // Cancel in-flight queries for this book
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.BOOK_DETAIL, bookId],
      });

      // Snapshot previous value
      const previousBook = queryClient.getQueryData([
        QUERY_KEYS.BOOK_DETAIL,
        bookId,
      ]);

      // Optimistically update
      queryClient.setQueryData(
        [QUERY_KEYS.BOOK_DETAIL, bookId],
        (old: { data: Book } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              availableCopies: Math.max(
                0,
                (old.data.availableCopies ?? 1) - 1
              ),
            },
          };
        }
      );

      // Also update books list if cached
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
                      availableCopies: Math.max(
                        0,
                        (book.availableCopies ?? 1) - 1
                      ),
                    }
                  : book
              ),
            },
          };
        }
      );

      return { previousBook };
    },

    onSuccess: () => {
      toast.success(TOAST_MESSAGES.BORROW_SUCCESS);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] });
    },

    // Rollback on error
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
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEWS_BOOK],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.REVIEWS_MY],
      });
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


// ============================================================
// CART HOOKS
// ============================================================

export function useCart() {
  return useQuery({
    queryKey: [QUERY_KEYS.CART],
    queryFn: otherApis.getCart,
    staleTime: 1000 * 60,
  });
}

export function useCheckoutCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: otherApis.checkoutCart,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.CART_CHECKOUT_SUCCESS);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOANS_MY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error) || TOAST_MESSAGES.CART_CHECKOUT_ERROR);
    },
  });
}

export function useAuthorDetail(authorId: number) {
  return useQuery({
    queryKey: ["author-detail", authorId],
    queryFn: () => getAuthorDetail(authorId),
    enabled: !!authorId && authorId > 0,
  });
}



export function useProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => getProfile(),
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
