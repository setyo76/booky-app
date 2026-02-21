import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RotateCcw, AlertCircle, Calendar, User, Book as BookIcon } from "lucide-react";

import AdminLayout from "./components/AdminLayout";
import AdminSearchBar from "./components/AdminSearchBar";
import Pagination from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/StateViews";
import { ConfirmDialog } from "@/components/shared/Modal";
import { LoanStatusBadge } from "@/components/shared/Badge";
import { getAdminLoans, returnLoan } from "@/api/adminApi";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";

type StatusFilter = "ALL" | "BORROWED" | "RETURNED" | "overdue";
const STATUS_PILLS: { label: string; value: StatusFilter }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Aktif", value: "BORROWED" },
  { label: "Kembali", value: "RETURNED" },
  { label: "Terlambat", value: "OVERDUE" },
];

function formatDate(d?: string) {
  if (!d) return "-";
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("id-ID", { 
      day: "numeric", 
      month: "short", 
      year: "numeric" 
    });
  } catch {
    return d;
  }
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
      page,
      limit: 15,
    }),
  });

  // Safety first: cegah crash dengan optional chaining dan fallback
  const loans = data?.data?.loans ?? [];
  const pagination = data?.data?.pagination;

  const { mutate: doReturn, isPending: isReturning } = useMutation({
    mutationFn: returnLoan,
    onSuccess: () => {
      toast.success("Buku berhasil dikembalikan.");
      
      // ✅ SINKRONISASI DATA: Paksa semua data admin untuk refetch di background
      queryClient.invalidateQueries({ queryKey: ["admin-loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
      
      setReturnId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal mengembalikan buku.");
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Loans Management</h1>
            <p className="text-sm text-neutral-500 font-medium mt-0.5">
              {pagination?.total ?? 0} loan transaction discovered
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 bg-neutral-100 p-1.5 rounded-2xl w-fit">
            {STATUS_PILLS.map((pill) => (
              <button 
                key={pill.value} 
                onClick={() => { setStatus(pill.value); setPage(1); }}
                className={cn(
                  "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                  status === pill.value 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
                )}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        <AdminSearchBar 
          value={search} 
          onChange={(v) => { setSearch(v); setPage(1); }} 
          placeholder="Search user name or book title..." 
        />

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-6 flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 bg-neutral-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-10 text-center">
              <ErrorState onRetry={refetch} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="px-6 py-4 font-bold text-neutral-400 text-[10px] uppercase tracking-widest">User</th>
                    <th className="px-6 py-4 font-bold text-neutral-400 text-[10px] uppercase tracking-widest">Book Information</th>
                    <th className="px-6 py-4 font-bold text-neutral-400 text-[10px] uppercase tracking-widest hidden lg:table-cell">Timeline</th>
                    <th className="px-6 py-4 font-bold text-neutral-400 text-[10px] uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 font-bold text-neutral-400 text-[10px] uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-20">
                         <div className="flex flex-col items-center gap-2 text-neutral-400">
                            <AlertCircle className="w-8 h-8 opacity-20" />
                            <p className="font-medium">No matching loan data found</p>
                         </div>
                      </td>
                    </tr>
                  ) : (
                    loans.map((loan: any) => {
                      // Cek overdue dengan safety check tanggal
                      const isOverdue = loan.status === "BORROWED" && loan.dueDate && new Date(loan.dueDate) < new Date();
                      
                      return (
                        <tr key={loan.id} className={cn(
                          "group hover:bg-neutral-50/80 transition-colors",
                          isOverdue && "bg-red-50/30 hover:bg-red-50/50"
                        )}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                                  <User className="w-4 h-4" />
                               </div>
                               <div className="min-w-0">
                                  <p className="font-bold text-neutral-900 truncate">{loan?.user?.name ?? "Unknown User"}</p>
                                  <p className="text-[11px] text-neutral-400 truncate max-w-[150px]">{loan?.user?.email ?? "-"}</p>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                               <p className="font-bold text-neutral-800 line-clamp-1">{loan?.book?.title ?? "Untitled Book"}</p>
                               <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                  <BookIcon className="w-3 h-3" /> {loan?.book?.author?.name ?? "Unknown Author"}
                               </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <div className="flex flex-col gap-1 text-[11px]">
                                <div className="flex items-center gap-2 text-neutral-400 font-medium">
                                   <Calendar className="w-3 h-3" /> Pinjam: {formatDate(loan?.borrowDate)}
                                </div>
                                <div className={cn(
                                   "flex items-center gap-2 font-bold",
                                   isOverdue ? "text-red-500" : "text-neutral-600"
                                )}>
                                   <Calendar className="w-3 h-3" /> Kembali: {formatDate(loan?.dueDate)}
                                </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {isOverdue 
                                ? (
                                  <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                                    <AlertCircle className="w-3 h-3" /> Overdue
                                  </span>
                                )
                                : <LoanStatusBadge status={loan?.status} />
                            }
                          </td>
                          <td className="px-6 py-4 text-right">
                            {loan?.status === "BORROWED" && (
                              <button 
                                onClick={() => setReturnId(loan.id)} 
                                className="inline-flex items-center gap-2 text-[11px] font-black text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-all active:scale-95"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> RETURN
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
          <div className="mt-2">
            <Pagination 
              total={pagination?.total ?? 0} limit={pagination?.limit ?? 15}
              currentPage={page} 
              totalPages={pagination.totalPages} 
              onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            />
          </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!returnId} 
        onClose={() => setReturnId(null)} 
        onConfirm={() => returnId && doReturn(returnId)} 
        title="Return Confirmation" 
        description="Are you sure this book has been returned in good condition? The book stock will be automatically increased." 
        confirmLabel="Confirm Return" 
        isLoading={isReturning} 
      />
    </AdminLayout>
  );
}