import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Profile", path: "/profile" },
  { label: "Borrowed List", path: "/my-loans" },
  { label: "Reviews", path: "/my-reviews" },
] as const;

export default function ProfileTabs() {
  const { pathname } = useLocation();

  return (
    <div className="flex border border-neutral-200 rounded-xl overflow-hidden w-fit">
      {TABS.map((tab, i) => {
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "px-6 md:px-10 py-3 text-sm font-semibold transition-colors whitespace-nowrap",
              isActive
                ? "bg-white text-neutral-900 shadow-sm"
                : "bg-neutral-50 text-neutral-400 hover:text-neutral-700",
              i !== 0 && "border-l border-neutral-200"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}