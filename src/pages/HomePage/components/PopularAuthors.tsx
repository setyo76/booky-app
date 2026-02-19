import { User, BookOpen } from "lucide-react";
import { usePopularAuthors } from "@/hooks";
import { Link } from "react-router-dom";


export default function PopularAuthors() {
  const { data, isLoading } = usePopularAuthors();
  const authors = data?.data?.authors ?? [];

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-neutral-900">Popular Authors</h2>
        <div className="flex flex-col md:flex-row gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-neutral-200 shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="h-3.5 w-24 bg-neutral-200 rounded-full" />
                <div className="h-3 w-16 bg-neutral-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!authors.length) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-neutral-900">Popular Authors</h2>

      <div className="flex flex-col md:flex-row md:flex-wrap gap-3">
        {authors.map((author: import("@/types").Author) => (
          <Link
              to={`/authors/${author.id}`}
              key={author.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
            >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden">
              <User className="w-6 h-6 text-neutral-400" />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold text-neutral-900">{author.name}</p>
              <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                <BookOpen className="w-3.5 h-3.5" />
                <span>5 books</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}