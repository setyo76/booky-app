import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "@/store/authSlice";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { BookOpen, Users, ClipboardList, LogOut, LayoutDashboard } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", path: "/admin/overview", icon: LayoutDashboard }, // Sekarang aman
  { label: "Books", path: "/admin/books", icon: BookOpen },
  { label: "Loans", path: "/admin/loans", icon: ClipboardList },
  { label: "Users", path: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector(selectUser);

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="w-[220px] shrink-0 bg-white border-r border-neutral-200 flex flex-col fixed top-0 bottom-0 z-30">
        <div className="flex items-center gap-2 px-5 h-16 border-b border-neutral-100">
          <img src="/Logo.png" alt="Booky" className="w-7 h-7 object-contain" />
          <span className="text-lg font-bold text-neutral-900">Booky</span>
          <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <Link key={path} to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                pathname.startsWith(path)
                  ? "bg-primary text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <Icon className="w-4 h-4" />{label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-neutral-100">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-neutral-400 font-medium">Logged in as</p>
            <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-[220px] min-h-screen">{children}</main>
    </div>
  );
}