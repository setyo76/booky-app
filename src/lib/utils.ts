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
  // 1. If there is no image, return the placeholder.
  if (!coverImage) return "/placeholder-book.png";
  
  // 2. If image is URL data (base64)
  if (coverImage.startsWith('data:image')) {
    return coverImage;
  }
  
  // 3. If image is a full URL (http:// or https://)
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    return coverImage;
  }
  
  // 4. If image is a relative path, build the full URL
  // Remove '/api' from the base URL as static files are usually served from the same server root.
  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://library-backend-production-b9cf.up.railway.app';
  
  //Make sure the path starts with a slash (/)
  const cleanPath = coverImage.startsWith('/') ? coverImage : `/${coverImage}`;
  
  return `${baseURL}${cleanPath}`;
}

// Optional: Version with debug for troubleshooting
export function getBookCoverUrlWithDebug(coverImage?: string) {
  console.log('🔍 getBookCoverUrl input:', coverImage);
  
  if (!coverImage) {
    console.log('❌ No cover image, using placeholder');
    return "/placeholder-book.png";
  }
  
  if (coverImage.startsWith('data:image')) {
    console.log('✅ Base64 image detected');
    return coverImage;
  }
  
  if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
    console.log('✅ Full URL detected');
    return coverImage;
  }
  
  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://library-backend-production-b9cf.up.railway.app';
  const cleanPath = coverImage.startsWith('/') ? coverImage : `/${coverImage}`;
  const fullUrl = `${baseURL}${cleanPath}`;
  
  console.log('✅ Constructed URL:', fullUrl);
  return fullUrl;
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