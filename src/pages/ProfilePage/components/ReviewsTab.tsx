import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, BookOpen } from "lucide-react";
import dayjs from "dayjs";

import { useMyReviews } from "@/hooks";
import { Review } from "@/types";
import Badge from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/StateViews";

function getCover(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://library-backend-production-b9cf.up.railway.app${url}`;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-4 h-4"
          fill={star <= rating ? "#F59E0B" : "none"}
          stroke={star <= rating ? "#F59E0B" : "#D1D5DB"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useMyReviews();
  const reviews: Review[] = data?.data?.reviews ?? [];

  // ✅ Tambah tipe Review pada parameter r
  const filtered = reviews.filter((r: Review) =>
    r.book?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-neutral-900">Reviews</h2>

      {/* Search */}
      <div className="relative max-w-[500px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Reviews"
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-full text-sm text-neutral-800 placeholder:text-neutral-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse border border-neutral-100 rounded-2xl p-5 flex flex-col gap-3">
              <div className="h-3 w-32 bg-neutral-200 rounded-full" />
              <div className="h-px bg-neutral-100" />
              <div className="flex gap-3">
                <div className="w-16 h-20 bg-neutral-200 rounded-xl shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3 w-16 bg-neutral-200 rounded-full" />
                  <div className="h-4 w-40 bg-neutral-200 rounded-full" />
                  <div className="h-3 w-24 bg-neutral-200 rounded-full" />
                </div>
              </div>
              <div className="h-px bg-neutral-100" />
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <div key={s} className="w-4 h-4 bg-neutral-200 rounded-full" />)}
              </div>
              <div className="h-3 w-full bg-neutral-200 rounded-full" />
              <div className="h-3 w-3/4 bg-neutral-200 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <EmptyState
          title="No reviews yet"
          description={
            search
              ? `There are no reviews for "${search}".`
              : "You haven't given any reviews for any books yet."
          }
        />
      )}

      {/* Review list */}
      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col gap-0">
          {/* ✅ Tambah tipe Review pada parameter review */}
          {filtered.map((review: Review) => {
            const book = review.book;
            return (
              <div
                key={review.id}
                className="flex flex-col gap-4 py-5 border-b border-neutral-100 last:border-b-0"
              >
                {/* Timestamp */}
                <p className="text-sm text-neutral-500">
                  {dayjs(review.createdAt).format("D MMMM YYYY, HH:mm")}
                </p>

                <div className="border border-neutral-100 rounded-2xl p-4 flex flex-col gap-4">
                  {/* Book info */}
                  {book && (
                    <>
                      <Link
                        to={`/books/${book.id}`}
                        className="flex items-center gap-3 group"
                      >
                        {/* Cover */}
                        <div className="shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-neutral-100">
                          {book.coverImage ? (
                            <img
                              src={getCover(book.coverImage)}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-neutral-300" />
                            </div>
                          )}
                        </div>

                        {/* Book detail */}
                        <div className="flex flex-col gap-1 min-w-0">
                          {book.category && (
                            <Badge variant="default" className="w-fit text-[11px]">
                              {book.category.name}
                            </Badge>
                          )}
                          <h3 className="text-sm font-bold text-neutral-900 group-hover:text-primary transition-colors line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-xs text-neutral-400">
                            {book.author?.name ?? "Unknown Author"}
                          </p>
                        </div>
                      </Link>

                      <hr className="border-neutral-100" />
                    </>
                  )}

                  {/* Rating & comment */}
                  <div className="flex flex-col gap-2">
                    <StarDisplay rating={review.rating} />
                    {review.comment && (
                      <p className="text-sm text-neutral-700 leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}