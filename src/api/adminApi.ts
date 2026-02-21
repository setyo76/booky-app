import axiosClient from "./axiosClient";

// ── Status mapping: Redux format → API format ─────────────────
// API menerima: all | active | returned | overdue
// AdminLoansPage menggunakan: ALL | BORROWED | RETURNED | overdue
const STATUS_MAP: Record<string, string> = {
  ALL: "all",
  BORROWED: "active",
  RETURNED: "returned",
  overdue: "overdue",
};

// ── Admin Overview ────────────────────────────────────────────
export async function getAdminOverview() {
  const res = await axiosClient.get("/admin/overview");
  return res.data;
}

// ── Admin Books ───────────────────────────────────────────────
export async function getAdminBooks(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const res = await axiosClient.get("/admin/books", { params });
  return res.data;
}

export async function createBook(data: FormData) {
  const res = await axiosClient.post("/admin/books", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateBook(id: number, data: FormData) {
  const res = await axiosClient.patch(`/books/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteBook(id: number) {
  const res = await axiosClient.delete(`/books/${id}`);
  return res.data;
}

// ── Admin Loans ───────────────────────────────────────────────
export async function getAdminLoans(params?: {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const mappedStatus = params?.status
    ? (STATUS_MAP[params.status] ?? params.status.toLowerCase())
    : "all";

  const formattedParams = {
    q: params?.q,
    status: mappedStatus,
    page: params?.page ?? 1,
    limit: params?.limit ?? 15,
  };

  const res = await axiosClient.get("/admin/loans", { params: formattedParams });
  return res.data;
}

export async function getOverdueLoans(params?: {
  page?: number;
  limit?: number;
}) {
  const res = await axiosClient.get("/admin/loans/overdue", { params });
  return res.data;
}

export async function createLoan(data: {
  userId: number;
  bookId: number;
  dueDate?: string;
}) {
  const res = await axiosClient.post("/admin/loans", data);
  return res.data;
}

export async function updateLoan(
  loanId: number,
  data: { status?: string; dueAt?: string }
) {
  const res = await axiosClient.patch(`/admin/loans/${loanId}`, data);
  return res.data;
}

export async function returnLoan(loanId: number) {
  return updateLoan(loanId, { status: "RETURNED" });
}

// ── Admin Users ───────────────────────────────────────────────
export async function getAdminUsers(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const res = await axiosClient.get("/admin/users", { params });
  return res.data;
}

export async function deleteUser(id: number) {
  const res = await axiosClient.delete(`/admin/users/${id}`);
  return res.data;
}

// ── Authors & Categories (admin) ─────────────────────────────
export async function createAuthor(data: { name: string; bio?: string }) {
  const res = await axiosClient.post("/authors", data);
  return res.data;
}

export async function updateAuthor(
  id: number,
  data: { name?: string; bio?: string }
) {
  const res = await axiosClient.put(`/authors/${id}`, data);
  return res.data;
}

export async function deleteAuthor(id: number) {
  const res = await axiosClient.delete(`/authors/${id}`);
  return res.data;
}

export async function createCategory(data: { name: string }) {
  const res = await axiosClient.post("/categories", data);
  return res.data;
}

export async function updateCategory(id: number, data: { name: string }) {
  const res = await axiosClient.put(`/categories/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await axiosClient.delete(`/categories/${id}`);
  return res.data;
}