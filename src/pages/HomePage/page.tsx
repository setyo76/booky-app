import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

import MainLayout from '@/components/layout/MainLayout';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import PopularAuthors from './components/PopularAuthors';
import BookCard from '@/components/shared/BookCard';
import Button from '@/components/shared/Button';
import { SkeletonBookGrid } from '@/components/shared/LoadingSpinner';
import { EmptySearch, ErrorState } from '@/components/shared/StateViews';

import { useRecommendedBooks, useBorrowBook, useCart, useAddToCart, useRemoveFromCart } from '@/hooks';
import { selectSelectedCategoryId, selectSearchQuery } from '@/store/uiSlice';
import { selectIsAuthenticated } from '@/store/authSlice';
import { Book } from '@/types';

export default function HomePage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const selectedCategoryId = useSelector(selectSelectedCategoryId);
  const searchQuery = useSelector(selectSearchQuery);
  const [page, setPage] = useState(1);
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  // ✅ Fetch cart SEKALI di parent — tidak per-card agar tidak flicker
  const { data: cartData } = useCart();
  const cartItems = cartData?.data?.items ?? [];

  const { data, isLoading, isError, refetch, isFetching } = useRecommendedBooks({
    by: 'rating',
    categoryId: selectedCategoryId ?? undefined,
    page,
    limit: 10,
  });

  const books = data?.data?.books ?? [];
  const pagination = data?.data?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  // ✅ Memoize display books to prevent unnecessary re-renders
  const displayBooks = useMemo(() => {
    return page === 1 ? books : [...allBooks, ...books];
  }, [page, books, allBooks]);

  // ✅ Memoize cart item IDs for faster lookup
  const cartItemIds = useMemo(() => {
    return new Set(cartItems.map(item => item.bookId));
  }, [cartItems]);

  // ✅ UseCallback for handlers to prevent function recreation
  const handleLoadMore = useCallback(() => {
    setAllBooks(displayBooks);
    setPage((p) => p + 1);
  }, [displayBooks]);

  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook();
  const { mutate: addToCart } = useAddToCart();
  const { mutate: removeFromCart } = useRemoveFromCart();

  const handleBorrow = useCallback((book: Book) => {
    if (!isAuthenticated) {
      toast.error('Please login to borrow books.');
      return;
    }
    borrowBook(book.id);
  }, [isAuthenticated, borrowBook]);

  const handleCartToggle = useCallback((book: Book) => {
    if (!isAuthenticated) {
      toast.error('Please login to add books to cart.');
      return;
    }
    const cartItem = cartItems.find((item) => item.bookId === book.id);
    if (cartItem) {
      removeFromCart(cartItem.id);
    } else {
      addToCart(book.id);
    }
  }, [isAuthenticated, cartItems, removeFromCart, addToCart]);

  // ✅ Track which book is being added to cart (for loading state)
  const [loadingCartBookId, setLoadingCartBookId] = useState<number | null>(null);

  const handleCartToggleWithLoading = useCallback(async (book: Book) => {
    setLoadingCartBookId(book.id);
    try {
      await handleCartToggle(book);
    } finally {
      setLoadingCartBookId(null);
    }
  }, [handleCartToggle]);

  return (
    <MainLayout showSearch={true}>
      <div className='page-container py-6 md:py-10 flex flex-col gap-8 md:gap-10'>
        {/* Hero Banner */}
        <HeroBanner />

        {/* Categories */}
        <CategoryFilter />

        {/* Recommendation Section */}
        <section className='flex flex-col gap-5'>
          <div className="flex items-center justify-between">
            <h2 className='text-xl font-bold text-neutral-900'>Recommendation</h2>
            <Link to="/books/list" className="text-sm font-semibold text-primary hover:underline">
              View All
            </Link>
          </div>

          {isLoading && <SkeletonBookGrid count={10} />}
          {isError && <ErrorState onRetry={refetch} />}
          {!isLoading && !isError && displayBooks.length === 0 && (
            <EmptySearch query={searchQuery} />
          )}

          {!isLoading && !isError && displayBooks.length > 0 && (
            <>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
                {displayBooks.map((book) => {
                  // ✅ Fast lookup using Set
                  const isInCart = cartItemIds.has(book.id);
                  const isCartLoading = loadingCartBookId === book.id;
                  
                  return (
                    <BookCard
                      key={book.id}
                      book={book}
                      onBorrow={handleBorrow}
                      onAddToCart={handleCartToggleWithLoading}
                      isInCart={isInCart}
                      isCartLoading={isCartLoading}
                      isBorrowing={isBorrowing}
                    />
                  );
                })}
              </div>

              {hasMore && (
                <div className='flex justify-center mt-4'>
                  <Button
                    variant='secondary'
                    onClick={handleLoadMore}
                    isLoading={isFetching && page > 1}
                    className='px-8'
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        {/* Popular Authors */}
        <PopularAuthors />
      </div>
    </MainLayout>
  );
}


