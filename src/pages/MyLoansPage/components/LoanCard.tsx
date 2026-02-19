import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

import Badge, { LoanStatusBadge } from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import { StarRatingInput } from "@/components/shared/StarRating";
import { FormField, Textarea } from "@/components/shared/FormField";
import { useCreateReview } from "@/hooks";
import { Loan } from "@/types";
import { TOAST_MESSAGES } from "@/constants";

interface LoanCardProps {
  loan: Loan;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getDuration(borrowDate: string, dueDate: string): string {
  try {
    const diff =
      new Date(dueDate).getTime() - new Date(borrowDate).getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    return `Duration ${days} Days`;
  } catch {
    return "";
  }
}

function getDueDateColor(dueDate: string, status: string): string {
  if (status === "RETURNED") return "text-neutral-500 bg-neutral-100";
  const due = new Date(dueDate);
  const now = new Date();
  if (due < now) return "text-red-600 bg-red-50"; // overdue
  const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff <= 3) return "text-orange-600 bg-orange-50"; // near due
  return "text-red-500 bg-red-50";
}

function getCover(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://library-backend-production-b9cf.up.railway.app${url}`;
}

export default function LoanCard({ loan }: LoanCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [starValue, setStarValue] = useState(0);
  const [comment, setComment] = useState("");

  const { mutate: createReview, isPending } = useCreateReview();

  const book = loan.book;
  const isOverdue =
    loan.status === "BORROWED" && new Date(loan.dueDate) < new Date();

  const displayStatus = isOverdue ? "OVERDUE" : loan.status;

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!book || starValue === 0) {
      toast.error("Pilih rating bintang terlebih dahulu.");
      return;
    }
    createReview(
      { bookId: book.id, rating: starValue, comment },
      {
        onSuccess: () => {
          toast.success(TOAST_MESSAGES.REVIEW_SUCCESS);
          setShowReviewForm(false);
          setStarValue(0);
          setComment("");
        },
        onError: () => toast.error(TOAST_MESSAGES.REVIEW_ERROR),
      }
    );
  }

  return (
    <div className="flex flex-col gap-0 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
      {/* ── Header: Status + Due Date ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Status
          </span>
          {displayStatus === "OVERDUE" ? (
            <span className="text-xs font-bold text-red-500">Overdue</span>
          ) : (
            <LoanStatusBadge status={loan.status} />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
            Due Date
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md ${getDueDateColor(
              loan.dueDate,
              loan.status
            )}`}
          >
            {formatDate(loan.dueDate)}
          </span>
        </div>
      </div>

      {/* ── Book info ── */}
      <div className="flex items-start gap-4 px-4 py-4">
        {/* Cover */}
        <Link
          to={book ? `/books/${book.id}` : "#"}
          className="shrink-0 w-[72px] h-[96px] rounded-xl overflow-hidden bg-neutral-100 block"
        >
          {book?.coverImage ? (
            <img
              src={getCover(book.coverImage)}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-neutral-300" />
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 pt-1">
          {book?.category && (
            <Badge variant="default" className="w-fit text-[11px]">
              {book.category.name}
            </Badge>
          )}
          <Link to={book ? `/books/${book.id}` : "#"}>
            <h3 className="text-sm font-bold text-neutral-900 hover:text-primary transition-colors line-clamp-2">
              {book?.title ?? "Judul tidak diketahui"}
            </h3>
          </Link>
          <p className="text-xs font-medium text-neutral-400">
            {book?.author?.name ?? book?.authorName ?? "Unknown Author"}
          </p>
          <p className="text-xs font-medium text-neutral-500">
            {formatDate(loan.borrowDate)}
            {" · "}
            {getDuration(loan.borrowDate, loan.dueDate)}
          </p>
        </div>

        {/* Give Review button — desktop (md+) */}
        <div className="hidden md:block shrink-0">
          <Button
            size="sm"
            onClick={() => setShowReviewForm((v) => !v)}
            className="whitespace-nowrap"
          >
            Give Review
          </Button>
        </div>
      </div>

      {/* Give Review button — mobile */}
      <div className="md:hidden px-4 pb-4">
        <Button
          className="w-full"
          onClick={() => setShowReviewForm((v) => !v)}
        >
          Give Review
        </Button>
      </div>

      {/* ── Review form (inline) ── */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="flex flex-col gap-3 px-4 pb-4 pt-2 border-t border-neutral-100 bg-neutral-50/60"
        >
          <h4 className="text-sm font-bold text-neutral-900">Tulis Review</h4>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-600">Rating</label>
            <StarRatingInput value={starValue} onChange={setStarValue} size="sm" />
          </div>
          <FormField label="Komentar (opsional)">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalamanmu membaca buku ini..."
              rows={2}
            />
          </FormField>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowReviewForm(false)}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" isLoading={isPending}>
              Kirim
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}