import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../../lib/utils";

// ── FormField wrapper ────────────────────────────────────────
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-neutral-900">
        {label}
        {required && <span className="text-accent-red ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium text-accent-red">{error}</p>
      )}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, rightElement, className, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            "w-full h-11 px-4 rounded-xl border bg-white",
            "text-sm font-medium text-neutral-900",
            "placeholder:text-neutral-400",
            "outline-none transition-all duration-150",
            error
              ? "border-accent-red focus:border-accent-red focus:ring-2 focus:ring-accent-red/20"
              : "border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
            rightElement && "pr-11",
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ── Textarea ─────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white",
          "text-sm font-medium text-neutral-900",
          "placeholder:text-neutral-400 resize-none",
          "outline-none transition-all duration-150",
          error
            ? "border-accent-red focus:border-accent-red focus:ring-2 focus:ring-accent-red/20"
            : "border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// ── Select ───────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, options, placeholder, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full h-11 px-4 rounded-xl border bg-white",
          "text-sm font-medium text-neutral-900",
          "outline-none transition-all duration-150 cursor-pointer",
          error
            ? "border-accent-red focus:border-accent-red focus:ring-2 focus:ring-accent-red/20"
            : "border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";