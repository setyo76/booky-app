import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import FilterSidebar from "./components/FilterSidebar";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import BookCard from "@/components/shared/BookCard";
import Pagination from "@/components/shared/Pagination";
import Button from "@/components/shared/Button";
import { SkeletonBookGrid } from "@/components/shared/LoadingSpinner";
import { EmptySearch, ErrorState } from "@/components/shared/StateViews";

// ✅ Hapus import Redux cart, tambah server cart hooks
import { useBooks, useBorrowBook, useCart, useAddToCart, useRemoveFromCart } from "@/hooks";
import {
  selectSelectedCategoryId,
  selectMinRating,
  selectSearchQuery,
  selectCurrentPage,
  setCurrentPage,
} from "@/store/uiSlice";
import { selectIsAuthenticated } from "@/store/authSlice";
import { Book } from "@/types";

export default function BookListPage() {
  const dispatch = useDispatch();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const selectedCategoryId = useSelector(selectSelectedCategoryId);
  const minRating = useSelector(selectMinRating);
  const searchQuery = useSelector(selectSearchQuery);
  const currentPage = useSelector(selectCurrentPage);

  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [selectedCategoryId, minRating, searchQuery, dispatch]);

  const { data, isLoading, isError, refetch } = useBooks({
    q: searchQuery || undefined,
    categoryId: selectedCategoryId ?? undefined,
    minRating: minRating ?? undefined,
    page: currentPage,
    limit: PAGINATION.DEFAULT_LIMIT,
  });

  const books: Book[] = data?.data?.books ?? [];
  const pagination = data?.data?.pagination;

  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook();

  // ✅ Fetch server cart sekali di parent, pass ke setiap card
  const { data: cartData } = useCart();
  const cartItems = cartData?.data?.items ?? [];

  function handleBorrow(book: Book) {
    if (!isAuthenticated) {
      toast.error("Silakan login untuk meminjam buku.");
      return;
    }
    borrowBook(book.id);
  }

  return (
    <MainLayout showSearch={true}>
      <div className="page-container py-6 md:py-10">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Book List</h1>

        <div className="flex gap-8 items-start">

          {/* Sidebar (desktop) */}
          <aside className="hidden md:block w-[266px] shrink-0 border border-neutral-200 rounded-2xl p-4 sticky top-28">
            <FilterSidebar />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* Mobile filter button */}
            <div className="flex items-center justify-between md:hidden">
              <p className="text-sm font-medium text-neutral-500">
                {pagination ? `${pagination.total} buku ditemukan` : ""}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMobileFilterOpen(true)}
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
              >
                Filter
              </Button>
            </div>

            {isLoading && <SkeletonBookGrid count={PAGINATION.DEFAULT_LIMIT} />}
            {isError && <ErrorState onRetry={refetch} />}
            {!isLoading && !isError && books.length === 0 && (
              <EmptySearch query={searchQuery} />
            )}

            {!isLoading && !isError && books.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {books.map((book) => (
                    <BookCardWithCart
                      key={book.id}
                      book={book}
                      onBorrow={handleBorrow}
                      isBorrowing={isBorrowing}
                      cartItems={cartItems}
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
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />
    </MainLayout>
  );
}

// ── Per-book cart aware wrapper ──────────────────────────────
function BookCardWithCart({
  book,
  onBorrow,
  isBorrowing,
  cartItems,
}: {
  book: Book;
  onBorrow: (book: Book) => void;
  isBorrowing: boolean;
  cartItems: { id: number; bookId: number }[];
}) {
  // ✅ Cek isInCart dari server cart items
  const cartItem = cartItems.find((item) => item.bookId === book.id);
  const isInCart = !!cartItem;

  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();

  function handleCartToggle() {
    if (isInCart && cartItem) {
      removeFromCart(cartItem.id);
    } else {
      addToCart(book.id);
    }
  }

  return (
    <BookCard
      book={book}
      onBorrow={onBorrow}
      onAddToCart={handleCartToggle}
      isInCart={isInCart}
      isCartLoading={isAdding || isRemoving}
      isBorrowing={isBorrowing}
    />
  );
}
