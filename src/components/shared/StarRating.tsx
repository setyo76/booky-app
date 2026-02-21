import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

// ── Display only (read mode) ─────────────────────────────────
interface StarRatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function StarRatingDisplay({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: StarRatingDisplayProps) {
  // ✅ Fallback ke 0 jika rating undefined/null
  const safeRating = rating ?? 0;

  const sizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.floor(safeRating);
          const partial = !filled && i < safeRating;

          return (
            <div key={i} className="relative">
              {/* Empty star */}
              <Star className={cn(sizes[size], "text-neutral-300")} />
              {/* Filled star overlay */}
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: partial ? `${(safeRating % 1) * 100}%` : "100%" }}
                >
                  <Star
                    className={cn(sizes[size], "text-accent-yellow fill-accent-yellow")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <span className={cn("font-semibold text-neutral-900", textSizes[size])}>
        {safeRating.toFixed(1)}
      </span>

      {showCount && reviewCount !== undefined && (
        <span className={cn("text-neutral-400 font-medium", textSizes[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

// ── Interactive (input mode) ─────────────────────────────────
interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRatingInput({
  value,
  onChange,
  size = "lg",
  className,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const active = hovered || value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= active;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 active:scale-95"
            aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizes[size],
                "transition-colors",
                isFilled
                  ? "text-accent-yellow fill-accent-yellow"
                  : "text-neutral-300 hover:text-accent-yellow"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}