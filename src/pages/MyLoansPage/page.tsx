import { useState } from "react";
import { Search, X } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import LoanCard from "./components/LoanCard";
import Button from "@/components/shared/Button";
import { EmptyState, ErrorState } from "@/components/shared/StateViews";

import { useMyLoans } from "@/hooks";
import { Loan } from "@/types";
import { cn } from "@/lib/utils";
import ProfileTabs from "@/pages/ProfilePage/components/ProfileTabs";



// ── Status filter pills ───────────────────────────────────────
type StatusFilter = "ALL" | "BORROWED" | "RETURNED" | "OVERDUE";

const STATUS_PILLS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "BORROWED" },
  { label: "Returned", value: "RETURNED" },
  { label: "Overdue", value: "OVERDUE" },
];

export default function MyLoansPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [localSearch, setLocalSearch] = useState("");
  const [page, setPage] = useState(1);
  const [allLoans, setAllLoans] = useState<Loan[]>([]);

  const { data, isLoading, isError, refetch, isFetching } = useMyLoans({
    page,
    limit: 10,
  });

  const fetchedLoans: Loan[] = data?.data?.loans ?? [];
  const pagination = data?.data?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  // Combine pages for load more
  const combinedLoans = page === 1 ? fetchedLoans : [...allLoans, ...fetchedLoans];

  // Client-side filter by status & search
  const filteredLoans = combinedLoans.filter((loan) => {
    const isOverdue =
      loan.status === "BORROWED" && new Date(loan.dueDate) < new Date();

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "OVERDUE" && isOverdue) ||
      (statusFilter === "BORROWED" && loan.status === "BORROWED" && !isOverdue) ||
      (statusFilter === "RETURNED" && loan.status === "RETURNED");

    const matchesSearch =
      !localSearch ||
      loan.book?.title?.toLowerCase().includes(localSearch.toLowerCase()) ||
      (loan.book?.author?.name ?? "")
        .toLowerCase()
        .includes(localSearch.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  function handleLoadMore() {
    setAllLoans(combinedLoans);
    setPage((p) => p + 1);
  }

  return (
    <MainLayout showSearch={false}>
      <div className="page-container py-6 md:py-10 flex flex-col gap-6">

        {/* ── Tab navigation ── */}
          <ProfileTabs />

        {/* ── Page heading ── */}
        <h1 className="text-2xl font-bold text-neutral-900">Borrowed List</h1>

        {/* ── Local search ── */}
        <div className="flex items-center h-11 bg-white border border-neutral-200 rounded-full px-4 gap-2 max-w-lg focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="Search book"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Status filter pills ── */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={cn(
                "h-9 px-4 rounded-full text-sm font-semibold border transition-all",
                statusFilter === pill.value
                  ? "bg-white border-primary text-primary ring-1 ring-primary"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* ── Loan list ── */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        )}

        {isError && <ErrorState onRetry={refetch} />}

        {!isLoading && !isError && filteredLoans.length === 0 && (
          <EmptyState
            title="Belum ada peminjaman"
            description={
              statusFilter === "ALL"
                ? "Kamu belum meminjam buku apapun. Yuk mulai baca!"
                : `Tidak ada buku dengan status ${statusFilter.toLowerCase()}.`
            }
          />
        )}

        {!isLoading && !isError && filteredLoans.length > 0 && (
          <div className="flex flex-col gap-4">
            {filteredLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="secondary"
                  onClick={handleLoadMore}
                  isLoading={isFetching && page > 1}
                  className="px-10"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </MainLayout>
  );
}