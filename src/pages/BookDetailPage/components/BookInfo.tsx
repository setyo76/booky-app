import { Star } from 'lucide-react';
import { Book } from '@/types';
import { getBookCoverUrl } from '@/lib/utils';
import Badge from '@/components/shared/Badge';
import Button from '@/components/shared/Button';
import { StarRatingDisplay } from '@/components/shared/StarRating';

interface BookInfoProps {
  book: Book;
  onBorrow: () => void;
  onAddToCart: () => void;
  isBorrowing: boolean;
  isInCart: boolean;
  isAuthenticated: boolean;
}

export default function BookInfo({
  book,
  onBorrow,
  onAddToCart,
  isBorrowing,
  isInCart,
  isAuthenticated,
}: BookInfoProps) {
  const available = (book.availableCopies ?? 0) > 0;

  return (
    <div className='flex flex-col md:flex-row gap-6 md:gap-10'>
      {/* Cover */}
      <div className='flex justify-center md:justify-start shrink-0'>
        <img
          src={getBookCoverUrl(book.coverImage)}
          alt={book.title}
          className='w-[180px] md:w-[200px] rounded-xl shadow-md object-cover aspect-[3/4] bg-neutral-100'
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-book.png';
          }}
        />
      </div>

      {/* Info */}
      <div className='flex flex-col gap-4 flex-1'>
        {/* Category badge */}
        {book.category && <Badge variant='default'>{book.category.name}</Badge>}

        {/* Title & Author */}
        <div className='flex flex-col gap-1'>
          <h1 className='text-2xl md:text-3xl font-bold text-neutral-900 leading-tight'>
            {book.title}
          </h1>
          <p className='text-sm font-medium text-neutral-500'>
            {book.author?.name ?? book.authorName ?? 'Unknown Author'}
          </p>
        </div>

        {/* Rating */}
        {book.rating !== undefined && (
          <StarRatingDisplay rating={book.rating} size='md' showCount={false} />
        )}

        {/* Stats */}
        <div className='flex items-center gap-0 border-t border-b border-neutral-200 py-4'>
          <StatItem value={book.totalCopies ?? '-'} label='Page' />
          <div className='w-px h-8 bg-neutral-200' />
          <StatItem value={book.reviewCount ?? '-'} label='Rating' />
          <div className='w-px h-8 bg-neutral-200' />
          <StatItem value={book.reviewCount ?? '-'} label='Reviews' />
        </div>

        {/* Description */}
        <div className='flex flex-col gap-2'>
          <h2 className='text-base font-bold text-neutral-900'>Description</h2>
          <p className='text-sm font-medium text-neutral-600 leading-relaxed'>
            {book.description ?? 'Tidak ada deskripsi tersedia.'}
          </p>
        </div>

        {/* Action Buttons */}
        {isAuthenticated && (
          <div className='flex gap-3 mt-2'>
            <Button
              variant='secondary'
              onClick={onAddToCart}
              disabled={isInCart || !available}
              className='flex-1 md:flex-none md:px-6'
            >
              {isInCart ? 'Di Keranjang' : 'Add to Cart'}
            </Button>
            <Button
              onClick={onBorrow}
              isLoading={isBorrowing}
              disabled={!available}
              className='flex-1 md:flex-none md:px-6'
            >
              {available ? 'Borrow Book' : 'Stok Habis'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string | number; label: string }) {
  return (
    <div className='flex flex-col items-center flex-1 gap-0.5'>
      <span className='text-lg font-bold text-neutral-900'>{value}</span>
      <span className='text-xs font-medium text-neutral-400'>{label}</span>
    </div>
  );
}
