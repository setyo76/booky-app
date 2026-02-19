import { useRecommendedBooks } from "@/hooks";
import BookCard from "@/components/shared/BookCard";
import { SkeletonBookGrid } from "@/components/shared/LoadingSpinner";
import { Book } from "@/types";

interface RelatedBooksProps {
  categoryId?: number;
  currentBookId: number;
}

export default function RelatedBooks({ categoryId, currentBookId }: RelatedBooksProps) {
  const { data, isLoading } = useRecommendedBooks({
    categoryId,
    limit: 5,
  });

  const books = (data?.data?.books ?? []).filter(
    (b: Book) => b.id !== currentBookId
  ).slice(0, 5);

  if (!isLoading && books.length === 0) return null;

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-neutral-900">Related Books</h2>
      {isLoading ? (
        <SkeletonBookGrid count={5} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {books.map((book: Book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </section>
  );
}