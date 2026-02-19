import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Search, X, BookOpen, Star, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getBooks } from "@/api/booksApi";
import { setSearchQuery } from "@/store/uiSlice";
import { Book } from "@/types";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  onNavigate?: () => void; // callback setelah navigate (misal tutup mobile search)
}

// ── Debounce hook ─────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── Cover image helper ────────────────────────────────────────
function getCover(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://library-backend-production-b9cf.up.railway.app${url}`;
}

export default function SearchAutocomplete({
  placeholder = "Search book",
  className,
  inputClassName,
  onNavigate,
}: SearchAutocompleteProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(inputValue.trim(), 350);

  // ── Fetch suggestions ────────────────────────────────────────
  const { data, isFetching } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: () => getBooks({ q: debouncedQuery, limit: 6 }),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const suggestions: Book[] = data?.data?.books ?? [];

  // ── Open/close dropdown ──────────────────────────────────────
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsOpen(true);
      setActiveIndex(-1);
    } else {
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleClear() {
    setInputValue("");
    setIsOpen(false);
    dispatch(setSearchQuery(""));
    inputRef.current?.focus();
  }

  function handleSelectBook(book: Book) {
    setIsOpen(false);
    setInputValue("");
    dispatch(setSearchQuery(""));
    navigate(`/books/${book.id}`);
    onNavigate?.();
  }

  function handleSearchAll() {
    dispatch(setSearchQuery(inputValue.trim()));
    setIsOpen(false);
    navigate("/books/list");
    onNavigate?.();
  }

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === "Enter" && inputValue.trim()) {
        handleSearchAll();
      }
      return;
    }

    const totalItems = suggestions.length + 1; // +1 for "lihat semua"

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % totalItems);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + totalItems) % totalItems);
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelectBook(suggestions[activeIndex]);
        } else {
          handleSearchAll();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input */}
      <div className={cn(
        "flex items-center h-12 bg-neutral-50 border border-neutral-200 rounded-full px-4 gap-1.5 transition-all",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        isOpen && suggestions.length > 0 && "rounded-b-none rounded-t-2xl border-b-0 ring-2 ring-primary/20 border-primary",
        inputClassName
      )}>
        <Search className="w-5 h-5 text-neutral-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => debouncedQuery.length >= 2 && setIsOpen(true)}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-sm font-medium text-neutral-900 placeholder:text-neutral-400"
        />
        {isFetching && inputValue && (
          <Loader2 className="w-4 h-4 text-neutral-400 animate-spin shrink-0" />
        )}
        {inputValue && !isFetching && (
          <button onClick={handleClear} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white border border-primary border-t-0 rounded-b-2xl shadow-lg overflow-hidden">

          {/* Loading state */}
          {isFetching && suggestions.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              Mencari...
            </div>
          )}

          {/* No results */}
          {!isFetching && suggestions.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-400">
              <BookOpen className="w-4 h-4" />
              Buku tidak ditemukan
            </div>
          )}

          {/* Suggestion list */}
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((book, i) => (
                <li key={book.id}>
                  <button
                    onMouseDown={(e) => e.preventDefault()} // prevent input blur
                    onClick={() => handleSelectBook(book)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                      activeIndex === i
                        ? "bg-primary/5"
                        : "hover:bg-neutral-50"
                    )}
                  >
                    {/* Cover thumbnail */}
                    <div className="w-9 h-12 rounded-md bg-neutral-100 shrink-0 overflow-hidden">
                      {book.coverImage ? (
                        <img
                          src={getCover(book.coverImage)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-neutral-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {book.author?.name ?? book.authorName ?? "Unknown Author"}
                      </p>
                      {book.rating !== undefined && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-neutral-500 font-medium">
                            {book.rating.toFixed(1)}
                          </span>
                          {book.category && (
                            <span className="text-xs text-neutral-400">
                              · {book.category.name}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}

              {/* Divider + "Lihat semua hasil" */}
              <li className="border-t border-neutral-100">
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleSearchAll}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-primary transition-colors",
                    activeIndex === suggestions.length
                      ? "bg-primary/5"
                      : "hover:bg-primary/5"
                  )}
                >
                  <Search className="w-4 h-4" />
                  Lihat semua hasil untuk "{inputValue}"
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}