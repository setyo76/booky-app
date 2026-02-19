import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id"; // Indonesian locale

dayjs.extend(relativeTime);
dayjs.locale("id");

// ============================================================
// Tailwind class merging (used by shadcn/ui)
// ============================================================
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// Date formatting with Day.js
// ============================================================
export function formatDate(date: string | Date, format = "DD MMM YYYY") {
  return dayjs(date).format(format);
}

export function formatDatetime(date: string | Date) {
  return dayjs(date).format("DD MMM YYYY, HH:mm");
}

export function fromNow(date: string | Date) {
  return dayjs(date).fromNow();
}

export function isOverdue(dueDate: string | Date) {
  return dayjs().isAfter(dayjs(dueDate));
}

export function daysUntilDue(dueDate: string | Date) {
  return dayjs(dueDate).diff(dayjs(), "day");
}

// ============================================================
// Loan status helpers
// ============================================================
export function getLoanStatusColor(
  status: string,
  dueDate?: string
): "success" | "warning" | "error" | "default" {
  if (status === "RETURNED") return "success";
  if (status === "BORROWED" && dueDate && isOverdue(dueDate)) return "error";
  if (status === "BORROWED" && dueDate && daysUntilDue(dueDate) <= 3)
    return "warning";
  return "default";
}

export function getLoanStatusLabel(status: string, dueDate?: string) {
  if (status === "RETURNED") return "Dikembalikan";
  if (status === "BORROWED" && dueDate && isOverdue(dueDate))
    return "Terlambat";
  return "Dipinjam";
}

// ============================================================
// Number & text helpers
// ============================================================
export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function formatNumber(num: number) {
  return new Intl.NumberFormat("id-ID").format(num);
}

// ============================================================
// Image helpers
// ============================================================
export function getBookCoverUrl(coverImage?: string) {
  if (!coverImage) return "/placeholder-book.png";
  if (coverImage.startsWith("http")) return coverImage;
  return `https://library-backend-production-b9cf.up.railway.app${coverImage}`;
}

// ============================================================
// Star rating helpers
// ============================================================
export function getRatingStars(rating: number): {
  full: number;
  half: boolean;
  empty: number;
} {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

// ============================================================
// Form validation helpers
// ============================================================
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string) {
  return /^[0-9]{8,20}$/.test(phone);
}