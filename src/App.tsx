import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { store } from "./store";
import { ROUTES } from "./constants";

// Auth & Protection
import ProtectedRoute from "./components/shared/ProtectedRoute"; // Pastikan path ini benar

// Pages
import LoginPage from "./pages/LoginPage/page";
import RegisterPage from "./pages/RegisterPage/page";
import HomePage from "./pages/HomePage/page";
import BookListPage from "./pages/BookListPage/page";
import BookDetailPage from "./pages/BookDetailPage/page";
import AuthorDetailPage from "./pages/AuthorDetailPage/page";
import MyLoansPage from "./pages/MyLoansPage/page";
import ProfilePage from "./pages/ProfilePage/page";
import CartPage from "./pages/CartPage/page";
import CheckoutPage from "@/pages/CheckoutPage/page";
import SuccessPage from "@/pages/SuccessPage/page";

// Admin Pages
import AdminOverviewPage from "@/pages/AdminPage/AdminOverviewPage";
import AdminBooksPage from "./pages/AdminPage/AdminBooksPage";
import AdminLoansPage from "./pages/AdminPage/AdminLoansPage";
import AdminUsersPage from "./pages/AdminPage/AdminUsersPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

function App() {
  return (
    <Routes>
      {/* --- PUBLIC & AUTH ROUTES --- */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.BOOKS} element={<HomePage />} />
      <Route path="/books/list" element={<BookListPage />} />
      <Route path={ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />
      <Route path="/authors/:id" element={<AuthorDetailPage />} />

      {/* --- PROTECTED USER ROUTES --- */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.MY_LOANS} element={<MyLoansPage />} />
        <Route path={ROUTES.MY_PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<SuccessPage />} />
      </Route>

      {/* --- PROTECTED ADMIN ROUTES --- */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/admin/overview" element={<AdminOverviewPage />} />
        <Route path={ROUTES.ADMIN_BOOKS} element={<AdminBooksPage />} />
        <Route path={ROUTES.ADMIN_LOANS} element={<AdminLoansPage />} />
        <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
      </Route>

      {/* --- REDIRECTS --- */}
      <Route path="/" element={<Navigate to={ROUTES.BOOKS} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.BOOKS} replace />} />
    </Routes>
  );
}

export default function Root() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </QueryClientProvider>
    </Provider>
  );
}
