import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks";
import { setSelectedCategory } from "@/store/uiSlice";
import { selectSelectedCategoryId } from "@/store/uiSlice";

// Category emoji map (fallback jika tidak ada icon dari API)
const CATEGORY_EMOJI: Record<string, string> = {
  "fiction":          "✏️",
  "non-fiction":      "📘",
  "self-improvement": "🌱",
  "finance":          "💰",
  "science":          "🔬",
  "education":        "📚",
  "technology":       "💻",
  "history":          "🏛️",
  "biography":        "👤",
  "mystery":          "🔍",
  "romance":          "❤️",
  "default":          "📖",
};

function getCategoryEmoji(name: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "-");
  return CATEGORY_EMOJI[key] ?? CATEGORY_EMOJI["default"];
}

export default function CategoryFilter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedId = useSelector(selectSelectedCategoryId);
  const { data, isLoading } = useCategories();

  const categories = data?.data?.categories ?? [];

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 md:flex md:flex-row gap-3 md:overflow-x-auto md:pb-1 md:scrollbar-thin">
      {categories.map((cat: import("@/types").Category) => {
        const isActive = selectedId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => {
              dispatch(setSelectedCategory(isActive ? null : cat.id));
              navigate("/books/list");
            }}
            className={`
              flex flex-col items-center justify-center gap-2
              rounded-xl p-3 md:p-4
              min-w-[80px] md:min-w-[100px]
              border transition-all duration-150
              ${isActive
                ? "bg-primary/10 border-primary"
                : "bg-neutral-50 border-neutral-200 hover:border-primary/40 hover:bg-primary/5"
              }
            `}
          >
            {/* Icon */}
            <div className={`
              w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl
              ${isActive ? "bg-primary/10" : "bg-white shadow-sm"}
            `}>
              {getCategoryEmoji(cat.name)}
            </div>
            {/* Label */}
            <span className={`
              text-xs font-semibold text-center leading-tight line-clamp-2
              ${isActive ? "text-primary" : "text-neutral-700"}
            `}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}