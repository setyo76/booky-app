import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';

import MainLayout from '@/components/layout/MainLayout';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import PopularAuthors from './components/PopularAuthors';
import BookCard from '@/components/shared/BookCard';
import Button from '@/components/shared/Button';
import { SkeletonBookGrid } from '@/components/shared/LoadingSpinner';
import { EmptySearch, ErrorState } from '@/components/shared/StateViews';

import { useRecommendedBooks, useBorrowBook, useCart } from '@/hooks';
import { selectSelectedCategoryId, selectSearchQuery } from '@/store/uiSlice';
import { selectIsAuthenticated } from '@/store/authSlice';
import { selectIsInCart, addItem, removeItem } from '@/store/cartSlice';
import { Book } from '@/types';
import { TOAST_MESSAGES } from '@/constants';

export default function HomePage() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const selectedCategoryId = useSelector(selectSelectedCategoryId);
  const searchQuery = useSelector(selectSearchQuery);
  const [page, setPage] = useState(1);
  const [allBooks, setAllBooks] = useState<Book[]>([]);

  // Fetch recommended books
  const { data, isLoading, isError, refetch, isFetching } = useRecommendedBooks(
    {
      by: 'rating',
      categoryId: selectedCategoryId ?? undefined,
      page,
      limit: 10,
    }
  );

  const books = data?.data?.books ?? [];
  const pagination = data?.data?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  // Combine pages for load more
  const displayBooks = page === 1 ? books : [...allBooks, ...books];

  function handleLoadMore() {
    setAllBooks(displayBooks);
    setPage((p) => p + 1);
  }

  // Borrow mutation
  const { mutate: borrowBook, isPending: isBorrowing } = useBorrowBook();

  function handleBorrow(book: Book) {
    if (!isAuthenticated) {
      toast.error('Silakan login untuk meminjam buku.');
      return;
    }
    borrowBook(book.id);
  }

  function handleCartToggle(book: Book) {
    const isInCart = false; // Will be handled per-book
    if (isInCart) {
      dispatch(removeItem(book.id));
      toast.success(TOAST_MESSAGES.CART_REMOVED);
    } else {
      dispatch(addItem(book));
      toast.success(TOAST_MESSAGES.CART_ADDED);
    }
  }

  return (
    <MainLayout showSearch={true}>
      <div className='page-container py-6 md:py-10 flex flex-col gap-8 md:gap-10'>
        {/* Hero Banner */}
        <HeroBanner />

        {/* Categories */}
        <CategoryFilter />

        {/* Recommendation Section */}
        <section className='flex flex-col gap-5'>
          {/* Header with "Lihat Semua" link */}
          <div className="flex items-center justify-between">
            <h2 className='text-xl font-bold text-neutral-900'>Recommendation</h2>
            <Link
              to="/books/list"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {/* Loading */}
          {isLoading && <SkeletonBookGrid count={10} />}

          {/* Error */}
          {isError && <ErrorState onRetry={refetch} />}

          {/* Empty */}
          {!isLoading && !isError && displayBooks.length === 0 && (
            <EmptySearch query={searchQuery} />
          )}

          {/* Book Grid */}
          {!isLoading && !isError && displayBooks.length > 0 && (
            <>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6'>
                {displayBooks.map((book) => (
                  <BookCardWithCart
                    key={book.id}
                    book={book}
                    onBorrow={handleBorrow}
                    onCartToggle={handleCartToggle}
                    isBorrowing={isBorrowing}
                  />
                ))}
              </div>

              {/* Load More */}
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

// ── Per-book cart aware card ─────────────────────────────────
function BookCardWithCart({ book, onBorrow, onCartToggle, isBorrowing }: {
  book: Book;
  onBorrow: (book: Book) => void;
  onCartToggle: (book: Book) => void;
  isBorrowing: boolean;
}) {

const { data: cartData } = useCart();
const isInCart = cartData?.data?.items?.some(item => item.bookId === book.id) ?? false;

  return (
    <BookCard
      book={book}
      onBorrow={onBorrow}
      onAddToCart={onCartToggle}
      isInCart={isInCart}
      isBorrowing={isBorrowing}
    />
  );
}
