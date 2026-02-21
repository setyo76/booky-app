import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import MainLayout from "@/components/layout/MainLayout";
import { Checkbox } from "@/components/shared/Checkbox";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/StateViews";
import { SkeletonBookGrid } from "@/components/shared/LoadingSpinner";

// ✅ Pakai server-side cart hooks, bukan Redux
import { useCart, useRemoveFromCart } from "@/hooks";

// Server cart item type
interface CartItemServer {
  id: number; // itemId (server)
  bookId: number;
  book?: {
    id: number;
    title: string;
    coverImage?: string;
    author?: { name: string };
    authorName?: string;
    category?: { id: number; name: string };
  };
}

function getCover(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://library-backend-production-b9cf.up.railway.app${url}`;
}

export default function CartPage() {
  const navigate = useNavigate();

  // ✅ Fetch cart dari server
  const { data, isLoading, isError, refetch } = useCart();
  const cartItems: CartItemServer[] = data?.data?.items ?? [];

  // Selected item IDs (server itemId, bukan bookId)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Sync selectedIds saat cartItems berubah (misal setelah fetch)
  useEffect(() => {
    setSelectedIds(new Set(cartItems.map((item) => item.id)));
  }, [cartItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const allSelected =
    cartItems.length > 0 && selectedIds.size === cartItems.length;
  const selectedCount = selectedIds.size;

  const { mutate: removeFromCart, isPending: isRemoving } = useRemoveFromCart();

  // ── Handlers ─────────────────────────────────────────────────
  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(cartItems.map((item) => item.id)));
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleRemove(itemId: number) {
    removeFromCart(itemId, {
      onSuccess: () => {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        // useRemoveFromCart hook sudah handle toast & invalidate query
      },
    });
  }

  function handleProceedToCheckout() {
    if (selectedCount === 0) {
      toast.error("Select at least 1 book to borrow.");
      return;
    }
    navigate("/checkout");
  }

  // ── Loading state ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <MainLayout showSearch>
        <div className="page-container py-10">
          <h1 className="text-2xl font-bold text-neutral-900 mb-8">My Cart</h1>
          <SkeletonBookGrid count={3} />
        </div>
      </MainLayout>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (isError) {
    return (
      <MainLayout showSearch>
        <div className="page-container py-10">
          <h1 className="text-2xl font-bold text-neutral-900 mb-8">My Cart</h1>
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <p className="text-sm text-neutral-500">Failed to load cart.</p>
            <Button variant="secondary" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Empty state ───────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <MainLayout showSearch>
        <div className="page-container py-10">
          <h1 className="text-2xl font-bold text-neutral-900 mb-8">My Cart</h1>
          <EmptyState
            title="Cart is empty"
            description="No books in cart yet. Let's add some books you want to borrow!"
          />
          <div className="flex justify-center mt-6">
            <Button onClick={() => navigate("/books")}>Find Books</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showSearch>
      <div className="page-container py-6 md:py-10">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">My Cart</h1>

        <div className="flex gap-8 items-start">

          {/* ── Left: book list ─────────────────────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Select All */}
            <div className="flex items-center gap-3 pb-4">
              <Checkbox
                checked={allSelected}
                indeterminate={selectedCount > 0 && !allSelected}
                onChange={toggleSelectAll}
                label="Select All"
              />
            </div>

            {/* Book items */}
            <div className="flex flex-col divide-y divide-neutral-100">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  checked={selectedIds.has(item.id)}
                  onToggle={() => toggleSelect(item.id)}
                  onRemove={() => handleRemove(item.id)}
                  isRemoving={isRemoving}
                />
              ))}
            </div>
          </div>

          {/* ── Right: Loan Summary sidebar (desktop only) ──────── */}
          <aside className="hidden md:flex flex-col gap-4 w-[280px] shrink-0 sticky top-28 border border-neutral-200 rounded-2xl p-5 bg-white">
            <h2 className="text-base font-bold text-neutral-900">
              Loan Summary
            </h2>

            <div className="flex items-center justify-between py-3 border-t border-neutral-100">
              <span className="text-sm font-medium text-neutral-500">
                Total Book
              </span>
              <span className="text-sm font-bold text-neutral-900">
                {selectedCount} Items
              </span>
            </div>

            <Button
              className="w-full"
              onClick={handleProceedToCheckout}
              disabled={selectedCount === 0}
            >
              Borrow Book
            </Button>
          </aside>
        </div>
      </div>

      {/* ── Mobile floating bar ──────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
        <div>
          <p className="text-xs font-medium text-neutral-500">Total Book</p>
          <p className="text-sm font-bold text-neutral-900">
            {selectedCount} Items
          </p>
        </div>
        <Button
          onClick={handleProceedToCheckout}
          disabled={selectedCount === 0}
          className="px-8 shrink-0"
        >
          Borrow Book
        </Button>
      </div>

      {/* Bottom padding so content doesn't hide behind mobile bar */}
      <div className="h-20 md:hidden" />
    </MainLayout>
  );
}

// ── CartItem ──────────────────────────────────────────────────
function CartItem({
  item,
  checked,
  onToggle,
  onRemove,
  isRemoving,
}: {
  item: CartItemServer;
  checked: boolean;
  onToggle: () => void;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  const book = item.book;

  return (
    <div className="flex items-center gap-3 py-4">
      {/* Checkbox */}
      <Checkbox checked={checked} onChange={onToggle} />

      {/* Cover */}
      <Link
        to={`/books/${item.bookId}`}
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
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {book?.category && (
          <Badge variant="default" className="w-fit text-[11px]">
            {book.category.name}
          </Badge>
        )}
        <Link to={`/books/${item.bookId}`}>
          <h3 className="text-sm font-bold text-neutral-900 hover:text-primary transition-colors line-clamp-2">
            {book?.title ?? "—"}
          </h3>
        </Link>
        <p className="text-xs font-medium text-neutral-400">
          {book?.author?.name ?? book?.authorName ?? "Unknown Author"}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="shrink-0 p-2 text-neutral-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-40"
        title="Remove from basket"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}