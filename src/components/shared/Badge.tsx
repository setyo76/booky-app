import { cn } from "../../lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default:  "bg-neutral-100 text-neutral-700 border border-neutral-200",
    primary:  "bg-primary/10 text-primary border border-primary/20",
    success:  "bg-green-50 text-accent-green border border-green-200",
    danger:   "bg-red-50 text-accent-red border border-red-200",
    warning:  "bg-yellow-50 text-yellow-700 border border-yellow-200",
    neutral:  "bg-neutral-100 text-neutral-500 border border-neutral-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ── Loan status badge (convenience) ─────────────────────────
interface LoanStatusBadgeProps {
  status: string;
  dueDate?: string;
  className?: string;
}

export function LoanStatusBadge({ status, dueDate, className }: LoanStatusBadgeProps) {
  const isOverdue =
    status === "BORROWED" &&
    dueDate &&
    new Date() > new Date(dueDate);

  if (status === "RETURNED") {
    return <Badge variant="success" className={className}>Dikembalikan</Badge>;
  }
  if (isOverdue) {
    return <Badge variant="danger" className={className}>Terlambat</Badge>;
  }
  return <Badge variant="primary" className={className}>Dipinjam</Badge>;
}

// ── Availability badge ───────────────────────────────────────
interface AvailabilityBadgeProps {
  availableCopies: number;
  totalCopies?: number;
  className?: string;
}

export function AvailabilityBadge({
  availableCopies,
  totalCopies,
  className,
}: AvailabilityBadgeProps) {
  if (availableCopies === 0) {
    return <Badge variant="danger" className={className}>Tidak Tersedia</Badge>;
  }
  if (availableCopies <= 2) {
    return (
      <Badge variant="warning" className={className}>
        Tersisa {availableCopies}
        {totalCopies ? `/${totalCopies}` : ""}
      </Badge>
    );
  }
  return (
    <Badge variant="success" className={className}>
      Tersedia {availableCopies}
      {totalCopies ? `/${totalCopies}` : ""}
    </Badge>
  );
}