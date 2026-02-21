import { Link } from "react-router-dom";
import { ShoppingCart, BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";

import { Book } from "../../types";
import { ROUTES } from "../../constants";
import { getBookCoverUrl } from "../../lib/utils";
import { StarRatingDisplay } from "./StarRating";
import { AvailabilityBadge } from "./Badge";
import { selectIsAuthenticated } from "../../store/authSlice";

interface BookCardProps {
  book: Book;
  onBorrow?: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
  isInCart?: boolean;
  isCartLoading?: boolean;
  isBorrowing?: boolean;
}

export default function BookCard({
  book,
  onBorrow,
  onAddToCart,
  isInCart = false,
  isCartLoading = false,
  isBorrowing = false,
}: BookCardProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="group flex flex-col gap-3 cursor-pointer">
      {/* Cover image */}
      <Link
        to={ROUTES.BOOK_DETAIL.replace(":id", String(book.id))}
        className="block relative overflow-hidden rounded-xl aspect-[3/4] bg-neutral-100"
      >
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 animate-pulse">
            <span className="text-neutral-400 text-sm">Loading...</span>
          </div>
        )}

        {/* Image or error placeholder */}
        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-200 text-neutral-500">
            <BookOpen className="w-8 h-8 mb-1 opacity-50" />
            <span className="text-xs">Cover not found</span>
          </div>
        ) : (
          <img
            src={getBookCoverUrl(book.coverImage)}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}

        {/* Hover overlay with action buttons */}
        {isAuthenticated && !imageError && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-end gap-2 p-3">
            {/* Borrow button */}
            {onBorrow && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onBorrow(book);
                }}
                disabled={isBorrowing || (book.availableCopies ?? 0) === 0}
                className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-primary text-white text-xs font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={`Borrow ${book.title}`}
              >
                <BookOpen className="w-4 h-4" />
                {isBorrowing ? "Meminjam..." : "Pinjam"}
              </button>
            )}

            {/* Add to cart button */}
            {onAddToCart && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(book);
                }}
                disabled={isCartLoading || (book.availableCopies ?? 0) === 0}
                className="w-full flex items-center justify-center gap-1.5 h-9 rounded-lg bg-white text-neutral-900 text-xs font-bold hover:bg-neutral-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={isInCart ? `Remove ${book.title} from cart` : `Add ${book.title} to cart`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isCartLoading
                  ? "..."
                  : isInCart
                  ? "Di Keranjang"
                  : "Keranjang"}
              </button>
            )}
          </div>
        )}

        {/* Availability badge - always show if available */}
        {book.availableCopies !== undefined && (
          <div className="absolute top-2 right-2">
            <AvailabilityBadge
              availableCopies={book.availableCopies}
              className="shadow-sm text-[10px]"
            />
          </div>
        )}
      </Link>

      {/* Book info */}
      <Link
        to={ROUTES.BOOK_DETAIL.replace(":id", String(book.id))}
        className="flex flex-col gap-1 px-0.5"
      >
        <h3 className="text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-xs font-medium text-neutral-500 line-clamp-1">
          {book.author?.name ?? book.authorName ?? "Unknown Author"}
        </p>
        {book.rating !== undefined && book.rating > 0 && (
          <StarRatingDisplay
            rating={book.rating}
            reviewCount={book.reviewCount}
            size="sm"
            className="mt-0.5"
          />
        )}
      </Link>
    </div>
  );
}

// ── Horizontal book card ──────────────────────────────────────
interface BookCardHorizontalProps {
  book: Book;
  rightSlot?: React.ReactNode;
}

export function BookCardHorizontal({ book, rightSlot }: BookCardHorizontalProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
      <Link to={ROUTES.BOOK_DETAIL.replace(":id", String(book.id))} className="shrink-0 relative w-12 h-16">
        {/* Loading skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 animate-pulse rounded-lg">
            <span className="text-neutral-400 text-xs">...</span>
          </div>
        )}

        {/* Image or error placeholder */}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 rounded-lg">
            <BookOpen className="w-4 h-4 text-neutral-500" />
          </div>
        ) : (
          <img
            src={getBookCoverUrl(book.coverImage)}
            alt={book.title}
            className="w-full h-full object-cover rounded-lg bg-neutral-100"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}
      </Link>
      
      <div className="flex-1 min-w-0">
        <Link to={ROUTES.BOOK_DETAIL.replace(":id", String(book.id))}>
          <h3 className="text-sm font-bold text-neutral-900 line-clamp-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-xs font-medium text-neutral-500 mt-0.5 line-clamp-1">
          {book.author?.name ?? book.authorName ?? "Unknown Author"}
        </p>
        {book.category && (
          <p className="text-xs text-neutral-400 mt-0.5">{book.category.name}</p>
        )}
      </div>
      
      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  );
}