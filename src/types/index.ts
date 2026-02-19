// ============================================================
// AUTH TYPES
// ============================================================
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string | null;
  role: "ADMIN" | "USER";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ============================================================
// AUTHOR TYPES — harus sebelum Book
// ============================================================
export interface Author {
  id: number;
  name: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAuthorRequest {
  name: string;
  bio?: string;
}

// ============================================================
// CATEGORY TYPES — harus sebelum Book
// ============================================================
export interface Category {
  id: number;
  name: string;
}

// ============================================================
// REVIEW TYPES — harus sebelum Book
// ============================================================
export interface Review {
  id: number;
  userId: number;
  bookId: number;
  rating: number;
  comment?: string;
  book?: Pick<Book, "id" | "title" | "coverImage">;
  user?: {
    id: number;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// BOOK TYPES — setelah Author, Category, Review
// ============================================================
export interface Book {
  id: number;
  title: string;
  isbn?: string;
  description?: string;
  publishedYear?: number;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  totalCopies?: number;
  availableCopies?: number;
  borrowCount?: number;
  author?: Author;
  authorName?: string;
  category?: Category;
  reviews?: Review[];
}

export interface BooksQueryParams {
  q?: string;
  categoryId?: number;
  authorId?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface RecommendedBooksParams {
  by?: "rating" | "popular";
  categoryId?: number;
  page?: number;
  limit?: number;
}

export interface BooksResponse {
  success: boolean;
  message: string;
  data: {
    books: Book[];
    pagination: Pagination;
  };
}

export interface BookDetailResponse {
  success: boolean;
  message: string;
  data: Book;
}

export interface CreateBookRequest {
  title: string;
  isbn: string;
  categoryId: number;
  authorId?: number;
  authorName?: string;
  coverImage?: File;
  description?: string;
  publishedYear?: number;
  totalCopies?: number;
  availableCopies?: number;
}

export interface UpdateBookRequest {
  title?: string;
  description?: string;
  isbn?: string;
  publishedYear?: number;
  coverImage?: string;
  authorId?: number;
  authorName?: string;
  categoryId?: number;
  totalCopies?: number;
  availableCopies?: number;
}

// ============================================================
// LOAN TYPES
// ============================================================
export type LoanStatus = "BORROWED" | "RETURNED";

export interface Loan {
  id: number;
  bookId: number;
  userId?: number;
  book?: Book;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
}

export interface LoansResponse {
  success: boolean;
  message: string;
  data: {
    loans: Loan[];
    pagination?: Pagination;
  };
}

export interface BorrowBookRequest {
  bookId: number;
}

// ============================================================
// REVIEW RESPONSE TYPES
// ============================================================
export interface CreateReviewRequest {
  bookId: number;
  rating: number;
  comment?: string;
}

export interface ReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: Review[];
    pagination?: Pagination;
  };
}

// ============================================================
// CART TYPES
// ============================================================
export interface CartItem {
  bookId: number;
  book?: Book;
}

export interface Cart {
  items: CartItem[];
}

// ============================================================
// USER / PROFILE TYPES
// ============================================================
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  role: "ADMIN" | "USER";
  stats?: {
    totalBorrowed: number;
    currentlyBorrowed: number;
    returned: number;
    overdue?: number;
  };
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  bio?: string;
}

// ============================================================
// COMMON / UTILITY TYPES
// ============================================================
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
}