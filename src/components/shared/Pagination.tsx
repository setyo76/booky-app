import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  function getPages(): (number | '...')[] {
    const pages: (number | '...')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }

  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);

  return (
    <div className='w-full flex items-center justify-between px-6 py-4 border-t border-neutral-200'>
      {/* Info text */}
      <p className='text-sm font-medium text-neutral-500'>
        Showing {from} to {to} of {total} entries
      </p>

      {/* Page controls */}
      <div className='flex items-center gap-1'>
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
        >
          <ChevronLeft className='w-4 h-4' />
          Previous
        </button>

        {/* Page numbers */}
        <div className='flex items-center gap-1'>
          {getPages().map((page, idx) =>
            page === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                className='w-9 h-9 flex items-center justify-center text-sm text-neutral-400'
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='flex items-center gap-1 px-3 h-9 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
        >
          Next
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
