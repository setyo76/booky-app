import axiosClient from "./axiosClient";
import {
  LoansResponse,
  Loan,
  ApiResponse,
  BorrowBookRequest,
} from "../types";

// POST /api/loans — borrow a single book (user)
export async function borrowBook(
  data: BorrowBookRequest
): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.post<ApiResponse<{ loan: Loan }>>(
    "/loans",
    data
  );
  return response.data;
}

// POST /api/loans/from-cart — checkout dari cart (bulk borrow)
export async function borrowFromCart(data: {
  itemIds: number[];
  borrowDate: string;   // "YYYY-MM-DD"
  duration: 3 | 5 | 10;
}): Promise<ApiResponse<{ loans: Loan[] }>> {
  const response = await axiosClient.post<ApiResponse<{ loans: Loan[] }>>(
    "/loans/from-cart",
    data
  );
  return response.data;
}

// PATCH /api/loans/:id/return — return a book (borrower)
export async function returnBook(
  loanId: number
): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.patch<ApiResponse<{ loan: Loan }>>(
    `/loans/${loanId}/return`
  );
  return response.data;
}

// GET /api/loans/my — my loan history
export async function getMyLoans(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<LoansResponse> {
  const response = await axiosClient.get<LoansResponse>("/loans/my", {
    params,
  });
  return response.data;
}

// GET /api/admin/loans — all loans (admin)
export async function getAdminLoans(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<LoansResponse> {
  const response = await axiosClient.get<LoansResponse>("/admin/loans", {
    params,
  });
  return response.data;
}

// GET /api/admin/loans/overdue — overdue loans (admin)
export async function getOverdueLoans(): Promise<LoansResponse> {
  const response = await axiosClient.get<LoansResponse>(
    "/admin/loans/overdue"
  );
  return response.data;
}

// POST /api/admin/loans — create loan manually (admin)
export async function createAdminLoan(data: {
  userId: number;
  bookId: number;
  dueDate?: string;
}): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.post<ApiResponse<{ loan: Loan }>>(
    "/admin/loans",
    data
  );
  return response.data;
}

// PATCH /api/admin/loans/:id — update loan (admin)
export async function updateAdminLoan(
  loanId: number,
  data: Partial<Loan>
): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.patch<ApiResponse<{ loan: Loan }>>(
    `/admin/loans/${loanId}`,
    data
  );
  return response.data;
}