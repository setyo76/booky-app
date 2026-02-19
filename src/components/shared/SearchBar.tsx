import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search book",
  className,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        "relative flex items-center h-12 bg-neutral-50 border border-neutral-200 rounded-full px-4 gap-1.5 transition-all",
        "focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20",
        className
      )}
    >
      <Search className="w-5 h-5 text-neutral-400 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}