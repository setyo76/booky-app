import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, BookOpen, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import MainLayout from "@/components/layout/MainLayout";
import BookCard from "@/components/shared/BookCard";
import { SkeletonBookGrid } from "@/components/shared/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/shared/StateViews";
import Pagination from "@/components/shared/Pagination";

import { getAuthors, getAuthorBooks } from "@/api/authorsApi";
import { useBorrowBook } from "@/hooks/useBorrowBook";
import { selectIsAuthenticated } from "@/store/authSlice";
import { selectIsInCart, addItem, removeItem } from "@/store/cartSlice";
import { selectCurrentPage, setCurrentPage } from "@/store/uiSlice";
import { Book, Author } from "@/types";
import { TOAST_MESSAGES, PAGINATION, QUERY_KEYS } from "@/constants";
import { useSelector as useReduxSelector } from "react-redux";

export default function AuthorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const authorId = Number(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentPage = useSelector(selectCurrentPage);

  // Validasi ID
  useEffect(() => {
    if (isNaN(authorId)) {
      toast.error("Invalid author ID");
      navigate("/authors");
    }
  }, [authorId, navigate]);

  // ── 1. Fetch all authors (because there is no endpoint /authors/{id}) ──
  const {
    data: authorsResponse,
    isLoading: isAuthorsLoading,
    isError: isAuthorsError,
    error: authorsError,
    refetch: refetchAuthors,
  } = useQuery({
    queryKey: [QUERY_KEYS.AUTHORS_LIST],
    queryFn: () => getAuthors({ limit: 100 }),
    enabled: !!authorId && !isNaN(authorId),
  });

  // Response log for debugging
  useEffect(() => {
    if (authorsResponse) {
      console.log("Authors API Response:", authorsResponse);
    }
  }, [authorsResponse]);

// Find the author that matches the ID from params
// Handle different response structures
  const authors = Array.isArray(authorsResponse?.data) 
    ? authorsResponse.data 
    : authorsResponse?.data?.authors || [];
  
  const author = authors.find((a: Author) => a.id === authorId);

 // ── 2. Fetch books by author from the correct endpoint ──
  const {
    data: booksResponse,
    isLoading: isBooksLoading,
    isError: isBooksError,
    error: booksError,
    refetch: refetchBooks,
  } = useQuery({
    queryKey: [QUERY_KEYS.AUTHOR_BOOKS, authorId, currentPage],
    queryFn: () =>
      getAuthorBooks(authorId, {
        page: currentPage,
        limit: PAGINATION.DEFAULT_LIMIT,
      }),
    enabled: !!authorId && !isNaN(authorId),
  });

  // Handle different response structures for books
  const books = booksResponse?.data?.books || booksResponse?.data || [];
  const pagination = booksResponse?.data?.pagination || null;

  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook();

  function handleBorrow(book: Book) {
    if (!isAuthenticated) {
      toast.error("Please login to borrow books.");
      return;
    }
    borrowBook(book.id);
  }

  
// Handle retry for all queries
  const handleRetry = () => {
    refetchAuthors();
    refetchBooks();
  };

  // Loading state
  if (isAuthorsLoading) {
    return (
      <MainLayout showSearch={true}>
        <div className="page-container py-6 md:py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors w-fit mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-2xl animate-pulse">
            <div className="w-16 h-16 rounded-full bg-neutral-200 shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 w-48 bg-neutral-200 rounded-full" />
              <div className="h-4 w-24 bg-neutral-200 rounded-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

 // Show error if failed to fetch author data
  if (isAuthorsError) {
    return (
      <MainLayout showSearch={true}>
        <div className="page-container py-6 md:py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors w-fit mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <ErrorState
            onRetry={handleRetry}
            message="Failed to load author data. Please try again."
          />
        </div>
      </MainLayout>
    );
  }

  // Author not found
  if (!isAuthorsLoading && !author) {
    return (
      <MainLayout showSearch={true}>
        <div className="page-container py-6 md:py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors w-fit mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="p-8 text-center border border-neutral-200 rounded-2xl">
            <p className="text-neutral-500">Author not found</p>
            <button
              onClick={() => navigate("/authors")}
              className="mt-4 text-primary hover:underline"
            >
              View all authors
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSearch={true}>
      <div className="page-container py-6 md:py-10 flex flex-col gap-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* ── Author Card ──────────────────────────────────────── */}
        {author && (
          <div className="flex items-center gap-4 p-4 md:p-5 border border-neutral-200 rounded-2xl bg-white shadow-xs">
            {/* Avatar */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
              <User className="w-7 h-7 text-neutral-400" />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 flex-1">
              <h1 className="text-base md:text-lg font-bold text-neutral-900">
                {author.name}
              </h1>
              <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>
                  {pagination?.total ?? books.length}{" "}
                  {books.length === 1 ? "book" : "books"}
                </span>
              </div>
              {author.bio && (
                <p className="text-sm text-neutral-500 font-medium mt-1 line-clamp-2">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Book List ─────────────────────────────────────────── */}
        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-neutral-900">Book List</h2>

          {isBooksLoading && (
            <SkeletonBookGrid count={PAGINATION.DEFAULT_LIMIT} />
          )}

          {isBooksError && (
            <ErrorState
              onRetry={refetchBooks}
              message="Failed to load books. Please try again."
            />
          )}

          {!isBooksLoading && !isBooksError && books.length === 0 && (
            <EmptyState
              title="No books yet"
              description="This author doesn't have any books registered yet."
            />
          )}

          {!isBooksLoading && !isBooksError && books.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {books.map((book: Book) => (
                  <BookCardWithCart
                    key={book.id}
                    book={book}
                    onBorrow={handleBorrow}
                    isBorrowing={isBorrowing}
                  />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  total={pagination.total}
                  limit={pagination.limit}
                  onPageChange={(page) => {
                    dispatch(setCurrentPage(page));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </>
          )}
        </section>
      </div>
    </MainLayout>
  );
}

// ── Per-book cart aware wrapper ──────────────────────────────
function BookCardWithCart({
  book,
  onBorrow,
  isBorrowing,
}: {
  book: Book;
  onBorrow: (book: Book) => void;
  isBorrowing: boolean;
}) {
  const dispatch = useDispatch();
  const isInCart = useReduxSelector(selectIsInCart(book.id));

  function handleCartToggle() {
    if (isInCart) {
      dispatch(removeItem(book.id));
      toast.success(TOAST_MESSAGES.CART_REMOVED);
    } else {
      dispatch(addItem(book));
      toast.success(TOAST_MESSAGES.CART_ADDED);
    }
  }

  return (
    <BookCard
      key={book.id}
      book={book}
      onBorrow={onBorrow}
      onAddToCart={handleCartToggle}
      isInCart={isInCart}
      isBorrowing={isBorrowing}
    />
  );
}