import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, ShieldCheck } from "lucide-react";

import AdminLayout from "./components/AdminLayout";
import AdminSearchBar from "./components/AdminSearchBar";
import Pagination from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/StateViews";
import { ConfirmDialog } from "@/components/shared/Modal";
import { getAdminUsers, deleteUser } from "@/api/adminApi";
import { useDebounce } from "@/hooks";
import { cn } from "@/lib/utils";

function formatDate(d?: string) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}

// Helper untuk mendapatkan inisial nama
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-users", debouncedSearch, page],
    queryFn: () => getAdminUsers({ q: debouncedSearch || undefined, page, limit: 15 }),
  });

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Gagal menghapus user.");
    },
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
          <p className="text-sm text-neutral-500 font-medium mt-0.5">
            {pagination?.total ?? 0} total pengguna terdaftar
          </p>
        </div>

        <AdminSearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Cari nama atau email..."
        />

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-neutral-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-6">
              <ErrorState onRetry={refetch} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider hidden md:table-cell">Role</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider hidden md:table-cell">Join Date</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider hidden md:table-cell">Stats</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-neutral-400 font-medium">
                        Tidak ada user ditemukan
                      </td>
                    </tr>
                  ) : (
                    users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* Avatar dengan Inisial */}
                            <div className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold",
                              user.role === "ADMIN" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"
                            )}>
                              {getInitials(user.name ?? "User")}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-900 truncate">{user.name}</p>
                              <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {user.role === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg uppercase tracking-tight">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-lg uppercase tracking-tight">
                              Member
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-neutral-600 font-medium italic">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-neutral-700">
                              {user._count?.loans ?? user.totalLoans ?? 0}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium uppercase">Loans</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => setDeleteId(user.id)}
                              className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all ml-auto block"
                              title="Hapus User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0 });
            }}
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && doDelete(deleteId)}
        title="Hapus user ini?"
        description="Peringatan: Menghapus user akan menghapus seluruh riwayat peminjaman mereka secara permanen."
        confirmLabel="Ya, Hapus User"
        variant="danger"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}