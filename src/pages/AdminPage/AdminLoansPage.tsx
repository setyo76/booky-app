import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw, AlertCircle } from "lucide-react";

import AdminLayout from "./components/AdminLayout";
import AdminSearchBar from "./components/AdminSearchBar";
import Pagination from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/StateViews";
import { ConfirmDialog } from "@/components/shared/Modal";
import { LoanStatusBadge } from "@/components/shared/Badge";
import { getAdminLoans, returnLoan } from "@/api/adminApi";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";

type StatusFilter = "ALL" | "BORROWED" | "RETURNED";
const STATUS_PILLS: { label: string; value: StatusFilter }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Aktif", value: "BORROWED" },
  { label: "Kembali", value: "RETURNED" },
];

function formatDate(d?: string) {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return d; }
}

export default function AdminLoansPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const [returnId, setReturnId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-loans", debouncedSearch, status, page],
    queryFn: () => getAdminLoans({
      q: debouncedSearch || undefined,
      status: status === "ALL" ? undefined : status,
      page, limit: 15,
    }),
  });

  const loans = data?.data?.loans ?? [];
  const pagination = data?.data?.pagination;

  const { mutate: doReturn, isPending: isReturning } = useMutation({
    mutationFn: returnLoan,
    onSuccess: () => {
      toast.success("Buku berhasil dikembalikan.");
      queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
      setReturnId(null);
    },
    onError: () => toast.error("Gagal mengembalikan buku."),
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Loans</h1>
            <p className="text-sm text-neutral-500 font-medium mt-0.5">{pagination?.total ?? 0} total transaksi</p>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-neutral-100 p-1 rounded-2xl">
            {STATUS_PILLS.map((pill) => (
              <button key={pill.value} onClick={() => { setStatus(pill.value); setPage(1); }}
                className={cn("px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                  status === pill.value ? "bg-white text-primary shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                )}>
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        <AdminSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Cari nama user atau judul buku..." />

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-neutral-100 rounded-xl animate-pulse" />)}
            </div>
          ) : isError ? (
            <div className="p-6"><ErrorState onRetry={refetch} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase">User</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase">Book</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase hidden md:table-cell">Dates</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase">Status</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {loans.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-neutral-400">Tidak ada data peminjaman</td></tr>
                  ) : (
                    loans.map((loan: any) => {
                      const isOverdue = loan.status === "BORROWED" && new Date(loan.dueDate) < new Date();
                      return (
                        <tr key={loan.id} className={cn(
                          "hover:bg-neutral-50 transition-colors",
                          isOverdue && "bg-red-50/40" // ✅ Highlight baris yang telat
                        )}>
                          <td className="px-4 py-3">
                            <p className="font-bold text-neutral-900">{loan.user?.name ?? "-"}</p>
                            <p className="text-xs text-neutral-400 truncate max-w-[120px]">{loan.user?.email}</p>
                          </td>
                          <td className="px-4 py-3 min-w-[150px]">
                            <p className="font-semibold text-neutral-900 line-clamp-1">{loan.book?.title}</p>
                            <p className="text-xs text-neutral-400">{loan.book?.author?.name}</p>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <div className="text-[11px] font-medium">
                                <span className="text-neutral-400 block">Borrowed: {formatDate(loan.borrowDate)}</span>
                                <span className={cn("block", isOverdue ? "text-red-500 font-bold" : "text-neutral-600")}>
                                    Due: {formatDate(loan.dueDate)}
                                </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {isOverdue 
                                ? <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-lg text-[10px] font-bold uppercase w-fit"><AlertCircle className="w-3 h-3" /> Overdue</div>
                                : <LoanStatusBadge status={loan.status} />
                            }
                          </td>
                          <td className="px-4 py-3 text-right">
                            {loan.status === "BORROWED" && (
                              <button onClick={() => setReturnId(loan.id)} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-xl transition-all">
                                <RotateCcw className="w-3 h-3" />Return
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />
        )}
      </div>

      <ConfirmDialog isOpen={!!returnId} onClose={() => setReturnId(null)} onConfirm={() => returnId && doReturn(returnId)} title="Konfirmasi Pengembalian" description="Tandai buku ini telah diterima kembali oleh perpustakaan?" confirmLabel="Konfirmasi" isLoading={isReturning} />
    </AdminLayout>
  );
}