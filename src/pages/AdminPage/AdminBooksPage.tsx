import { useState, useEffect } from "react";
import { Plus, BookOpen, Eye } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import AdminSearchBar from "./components/AdminSearchBar";
import Button from "@/components/shared/Button";
import Pagination from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/StateViews";
import Modal from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/Modal";
import { FormField, Input, Textarea } from "@/components/shared/FormField";
import { getAdminBooks, createBook, updateBook, deleteBook } from "@/api/adminApi";
import { useCategories, useAuthors, useDebounce } from "@/hooks";
import { Book } from "@/types";
import { cn } from "@/lib/utils";

function getCover(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://library-backend-production-b9cf.up.railway.app${url}`;
}

// ── Status filter pills (sesuai prototype) ───────────────────
type BookFilter = "All" | "Available" | "Borrowed" | "Returned";

const FILTER_PILLS: { label: string; value: BookFilter }[] = [
  { label: "All", value: "All" },
  { label: "Available", value: "Available" },
  { label: "Borrowed", value: "Borrowed" },
  { label: "Returned", value: "Returned" },
];

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BookFilter>("All");
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

  // Client-side filter by availability
  const filteredBooks = books.filter((book) => {
    if (filter === "All") return true;
    if (filter === "Available") return (book.availableCopies ?? 0) > 0;
    if (filter === "Borrowed") return (book.availableCopies ?? 0) === 0;
    return true;
  });

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

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">Book List</h1>
          <Button
            onClick={() => { setEditBook(null); setModalOpen(true); }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Book
          </Button>
        </div>

        {/* Search */}
        <AdminSearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search book"
        />

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setFilter(pill.value)}
              className={cn(
                "h-9 px-5 rounded-full text-sm font-semibold border transition-all",
                filter === pill.value
                  ? "bg-white border-primary text-primary ring-1 ring-primary"
                  : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400"
              )}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Book list — card style sesuai prototype */}
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-28 bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 text-sm font-medium">
            Tidak ada buku ditemukan
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                {/* Cover */}
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                  {book.coverImage ? (
                    <img
                      src={getCover(book.coverImage)}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-neutral-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {book.category && (
                    <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md w-fit">
                      {book.category.name}
                    </span>
                  )}
                  <p className="font-bold text-neutral-900 truncate">{book.title}</p>
                  <p className="text-sm text-neutral-400 font-medium">
                    {book.author?.name ?? book.authorName ?? "Unknown Author"}
                  </p>
                  {book.rating !== undefined && (
                    <p className="text-sm font-semibold text-neutral-600">
                      ⭐ {book.rating.toFixed(1)}
                    </p>
                  )}
                </div>

                {/* Action buttons — sesuai prototype */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/books/${book.id}`}>
                    <button className="h-9 px-4 rounded-full border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-neutral-400 transition-all whitespace-nowrap flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                  </Link>
                  <button
                    onClick={() => { setEditBook(book); setModalOpen(true); }}
                    className="h-9 px-4 rounded-full border border-neutral-200 text-sm font-semibold text-neutral-700 hover:border-neutral-400 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(book.id)}
                    className="h-9 px-4 rounded-full border border-red-200 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }}
          />
        )}
      </div>

      {/* Book form modal */}
      <BookFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editBook={editBook}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["admin-books"] });
          setModalOpen(false);
        }}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && doDelete(deleteId)}
        title="Delete Data?"
        description="Once deleted, you won't be able to recover this data."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}

// ── Book Form Modal ───────────────────────────────────────────
function BookFormModal({
  isOpen, onClose, editBook, onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  editBook: Book | null;
  onSuccess: () => void;
}) {
  const { data: catData } = useCategories();
  const { data: authData } = useAuthors();
  const categories = catData?.data?.categories ?? [];
  const authors = authData?.data?.authors ?? [];

  const [form, setForm] = useState({
    title: "", description: "", authorId: "", categoryId: "",
    isbn: "", publishedYear: "", totalPages: "", stock: "",
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

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
          stock: String(editBook.availableCopies ?? ""),
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
      toast.success(editBook ? "Book successfully updated" : "Book successfully added");
      onSuccess();
    },
    onError: (err: { response?: { data?: { message?: string } } }) =>
      toast.error(err.response?.data?.message || "Failed to save book"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "" && v !== "undefined") fd.append(k, v);
    });
    if (coverFile) fd.append("coverImage", coverFile);
    save(fd);
  }

  const selectClass = "w-full h-11 border border-neutral-200 rounded-xl px-3 text-sm font-medium bg-white focus:ring-2 focus:ring-primary/20 outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editBook ? "Edit Book" : "Add Book"} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2">
        <FormField label="Title" required>
          <Input name="title" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Judul buku" required />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Author" required>
            <select name="authorId" value={form.authorId} onChange={(e) => setForm(p => ({ ...p, authorId: e.target.value }))} className={selectClass} required>
              <option value="">Pilih author</option>
              {authors.map((a: { id: number; name: string }) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </FormField>
          <FormField label="Category" required>
            <select name="categoryId" value={form.categoryId} onChange={(e) => setForm(p => ({ ...p, categoryId: e.target.value }))} className={selectClass} required>
              <option value="">Pilih kategori</option>
              {categories.map((c: { id: number; name: string }) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea name="description" value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Deskripsi buku..." rows={3} />
        </FormField>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <FormField label="ISBN"><Input name="isbn" value={form.isbn} onChange={(e) => setForm(p => ({ ...p, isbn: e.target.value }))} /></FormField>
          <FormField label="Year"><Input type="number" name="publishedYear" value={form.publishedYear} onChange={(e) => setForm(p => ({ ...p, publishedYear: e.target.value }))} /></FormField>
          <FormField label="Pages"><Input type="number" name="totalPages" value={form.totalPages} onChange={(e) => setForm(p => ({ ...p, totalPages: e.target.value }))} /></FormField>
          <FormField label="Stock"><Input type="number" name="stock" value={form.stock} onChange={(e) => setForm(p => ({ ...p, stock: e.target.value }))} /></FormField>
        </div>

        <FormField label="Cover Image">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            className="text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-bold cursor-pointer"
          />
        </FormField>

        <div className="flex gap-3 pt-4 border-t mt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" className="flex-1" isLoading={isPending}>{editBook ? "Save Changes" : "Add Book"}</Button>
        </div>
      </form>
    </Modal>
  );
}