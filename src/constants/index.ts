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
  LOGIN_SUCCESS: "Welcome back! 👋",
  LOGIN_ERROR: "Invalid email or password.",
  REGISTER_SUCCESS: "Account created successfully! Please log in.",
  REGISTER_ERROR: "Failed to create account. Please try again.",
  BORROW_SUCCESS: "Book borrowed successfully! Happy reading 📚",
  BORROW_ERROR: "Failed to borrow book. Stock may be unavailable.",
  RETURN_SUCCESS: "Book returned successfully.",
  RETURN_ERROR: "Failed to return book.",
  REVIEW_SUCCESS: "Review submitted successfully! ⭐",
  REVIEW_ERROR: "Failed to submit review.",
  REVIEW_DELETE_SUCCESS: "Review deleted successfully.",
  PROFILE_UPDATE_SUCCESS: "Profile updated successfully.",
  PROFILE_UPDATE_ERROR: "Failed to update profile.",
  CART_ADDED: "Book added to cart.",
  CART_REMOVED: "Book removed from cart.",
  CART_CHECKOUT_SUCCESS: "Checkout successful! All books borrowed.",
  CART_CHECKOUT_ERROR: "Some books could not be borrowed.",
  UNAUTHORIZED: "Session expired. Please log in again.",
  NETWORK_ERROR: "Connection error. Please check your internet.",
} as const;

// ============================================================
// RATING LABELS
// ============================================================
export const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

// ============================================================
// FILTER OPTIONS
// ============================================================
export const SORT_OPTIONS = [
  { label: "Highest Rating", value: "rating" },
  { label: "Most Popular", value: "popular" },
] as const;

export const MIN_RATING_OPTIONS = [
  { label: "All Ratings", value: "" },
  { label: "⭐ 1+", value: "1" },
  { label: "⭐⭐ 2+", value: "2" },
  { label: "⭐⭐⭐ 3+", value: "3" },
  { label: "⭐⭐⭐⭐ 4+", value: "4" },
  { label: "⭐⭐⭐⭐⭐ 5", value: "5" },
] as const;
