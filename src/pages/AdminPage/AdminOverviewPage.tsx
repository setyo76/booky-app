import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, ClipboardList, AlertTriangle, TrendingUp } from "lucide-react";
import AdminLayout from "./components/AdminLayout";
import { getAdminOverview } from "@/api/adminApi";
import { ErrorState } from "@/components/shared/StateViews";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}

function StatCard({ icon, label, value, sub, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-neutral-900 mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-neutral-400 font-medium mt-0.5 leading-none">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
  });

  const overview = data?.data ?? {};
  
  // Hitung angka maksimal untuk skala bar visual
  const maxLoans = overview.topBorrowedBooks?.[0]?.loanCount || 1;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-sm text-neutral-500 font-medium">Pantau statistik perpustakaan secara real-time</p>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Live Updates
            </span>
          </div>
        </div>

        {/* Stat cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<BookOpen className="w-5 h-5 text-primary" />}
              label="Total Books" color="bg-primary/10"
              value={overview.totalBooks ?? 0}
              sub="Koleksi tersedia"
            />
            <StatCard
              icon={<Users className="w-5 h-5 text-emerald-600" />}
              label="Active Members" color="bg-emerald-50"
              value={overview.totalUsers ?? 0}
              sub="User terdaftar"
            />
            <StatCard
              icon={<ClipboardList className="w-5 h-5 text-orange-500" />}
              label="Active Loans" color="bg-orange-50"
              value={overview.activeLoans ?? 0}
              sub="Buku sedang dipinjam"
            />
            <StatCard
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              label="Overdue" color="bg-red-50"
              value={overview.overdueLoans ?? 0}
              sub="Melewati tenggat"
            />
          </div>
        )}

        {/* Top borrowed books list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Top Borrowed Books</h2>
              <BookOpen className="w-4 h-4 text-neutral-400" />
            </div>
            
            <div className="p-2">
              {!isLoading && overview.topBorrowedBooks?.length > 0 ? (
                <div className="flex flex-col">
                  {overview.topBorrowedBooks.map((item: any, i: number) => {
                    const count = item.loanCount ?? item.totalLoans ?? 0;
                    const percentage = (count / maxLoans) * 100;
                    
                    return (
                      <div key={item.id ?? i} className="group hover:bg-neutral-50 p-4 rounded-xl transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-black text-neutral-200 group-hover:text-primary/30 transition-colors w-6 shrink-0 italic">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-end mb-1.5">
                              <p className="text-sm font-bold text-neutral-800 truncate pr-4">{item.title}</p>
                              <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-md">{count}x Pinjam</span>
                            </div>
                            {/* Visual Bar */}
                            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-1000" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-2">{item.author?.name ?? item.authorName}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-2">
                   <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-neutral-300" />
                   </div>
                   <p className="text-sm text-neutral-400 font-medium">Belum ada data peminjaman</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section / Info Tambahan */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col gap-4 self-start">
             <h3 className="font-bold text-primary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Quick Note
             </h3>
             <p className="text-xs text-primary/80 leading-relaxed font-medium">
                Daftar **Overdue** menunjukkan buku yang telah melewati batas 7 hari peminjaman. Segera hubungi user terkait untuk proses pengembalian atau denda.
             </p>
             <div className="mt-2 pt-4 border-t border-primary/10">
                <p className="text-[10px] text-primary/60 font-bold uppercase">Saran Admin</p>
                <p className="text-xs text-primary/80 mt-1 italic">"Update stok buku populer secara berkala untuk memenuhi permintaan user."</p>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}