import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import BookInfo from "./components/BookInfo";
import ReviewSection from "./components/ReviewSection";
import RelatedBooks from "./components/RelatedBooks";
import { SkeletonCard } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/StateViews";

import { useBookDetail, useBorrowBook, useAddToCart, useRemoveFromCart, useCart } from "@/hooks";
import { selectIsAuthenticated } from "@/store/authSlice";
import { ROUTES } from "@/constants";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data, isLoading, isError, refetch } = useBookDetail(bookId);
  const book = data?.data;

  // ✅ Cek isInCart dari server cart (bukan Redux)
  const { data: cartData } = useCart();
  const cartItems = cartData?.data?.items ?? [];
  const isInCart = cartItems.some((item) => item.bookId === bookId);

  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { mutate: removeFromCart, isPending: isRemovingFromCart } = useRemoveFromCart();

  function handleBorrow() {
    if (!isAuthenticated) {
      toast.error("Silakan login untuk meminjam buku.");
      navigate(ROUTES.LOGIN);
      return;
    }
    borrowBook(bookId);
  }

  function handleCartToggle() {
    if (!isAuthenticated) {
      toast.error("Silakan login untuk menambahkan ke keranjang.");
      navigate(ROUTES.LOGIN);
      return;
    }

    if (isInCart) {
      // Cari itemId dari server cart untuk di-remove
      const cartItem = cartItems.find((item) => item.bookId === bookId);
      if (cartItem) removeFromCart(cartItem.id);
    } else {
      addToCart(bookId);
    }
  }

  return (
    <MainLayout showSearch={true}>
      <div className="page-container py-6 md:py-10 flex flex-col gap-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm font-medium flex-wrap">
          <Link to={ROUTES.BOOKS} className="text-primary hover:underline">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          {book?.category && (
            <>
              <span className="text-primary hover:underline cursor-pointer">
                {book.category.name}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </>
          )}
          <span className="text-neutral-500 line-clamp-1">
            {book?.title ?? "..."}
          </span>
        </nav>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-[200px] shrink-0">
              <SkeletonCard />
            </div>
            <div className="flex-1 flex flex-col gap-4 animate-pulse">
              <div className="h-5 w-24 bg-neutral-200 rounded-full" />
              <div className="h-8 w-2/3 bg-neutral-200 rounded-full" />
              <div className="h-4 w-1/3 bg-neutral-200 rounded-full" />
              <div className="h-4 w-20 bg-neutral-200 rounded-full" />
              <div className="h-px bg-neutral-200 w-full" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 flex-1 bg-neutral-200 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {isError && <ErrorState onRetry={refetch} />}

        {/* Content */}
        {!isLoading && !isError && book && (
          <>
            <BookInfo
              book={book}
              onBorrow={handleBorrow}
              onAddToCart={handleCartToggle}
              isBorrowing={isBorrowing}
              isInCart={isInCart}
              isCartLoading={isAddingToCart || isRemovingFromCart}
              isAuthenticated={isAuthenticated}
            />

            <div className="h-px bg-neutral-200" />

            <ReviewSection
              bookId={bookId}
              rating={book.rating}
              reviewCount={book.reviewCount}
            />

            <div className="h-px bg-neutral-200" />

            <RelatedBooks
              categoryId={book.category?.id}
              currentBookId={bookId}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}