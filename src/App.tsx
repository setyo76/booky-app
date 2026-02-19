import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { store } from "./store";
import LoginPage from "./pages/LoginPage/page";
import RegisterPage from "./pages/RegisterPage/page";
import HomePage from "./pages/HomePage/page";
import BookDetailPage from "./pages/BookDetailPage/page";
import { ROUTES } from "./constants";
import BookListPage from "./pages/BookListPage/page";
import AuthorDetailPage from "./pages/AuthorDetailPage/page";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Main routes */}
        <Route path={ROUTES.BOOKS} element={<HomePage />} />
        <Route path={ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />

        {/* Redirect root ke /books */}
        <Route path="/" element={<Navigate to={ROUTES.BOOKS} replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.BOOKS} replace />} />

        <Route path="/books/list" element={<BookListPage />} />

        <Route path="/authors/:id" element={<AuthorDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function Root() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </QueryClientProvider>
    </Provider>
  );
}
