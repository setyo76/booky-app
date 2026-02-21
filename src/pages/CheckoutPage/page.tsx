import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, BookOpen } from "lucide-react";
import { toast } from "sonner";
import dayjs from "dayjs";

import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import { Checkbox } from "@/components/shared/Checkbox";

import { useCartCheckout, useBorrowFromCart } from "@/hooks";

const BORROW_DURATIONS: { label: string; value: 3 | 5 | 10 }[] = [
  { label: "3 Days", value: 3 },
  { label: "5 Days", value: 5 },
  { label: "10 Days", value: 10 },
];

function getCover(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://library-backend-production-b9cf.up.railway.app${url}`;
}

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [borrowDate, setBorrowDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [duration, setDuration] = useState<3 | 5 | 10>(3);
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const { data, isLoading, isError } = useCartCheckout();
  const checkoutData = data?.data;
  const user = checkoutData?.user;
  const items = checkoutData?.items ?? [];

  const returnDate = useMemo(
    () => dayjs(borrowDate).add(duration, "day"),
    [borrowDate, duration]
  );

  const { mutate: borrowFromCart, isPending } = useBorrowFromCart();

  // ✅ navigate inside useEffect, not directly during render
  useEffect(() => {
    if (!isLoading && !isError && items.length === 0) {
      navigate("/cart");
    }
  }, [isLoading, isError, items.length, navigate]);

  function handleConfirm() {
    if (!agreeReturn || !agreePolicy) {
      toast.error("Please agree to both statements before continuing.");
      return;
    }

    const itemIds = items.map((item) => item.id);

    borrowFromCart(
      { itemIds, borrowDate, duration },
      {
        onSuccess: (res) => {
          const dueDate = res.data.loans?.[0]?.dueDate;
          navigate("/checkout/success", {
            state: {
              returnDate: dueDate
                ? dayjs(dueDate).format("D MMMM YYYY")
                : returnDate.format("D MMMM YYYY"),
            },
          });
        },
        onError: () => {
        },
      }
    );
  }

  return (
    <MainLayout showSearch>
      <div className="page-container py-6 md:py-10">
        <h1 className="text-2xl font-bold text-neutral-900 mb-8">Checkout</h1>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-sm text-neutral-500">Failed to load checkout data.</p>
            <Button variant="secondary" onClick={() => navigate("/cart")}>
              Back to Cart
            </Button>
          </div>
        )}

        {/* ✅ Tambah guard items.length > 0 agar tidak render saat kosong */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* ── Left: User Info + Book List ──────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* User Information */}
              <section>
                <h2 className="text-base font-bold text-neutral-900 mb-4">
                  User Information
                </h2>
                <div className="flex flex-col divide-y divide-neutral-100">
                  <InfoRow label="Name" value={user?.name ?? "—"} />
                  <InfoRow label="Email" value={user?.email ?? "—"} />
                  <InfoRow label="Nomor Handphone" value={user?.phone ?? "—"} />
                </div>
              </section>

              <hr className="border-neutral-200" />

              {/* Book List */}
              <section>
                <h2 className="text-base font-bold text-neutral-900 mb-4">
                  Book List
                </h2>
                <div className="flex flex-col divide-y divide-neutral-100">
                  {items.map((item) => (
                    <CheckoutBookItem key={item.id} item={item} />
                  ))}
                </div>
              </section>
            </div>

            {/* ── Right: Borrow Request Form ────────────────────── */}
            <aside className="w-full md:w-[340px] shrink-0 md:sticky md:top-28">
              <div className="border border-neutral-200 rounded-2xl p-6 bg-white flex flex-col gap-5">
                <h2 className="text-lg font-bold text-neutral-900">
                  Complete Your Borrow Request
                </h2>

                {/* Borrow Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-neutral-800">
                    Borrow Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={borrowDate}
                      min={dayjs().format("YYYY-MM-DD")}
                      onChange={(e) => setBorrowDate(e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 bg-neutral-50 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary pr-10"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Borrow Duration */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-neutral-800">
                    Borrow Duration
                  </label>
                  <div className="flex flex-col gap-2">
                    {BORROW_DURATIONS.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="duration"
                          value={opt.value}
                          checked={duration === opt.value}
                          onChange={() => setDuration(opt.value)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-neutral-700">
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Return Date */}
                <div className="bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-neutral-600 mb-1">
                    Return Date
                  </p>
                  <p className="text-sm text-neutral-600">
                    Please return the book no later than{" "}
                    <span className="text-red-500 font-semibold">
                      {returnDate.format("D MMMM YYYY")}
                    </span>
                  </p>
                </div>

                {/* Agreements */}
                <div className="flex flex-col gap-3">
                  <Checkbox
                    checked={agreeReturn}
                    onChange={() => setAgreeReturn((v) => !v)}
                    label="I agree to return the book(s) before the due date."
                  />
                  <Checkbox
                    checked={agreePolicy}
                    onChange={() => setAgreePolicy((v) => !v)}
                    label="I accept the library borrowing policy."
                  />
                </div>

                {/* CTA */}
                <Button
                  className="w-full"
                  onClick={handleConfirm}
                  isLoading={isPending}
                  disabled={!agreeReturn || !agreePolicy || isPending}
                >
                  Confirm &amp; Borrow
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

// ── Sub-components ────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-900">{value}</span>
    </div>
  );
}

function CheckoutBookItem({
  item,
}: {
  item: {
    id: number;
    bookId: number;
    book?: {
      id: number;
      title: string;
      coverImage?: string;
      author?: { name: string };
      category?: { id: number; name: string };
    };
  };
}) {
  const book = item.book;
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="shrink-0 w-[56px] h-[76px] rounded-xl overflow-hidden bg-neutral-100">
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
            <BookOpen className="w-5 h-5 text-neutral-300" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {book?.category && (
          <Badge variant="default" className="w-fit text-[11px]">
            {book.category.name}
          </Badge>
        )}
        <h3 className="text-sm font-bold text-neutral-900 line-clamp-2">
          {book?.title ?? "—"}
        </h3>
        <p className="text-xs font-medium text-neutral-400">
          {book?.author?.name ?? "Unknown Author"}
        </p>
      </div>
    </div>
  );
}