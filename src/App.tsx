import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { store } from "./store";
import LoginPage from "./pages/LoginPage/page";
import RegisterPage from "./pages/RegisterPage/page";
import HomePage from "./pages/HomePage/page";
import BookListPage from "./pages/BookListPage/page";
import BookDetailPage from "./pages/BookDetailPage/page";
import AuthorDetailPage from "./pages/AuthorDetailPage/page";
import MyLoansPage from "./pages/MyLoansPage/page";
import ProfilePage from "./pages/ProfilePage/page";
import { ROUTES } from "./constants";
import CartPage from "./pages/CartPage/page";
import CheckoutPage from "@/pages/CheckoutPage/page";
import SuccessPage from "@/pages/SuccessPage/page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Main */}
      <Route path={ROUTES.BOOKS} element={<HomePage />} />
      <Route path="/books/list" element={<BookListPage />} />
      <Route path={ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />
      <Route path="/authors/:id" element={<AuthorDetailPage />} />

      {/* User */}
      <Route path={ROUTES.MY_LOANS} element={<MyLoansPage />} />
      <Route path={ROUTES.MY_PROFILE} element={<ProfilePage />} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to={ROUTES.BOOKS} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.BOOKS} replace />} />
      <Route path={ROUTES.CART} element={<CartPage />} />

      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<SuccessPage />} />

      
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
