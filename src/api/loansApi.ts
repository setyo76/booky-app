import axiosClient from "./axiosClient";
import {
  LoansResponse,
  Loan,
  ApiResponse,
  BorrowBookRequest,
} from "../types";

// POST /api/loans — borrow a book (user)
export async function borrowBook(
  data: BorrowBookRequest
): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.post<ApiResponse<{ loan: Loan }>>(
    "/loans",
    data
  );
  return response.data;
}

// PATCH /api/loans/:id/returns — return a book (borrower)
export async function returnBook(
  loanId: number
): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.patch<ApiResponse<{ loan: Loan }>>(
    `/loans/${loanId}/returns`
  );
  return response.data;
}

// GET /api/me/loans — my loan history
export async function getMyLoans(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<LoansResponse> {
  const response = await axiosClient.get<LoansResponse>("/me/loans", {
    params,
  });
  return response.data;
}

// GET /api/admin/loans — all loans (admin) with pagination + filter
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

// PATCH /api/loans/:id/confirm-borrow — confirm borrow (admin)
export async function confirmBorrow(
  loanId: number,
  data?: { actualCopies?: number; borrowDate?: string; dueDate?: string }
): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.patch<ApiResponse<{ loan: Loan }>>(
    `/loans/${loanId}/confirm-borrow`,
    data
  );
  return response.data;
}

// PUT /api/admin/loans/:id — update loan (admin)
export async function updateAdminLoan(
  loanId: number,
  data: Partial<Loan>
): Promise<ApiResponse<{ loan: Loan }>> {
  const response = await axiosClient.put<ApiResponse<{ loan: Loan }>>(
    `/admin/loans/${loanId}`,
    data
  );
  return response.data;
}