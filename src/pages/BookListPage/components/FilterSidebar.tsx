import { useSelector, useDispatch } from "react-redux";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/shared/Checkbox";
import { useCategories } from "@/hooks";
import {
  selectSelectedCategoryId,
  selectMinRating,
  setSelectedCategory,
  setMinRating,
} from "@/store/uiSlice";
import { Category } from "@/types";

interface FilterSidebarProps {
  className?: string;
}

const RATING_OPTIONS = [5, 4, 3, 2, 1];

export default function FilterSidebar({ className }: FilterSidebarProps) {
  const dispatch = useDispatch();
  const selectedCategoryId = useSelector(selectSelectedCategoryId);
  const minRating = useSelector(selectMinRating);

  const { data } = useCategories();
  const categories: Category[] = data?.data?.categories ?? [];

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
        <span className="text-sm font-bold text-neutral-700 tracking-wider uppercase">
          Filter
        </span>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-neutral-900">Category</h3>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <Checkbox
              key={cat.id}
              label={cat.name}
              checked={selectedCategoryId === cat.id}
              onChange={(checked) =>
                dispatch(setSelectedCategory(checked ? cat.id : null))
              }
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-200 my-6" />

      {/* Rating */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-neutral-900">Rating</h3>
        <div className="flex flex-col gap-3">
          {RATING_OPTIONS.map((rating) => (
            <Checkbox
              key={rating}
              checked={minRating === rating}
              onChange={(checked) =>
                dispatch(setMinRating(checked ? rating : null))
              }
              label=""
              className="items-center"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    viewBox="0 0 24 24"
                  >
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
                <span className="text-sm font-semibold text-neutral-700 ml-1">
                  {rating}
                </span>
              </div>
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  );
}