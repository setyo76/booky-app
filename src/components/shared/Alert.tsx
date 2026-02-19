import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface AlertProps {
  variant: "danger" | "success";
  label: string;
  onClose?: () => void;
  className?: string;
}

export default function Alert({ variant, label, onClose, className }: AlertProps) {
  const styles = {
    danger: "bg-accent-red text-white",
    success: "bg-accent-green text-white",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        "w-full h-10 rounded-lg px-3 py-2",
        styles[variant],
        className
      )}
      role="alert"
    >
      <span className="text-sm font-semibold flex-1">{label}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close alert"
          className="shrink-0 hover:opacity-75 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}