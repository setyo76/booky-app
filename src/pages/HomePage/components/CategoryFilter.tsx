import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useCategories } from "@/hooks";
import { setSelectedCategory, selectSelectedCategoryId } from "@/store/uiSlice";
import { Category } from "@/types";

const CATEGORY_EMOJI: Record<string, string> = {
  "fiction": "✏️",
  "non-fiction": "📋",
  "self-improvement": "🌱",
  "finance": "💰",
  "science": "🔬",
  "science-fiction": "🔭",
  "science-&-technology": "🔬",
  "education": "📚",
  "technology": "💻",
  "default": "📖",
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = data?.data?.categories ?? [];

  // ── Logika Auto-Scroll Otomatis ──────────────────────────────
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || categories.length === 0) return;

    let scrollAmount = 0;
    const step = 1; // Kecepatan scroll (pixel per frame)
    
    const scrollInterval = setInterval(() => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
        // Reset ke awal jika sudah di ujung
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        scrollAmount = 0;
      } else {
        scrollContainer.scrollLeft += step;
        scrollAmount += step;
      }
    }, 30); // Kehalusan gerakan (ms)

    // Berhenti scroll saat user menyentuh/hover agar tidak mengganggu interaksi
    scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollInterval));
    
    return () => {
      clearInterval(scrollInterval);
      scrollContainer.removeEventListener('mouseenter', () => clearInterval(scrollInterval));
    };
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden pb-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-[110px] h-[120px] rounded-2xl bg-neutral-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="flex gap-4 overflow-x-auto pb-4 no-scrollbar" 
      style={{ 
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none',   /* Firefox */
      }}
    >
      {/* Tambahkan CSS global atau inline untuk Chrome/Safari Hide Scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {categories.map((cat) => {
        const isActive = selectedId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => {
              dispatch(setSelectedCategory(isActive ? null : cat.id));
              navigate("/books/list");
            }}
            className={`
              shrink-0 flex flex-col items-center
              p-3 gap-3 rounded-[16px] w-[110px] md:w-[125px]
              border transition-all duration-200 shadow-sm
              ${isActive
                ? "bg-white border-primary ring-1 ring-primary"
                : "bg-white border-neutral-100 hover:border-primary/30 hover:shadow-md"
              }
            `}
          >
            <div
              className="w-full aspect-[16/9] rounded-xl flex items-center justify-center text-2xl shadow-inner"
              style={{ backgroundColor: "#E0ECFF" }}
            >
              <span className="filter drop-shadow-sm">
                {getCategoryEmoji(cat.name)}
              </span>
            </div>

            <span className={`
              text-[12px] font-bold text-center leading-tight line-clamp-1 w-full
              ${isActive ? "text-primary" : "text-[#171717]"}
            `}>
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}