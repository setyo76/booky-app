import { cn } from "../../lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  return (
    <div
      className={cn(
        "rounded-full border-neutral-200 border-t-primary animate-spin",
        sizes[size],
        className
      )}
    />
  );
}

// ── Full page loading overlay ────────────────────────────────
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}

// ── Skeleton loader for cards ────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-[3/4] rounded-xl bg-neutral-200" />
      <div className="flex flex-col gap-2 px-1">
        <div className="h-4 bg-neutral-200 rounded-full w-3/4" />
        <div className="h-3 bg-neutral-200 rounded-full w-1/2" />
        <div className="h-3 bg-neutral-200 rounded-full w-1/3" />
      </div>
    </div>
  );
}

// ── Skeleton for book list ───────────────────────────────────
export function SkeletonBookGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ── Inline loading text ──────────────────────────────────────
export function LoadingText({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  );
}