import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import AdminLayout from "./components/AdminLayout";
import AdminSearchBar from "./components/AdminSearchBar";
import Button from "@/components/shared/Button";
import Pagination from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/StateViews";
import Modal from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/Modal";
import { FormField, Input, Textarea } from "@/components/shared/FormField";
import { getAdminBooks, createBook, updateBook, deleteBook } from "@/api/adminApi";
import { useCategories, useAuthors } from "@/hooks";
import { Book } from "@/types";
import { useDebounce } from "@/hooks";

function getCover(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://library-backend-production-b9cf.up.railway.app${url}`;
}

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-books", debouncedSearch, page],
    queryFn: () => getAdminBooks({ q: debouncedSearch || undefined, page, limit: 10 }),
  });

  const books: Book[] = data?.data?.books ?? [];
  const pagination = data?.data?.pagination;

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      toast.success("Buku berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["admin-books"] });
      setDeleteId(null);
    },
    onError: () => toast.error("Gagal menghapus buku."),
  });

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Books</h1>
            <p className="text-sm text-neutral-500 font-medium mt-0.5">
              {pagination?.total ?? 0} total buku
            </p>
          </div>
          <Button onClick={() => { setEditBook(null); setModalOpen(true); }} leftIcon={<Plus className="w-4 h-4" />}>
            Add Book
          </Button>
        </div>

        <AdminSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by title or author..." />

        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-neutral-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-6"><ErrorState onRetry={refetch} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase">Book</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase hidden md:table-cell">Stock</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase hidden md:table-cell">Rating</th>
                    <th className="px-4 py-3 font-semibold text-neutral-500 text-xs uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {books.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-neutral-400">Tidak ada buku ditemukan</td></tr>
                  ) : (
                    books.map((book) => (
                      <tr key={book.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                              {book.coverImage
                                ? <img src={getCover(book.coverImage)} alt={book.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-neutral-300" /></div>
                              }
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-900 truncate max-w-[200px]">{book.title}</p>
                              <p className="text-xs text-neutral-400 font-medium">{book.author?.name ?? book.authorName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 px-2 py-1 rounded-lg">
                            {book.category?.name ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs font-bold ${(book.stock ?? 0) <= 2 ? "text-red-500" : "text-neutral-700"}`}>
                            {book.stock ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell font-medium">⭐ {book.rating?.toFixed(1) ?? "0.0"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={() => { setEditBook(book); setModalOpen(true); }} className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-lg"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteId(book.id)} className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={page} totalPages={pagination.totalPages} total={pagination.total} limit={pagination.limit} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />
        )}
      </div>

      <BookFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editBook={editBook} onSuccess={() => { queryClient.invalidateQueries({ queryKey: ["admin-books"] }); setModalOpen(false); }} />

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && doDelete(deleteId)} title="Hapus buku ini?" description="Tindakan ini tidak dapat dibatalkan." confirmLabel="Hapus" variant="danger" isLoading={isDeleting} />
    </AdminLayout>
  );
}

function BookFormModal({ isOpen, onClose, editBook, onSuccess }: { isOpen: boolean; onClose: () => void; editBook: Book | null; onSuccess: () => void; }) {
  const { data: catData } = useCategories();
  const { data: authData } = useAuthors();
  const categories = catData?.data?.categories ?? [];
  const authors = authData?.data?.authors ?? [];

  const [form, setForm] = useState({
    title: "", description: "", authorId: "", categoryId: "", isbn: "", publishedYear: "", totalPages: "", stock: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // ✅ FIX: Gunakan useEffect untuk reset/sync form
  useEffect(() => {
    if (isOpen) {
      if (editBook) {
        setForm({
          title: editBook.title ?? "",
          description: editBook.description ?? "",
          authorId: String(editBook.authorId ?? editBook.author?.id ?? ""),
          categoryId: String(editBook.categoryId ?? editBook.category?.id ?? ""),
          isbn: editBook.isbn ?? "",
          publishedYear: String(editBook.publishedYear ?? ""),
          totalPages: String(editBook.totalPages ?? ""),
          stock: String(editBook.stock ?? ""),
        });
      } else {
        setForm({ title: "", description: "", authorId: "", categoryId: "", isbn: "", publishedYear: "", totalPages: "", stock: "" });
        setCoverFile(null);
      }
    }
  }, [editBook, isOpen]);

  const { mutate: save, isPending } = useMutation({
    mutationFn: (fd: FormData) => editBook ? updateBook(editBook.id, fd) : createBook(fd),
    onSuccess: () => {
      toast.success(editBook ? "Buku berhasil diperbarui" : "Buku berhasil ditambahkan");
      onSuccess();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Gagal menyimpan buku"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { 
        if (v !== "" && v !== "undefined") fd.append(k, v); 
    });
    // ✅ Gunakan 'coverImage' jika backend mengharapkan field tersebut
    if (coverFile) fd.append("coverImage", coverFile);
    save(fd);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editBook ? "Edit Book" : "Add Book"} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2">
        <FormField label="Title" required>
          <Input name="title" value={form.title} onChange={(e) => setForm(p => ({...p, title: e.target.value}))} placeholder="Judul buku" required />
        </FormField>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Author" required>
            <select name="authorId" value={form.authorId} onChange={(e) => setForm(p => ({...p, authorId: e.target.value}))} className="w-full h-11 border border-neutral-200 rounded-xl px-3 text-sm font-medium bg-white focus:ring-2 focus:ring-primary/20 outline-none" required>
              <option value="">Pilih author</option>
              {authors.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </FormField>
          <FormField label="Category" required>
            <select name="categoryId" value={form.categoryId} onChange={(e) => setForm(p => ({...p, categoryId: e.target.value}))} className="w-full h-11 border border-neutral-200 rounded-xl px-3 text-sm font-medium bg-white focus:ring-2 focus:ring-primary/20 outline-none" required>
              <option value="">Pilih kategori</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea name="description" value={form.description} onChange={(e) => setForm(p => ({...p, description: e.target.value}))} placeholder="Deskripsi buku..." rows={3} />
        </FormField>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FormField label="ISBN"><Input name="isbn" value={form.isbn} onChange={(e) => setForm(p => ({...p, isbn: e.target.value}))} /></FormField>
          <FormField label="Year"><Input type="number" name="publishedYear" value={form.publishedYear} onChange={(e) => setForm(p => ({...p, publishedYear: e.target.value}))} /></FormField>
          <FormField label="Pages"><Input type="number" name="totalPages" value={form.totalPages} onChange={(e) => setForm(p => ({...p, totalPages: e.target.value}))} /></FormField>
          <FormField label="Stock"><Input type="number" name="stock" value={form.stock} onChange={(e) => setForm(p => ({...p, stock: e.target.value}))} /></FormField>
        </div>

        <FormField label="Cover Image">
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-bold cursor-pointer" />
        </FormField>

        <div className="flex gap-3 pt-4 border-t mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Batal</Button>
          <Button type="submit" className="flex-1" isLoading={isPending}>{editBook ? "Simpan Perubahan" : "Tambah Buku"}</Button>
        </div>
      </form>
    </Modal>
  );
}