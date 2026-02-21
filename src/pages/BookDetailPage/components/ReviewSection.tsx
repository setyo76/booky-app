import { useState } from "react";
import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { useBookReviews, useCreateReview, useDeleteReview, useMyLoans } from "@/hooks";
import { selectIsAuthenticated, selectUser } from "@/store/authSlice";
import { StarRatingDisplay, StarRatingInput } from "@/components/shared/StarRating";
import Button from "@/components/shared/Button";
import { FormField, Textarea } from "@/components/shared/FormField";
import { TOAST_MESSAGES } from "@/constants";

interface ReviewSectionProps {
  bookId: number;
  rating?: number;
  reviewCount?: number;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ReviewSection({
  bookId,
  rating = 0,
  reviewCount = 0,
}: ReviewSectionProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectUser);

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [starValue, setStarValue] = useState(0);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useBookReviews(bookId, { page });
  const reviews = data?.data?.reviews ?? [];
  const pagination = data?.data?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  // ✅ Ambil semua loan user, cek apakah ada yang RETURNED untuk buku ini
  const { data: loansData } = useMyLoans({ limit: 100 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myLoans: any[] = loansData?.data?.loans ?? loansData?.data ?? [];
  const canReview =
    isAuthenticated &&
    Array.isArray(myLoans) &&
    myLoans.some(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (loan: any) => loan.book?.id === bookId && loan.status === "RETURNED"
    );

  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();
  const { mutate: deleteReview } = useDeleteReview();

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (starValue === 0) {
      toast.error("Choose the star rating first.");
      return;
    }
    createReview(
      { bookId, star: starValue, comment },
      {
        onSuccess: () => {
          setStarValue(0);
          setComment("");
          setShowForm(false);
        },
        onError: () => toast.error(TOAST_MESSAGES.REVIEW_ERROR),
      }
    );
  }

  function handleDelete(reviewId: number) {
    deleteReview(reviewId, {
      onSuccess: () => toast.success(TOAST_MESSAGES.REVIEW_DELETE_SUCCESS),
    });
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-neutral-900">Review</h2>
          <div className="flex items-center gap-2">
            <StarRatingDisplay rating={rating} size="md" showCount={false} />
            <span className="text-sm font-medium text-neutral-500">
              ({reviewCount} Reviews)
            </span>
          </div>
        </div>

        {/* ✅ Hanya tampil jika user punya loan RETURNED untuk buku ini */}
        {canReview && !showForm && (
          <Button variant="secondary" size="sm" onClick={() => setShowForm(true)}>
            Write Review
          </Button>
        )}
      </div>

      {/* Info untuk user yang belum bisa review */}
      {isAuthenticated && !canReview && (
        <p className="text-xs text-neutral-400 font-medium italic">
          You can only write a review for a book that has been returned.
        </p>
      )}

      {/* Review form */}
      {canReview && showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="flex flex-col gap-4 p-4 border border-neutral-200 rounded-xl bg-neutral-50"
        >
          <h3 className="text-sm font-bold text-neutral-900">Write Your Review</h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-neutral-700">Rating</label>
            <StarRatingInput value={starValue} onChange={setStarValue} />
          </div>
          <FormField label="Comment (optional)">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What do you think about this book?"
              rows={3}
            />
          </FormField>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSubmitting}>
              Submit Review
            </Button>
          </div>
        </form>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-neutral-200" />
                <div className="flex flex-col gap-1">
                  <div className="h-3 w-24 bg-neutral-200 rounded-full" />
                  <div className="h-2.5 w-32 bg-neutral-200 rounded-full" />
                </div>
              </div>
              <div className="h-3 w-20 bg-neutral-200 rounded-full" />
              <div className="h-3 w-full bg-neutral-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm font-medium text-neutral-400 text-center py-8">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-2 p-4 rounded-xl border border-neutral-100 bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">
                        {review.user?.name ?? "Anonim"}
                      </p>
                      <p className="text-xs text-neutral-400 font-medium">
                        {review.createdAt ? formatDate(review.createdAt) : "-"}
                      </p>
                    </div>
                  </div>
                  {currentUser?.id === review.userId && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-xs text-red-500 hover:underline font-medium"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <StarRatingDisplay rating={review.rating} size="sm" showCount={false} />
                {review.comment && (
                  <p className="text-sm font-medium text-neutral-600 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                className="px-8"
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}