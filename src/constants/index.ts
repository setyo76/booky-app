// ============================================================
// API BASE URL
// ============================================================
export const API_BASE_URL =
  "https://library-backend-production-b9cf.up.railway.app/api";

// ============================================================
// ROUTE PATHS
// ============================================================
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  BOOKS: "/books",
  BOOK_DETAIL: "/books/:id",
  MY_LOANS: "/my-loans",
  MY_PROFILE: "/profile",
  CART: "/cart",
  // Admin routes
  ADMIN: "/admin",
  ADMIN_BOOKS: "/admin/books",
  ADMIN_LOANS: "/admin/loans",
  ADMIN_USERS: "/admin/users",
} as const;

// ============================================================
// REACT QUERY KEYS
// ============================================================
export const QUERY_KEYS = {
  BOOKS: "books",
  BOOK_DETAIL: "book",
  BOOKS_RECOMMENDED: "books-recommended",
  CATEGORIES: "categories",
  AUTHORS: "authors",
  LOANS_MY: "loans-my",
  LOANS_ADMIN: "loans-admin",
  LOANS_OVERDUE: "loans-overdue",
  REVIEWS_BOOK: "reviews-book",
  REVIEWS_MY: "reviews-my",
  PROFILE: "profile",
  CART: "cart",
  ADMIN_BOOKS: "admin-books",
  ADMIN_USERS: "admin-users",
} as const;

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================
export const STORAGE_KEYS = {
  TOKEN: "booky_token",
  USER: "booky_user",
} as const;

// ============================================================
// PAGINATION DEFAULTS
// ============================================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  RECOMMENDED_LIMIT: 8,
  REVIEWS_LIMIT: 10,
} as const;

// ============================================================
// LOAN STATUS
// ============================================================
export const LOAN_STATUS = {
  BORROWED: "BORROWED",
  RETURNED: "RETURNED",
} as const;

// ============================================================
// USER ROLES
// ============================================================
export const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

// ============================================================
// TOAST MESSAGES
// ============================================================
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: "Selamat datang kembali! 👋",
  LOGIN_ERROR: "Email atau password salah.",
  REGISTER_SUCCESS: "Akun berhasil dibuat! Silakan login.",
  REGISTER_ERROR: "Gagal membuat akun. Coba lagi.",
  BORROW_SUCCESS: "Buku berhasil dipinjam! Selamat membaca 📚",
  BORROW_ERROR: "Gagal meminjam buku. Stok mungkin habis.",
  RETURN_SUCCESS: "Buku berhasil dikembalikan.",
  RETURN_ERROR: "Gagal mengembalikan buku.",
  REVIEW_SUCCESS: "Review berhasil ditambahkan! ⭐",
  REVIEW_ERROR: "Gagal menambahkan review.",
  REVIEW_DELETE_SUCCESS: "Review berhasil dihapus.",
  PROFILE_UPDATE_SUCCESS: "Profil berhasil diperbarui.",
  PROFILE_UPDATE_ERROR: "Gagal memperbarui profil.",
  CART_ADDED: "Buku ditambahkan ke keranjang.",
  CART_REMOVED: "Buku dihapus dari keranjang.",
  CART_CHECKOUT_SUCCESS: "Checkout berhasil! Semua buku dipinjam.",
  CART_CHECKOUT_ERROR: "Beberapa buku gagal dipinjam.",
  UNAUTHORIZED: "Sesi habis. Silakan login kembali.",
  NETWORK_ERROR: "Koneksi bermasalah. Periksa internet Anda.",
} as const;

// ============================================================
// RATING LABELS
// ============================================================
export const RATING_LABELS: Record<number, string> = {
  1: "Buruk",
  2: "Kurang",
  3: "Cukup",
  4: "Bagus",
  5: "Luar Biasa",
};

// ============================================================
// FILTER OPTIONS
// ============================================================
export const SORT_OPTIONS = [
  { label: "Rating Tertinggi", value: "rating" },
  { label: "Paling Populer", value: "popular" },
] as const;

export const MIN_RATING_OPTIONS = [
  { label: "Semua Rating", value: "" },
  { label: "⭐ 1+", value: "1" },
  { label: "⭐⭐ 2+", value: "2" },
  { label: "⭐⭐⭐ 3+", value: "3" },
  { label: "⭐⭐⭐⭐ 4+", value: "4" },
  { label: "⭐⭐⭐⭐⭐ 5", value: "5" },
] as const;
