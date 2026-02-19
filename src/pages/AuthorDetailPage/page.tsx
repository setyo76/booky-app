import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, BookOpen, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import BookCard from "@/components/shared/BookCard";
import { SkeletonBookGrid } from "@/components/shared/LoadingSpinner";
import { ErrorState, EmptyState } from "@/components/shared/StateViews";
import Pagination from "@/components/shared/Pagination";

import { useAuthorDetail, useBooks, useBorrowBook } from "@/hooks";
import { selectIsAuthenticated } from "@/store/authSlice";
import { selectIsInCart, addItem, removeItem } from "@/store/cartSlice";
import { selectCurrentPage, setCurrentPage } from "@/store/uiSlice";
import { Book } from "@/types";
import { TOAST_MESSAGES, PAGINATION } from "@/constants";
import { useSelector as useReduxSelector } from "react-redux";

export default function AuthorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const authorId = Number(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentPage = useSelector(selectCurrentPage);

  // Fetch author detail
  const {
    data: authorData,
    isLoading: isAuthorLoading,
    isError: isAuthorError,
    refetch: refetchAuthor,
  } = useAuthorDetail(authorId);

  const author = authorData?.data;

  // Fetch books by author
  const {
    data: booksData,
    isLoading: isBooksLoading,
    isError: isBooksError,
    refetch: refetchBooks,
  } = useBooks({
    authorId,
    page: currentPage,
    limit: PAGINATION.DEFAULT_LIMIT,
  });

  const books: Book[] = booksData?.data?.books ?? [];
  const pagination = booksData?.data?.pagination;

  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook();

  function handleBorrow(book: Book) {
    if (!isAuthenticated) {
      toast.error("Silakan login untuk meminjam buku.");
      return;
    }
    borrowBook(book.id, {
      onSuccess: () => toast.success(TOAST_MESSAGES.BORROW_SUCCESS),
      onError: () => toast.error(TOAST_MESSAGES.BORROW_ERROR),
    });
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
          Kembali
        </button>

        {/* ── Author Card ──────────────────────────────────────── */}
        {isAuthorLoading && (
          <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-2xl animate-pulse">
            <div className="w-16 h-16 rounded-full bg-neutral-200 shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-36 bg-neutral-200 rounded-full" />
              <div className="h-3 w-20 bg-neutral-200 rounded-full" />
            </div>
          </div>
        )}

        {isAuthorError && <ErrorState onRetry={refetchAuthor} />}

        {!isAuthorLoading && !isAuthorError && author && (
          <div className="flex items-center gap-4 p-4 md:p-5 border border-neutral-200 rounded-2xl bg-white shadow-xs">
            {/* Avatar */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
              <User className="w-7 h-7 text-neutral-400" />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
              <h1 className="text-base md:text-lg font-bold text-neutral-900">
                {author.name}
              </h1>
              <div className="flex items-center gap-1.5 text-sm font-medium text-neutral-500">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>
                  {pagination?.total ?? books.length} buku
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

          {isBooksLoading && <SkeletonBookGrid count={PAGINATION.DEFAULT_LIMIT} />}

          {isBooksError && <ErrorState onRetry={refetchBooks} />}

          {!isBooksLoading && !isBooksError && books.length === 0 && (
            <EmptyState
              title="Belum ada buku"
              description="Author ini belum memiliki buku yang terdaftar."
            />
          )}

          {!isBooksLoading && !isBooksError && books.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {books.map((book) => (
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
      book={book}
      onBorrow={onBorrow}
      onAddToCart={handleCartToggle}
      isInCart={isInCart}
      isBorrowing={isBorrowing}
    />
  );
}