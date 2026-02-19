import { ReactNode } from "react";
import { Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Checkbox ─────────────────────────────────────────────────
interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label?: string;
  children?: ReactNode;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  children,
  onChange,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Box */}
      <div
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange?.(!checked)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            !disabled && onChange?.(!checked);
          }
        }}
        className={cn(
          "w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-colors",
          checked || indeterminate
            ? "bg-primary border-primary"
            : "bg-white border-neutral-300 hover:border-primary/60"
        )}
      >
        {indeterminate ? (
          <Minus className="w-3 h-3 text-white" strokeWidth={3} />
        ) : checked ? (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </div>

      {/* Label — children takes priority over label string */}
      {children ?? (label ? (
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      ) : null)}
    </label>
  );
}

// ── Radio ─────────────────────────────────────────────────────
interface RadioProps {
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: () => void;
  className?: string;
}

export function Radio({
  checked = false,
  disabled = false,
  label,
  onChange,
  className,
}: RadioProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div
        role="radio"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && onChange?.()}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            !disabled && onChange?.();
          }
        }}
        className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
          checked
            ? "border-primary"
            : "border-neutral-300 hover:border-primary/60"
        )}
      >
        {checked && (
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        )}
      </div>
      {label && (
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      )}
    </label>
  );
}

export default Checkbox;