import axiosClient from "./axiosClient";

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
  // 🔄 Penyesuaian Swagger: Endpoint update buku biasanya di /books/{id}
  // Jika di Swagger tertulis PATCH /api/books/{id}, maka hapus "/admin"
  const res = await axiosClient.patch(`/books/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteBook(id: number) {
  // ✅ Sudah benar sesuai Swagger: DELETE /books/{id}
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
  const res = await axiosClient.get("/admin/loans", { params });
  return res.data;
}

export async function getOverdueLoans(params?: {
  page?: number;
  limit?: number;
}) {
  const res = await axiosClient.get("/admin/loans/overdue", { params });
  return res.data;
}

export async function createLoan(data: { userId: number; bookId: number; dueDate?: string }) {
  const res = await axiosClient.post("/admin/loans", data);
  return res.data;
}

export async function updateLoan(loanId: number, data: { status?: string; dueAt?: string }) {
  // ✅ Sudah benar sesuai Swagger: PATCH /admin/loans/{id}
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

// ⚠️ Catatan: Pastikan endpoint DELETE /admin/users/{id} memang ada di backend 
// karena tidak terlihat eksplisit di potongan gambar Swagger Anda.
export async function deleteUser(id: number) {
  const res = await axiosClient.delete(`/admin/users/${id}`);
  return res.data;
}

// ── Authors (admin) ───────────────────────────────────────────
export async function createAuthor(data: { name: string; bio?: string }) {
  const res = await axiosClient.post("/authors", data);
  return res.data;
}

export async function updateAuthor(id: number, data: { name?: string; bio?: string }) {
  const res = await axiosClient.put(`/authors/${id}`, data);
  return res.data;
}

export async function deleteAuthor(id: number) {
  const res = await axiosClient.delete(`/authors/${id}`);
  return res.data;
}

// ── Categories (admin) ────────────────────────────────────────
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