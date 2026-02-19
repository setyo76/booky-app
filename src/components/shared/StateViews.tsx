import { BookOpen, SearchX, WifiOff, ShieldAlert } from "lucide-react";
import Button from "./Button";

// ── Empty state ──────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        {icon ?? <BookOpen className="w-8 h-8 text-neutral-400" />}
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm font-medium text-neutral-500 max-w-xs">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-5" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// ── No search results ────────────────────────────────────────
export function EmptySearch({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<SearchX className="w-8 h-8 text-neutral-400" />}
      title="Tidak ada hasil"
      description={
        query
          ? `Tidak ditemukan buku dengan kata kunci "${query}".`
          : "Tidak ada buku yang sesuai filter."
      }
    />
  );
}

// ── Error state ──────────────────────────────────────────────
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-accent-red" />
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-1">Gagal memuat data</h3>
      <p className="text-sm font-medium text-neutral-500 max-w-xs">
        {message ?? "Terjadi kesalahan. Periksa koneksi internet kamu."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" className="mt-5" size="sm">
          Coba Lagi
        </Button>
      )}
    </div>
  );
}

// ── Unauthorized ─────────────────────────────────────────────
export function UnauthorizedState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8 text-yellow-500" />
      </div>
      <h3 className="text-base font-bold text-neutral-900 mb-1">Akses Ditolak</h3>
      <p className="text-sm font-medium text-neutral-500 max-w-xs">
        Kamu tidak memiliki akses ke halaman ini.
      </p>
    </div>
  );
}