import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ChevronDown, ShoppingBag, LogOut, User,
  BookOpen, Search, Menu, X, Star
} from "lucide-react";

import { selectIsAuthenticated, selectUser, selectIsAdmin, logout } from "../../store/authSlice";
import { setSearchQuery } from "../../store/uiSlice";
import { ROUTES } from "../../constants";
import SearchAutocomplete from "../shared/SearchAutocomplete";
import { useCart } from "../../hooks";

interface NavbarProps {
  showSearch?: boolean;
}

export default function Navbar({ showSearch = true }: NavbarProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  // ✅ Ambil jumlah cart dari server, bukan Redux
  const { data: cartData } = useCart();
  const cartCount = cartData?.data?.items?.length ?? 0;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate(ROUTES.LOGIN);
  }

  return (
    <>
      {/* ── DESKTOP (md+) ─────────────────────────────────────── */}
      <header className="w-full h-20 bg-white border-b border-neutral-200 sticky top-0 z-50 hidden md:block">
        <div className="h-full px-[120px] flex items-center justify-between">

          {/* Logo */}
          <Link to={isAuthenticated ? ROUTES.BOOKS : ROUTES.LOGIN} className="flex items-center gap-2 shrink-0">
            <img src="/Logo.png" alt="Booky" className="h-8 w-8 object-contain" />
            <span className="text-[22px] font-bold text-neutral-900">Booky</span>
          </Link>

          {/* Search autocomplete — user only */}
          {isAuthenticated && !isAdmin && showSearch && (
            <div className="flex-1 max-w-[491px] mx-8">
              <SearchAutocomplete placeholder="Search book" />
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-4 shrink-0">

            {/* Before login */}
            {!isAuthenticated && (
              <>
                <Link to={ROUTES.LOGIN} className="h-10 px-5 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center">
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className="h-10 px-5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center">
                  Register
                </Link>
              </>
            )}

            {/* After login */}
            {isAuthenticated && (
              <>
                {/* Cart */}
                {!isAdmin && (
                  <Link to={ROUTES.CART} className="relative">
                    <ShoppingBag className="w-6 h-6 text-neutral-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-accent-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative">
                  <button onClick={() => setDropdownOpen((v) => !v)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-500" />
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">{user?.name}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-12 z-50 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1">
                        <Link to={ROUTES.MY_PROFILE} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        {!isAdmin && (
                          <Link to={ROUTES.MY_LOANS} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                            <BookOpen className="w-4 h-4" /> Borrowed List
                          </Link>
                        )}
                        {!isAdmin && (
                          <Link to={ROUTES.MY_PROFILE + "?tab=reviews"} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                            <Star className="w-4 h-4" /> Reviews
                          </Link>
                        )}
                        {isAdmin && (
                          <Link to={ROUTES.ADMIN} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                            <BookOpen className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="my-1 border-t border-neutral-100" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-accent-red hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE (<md) ──────────────────────────────────────── */}
      <header className="w-full bg-white border-b border-neutral-200 sticky top-0 z-50 md:hidden">

        {/* Mobile search expanded */}
        {mobileSearchOpen ? (
          <div className="flex items-center h-14 px-4 gap-3">
            <div className="flex-1">
              <SearchAutocomplete
                placeholder="Search book"
                onNavigate={() => setMobileSearchOpen(false)}
                inputClassName="h-10 rounded-full text-sm"
              />
            </div>
            <button
              onClick={() => {
                setMobileSearchOpen(false);
                dispatch(setSearchQuery(""));
              }}
              className="shrink-0"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between h-14 px-4">
            {/* Logo icon only */}
            <Link to={isAuthenticated ? ROUTES.BOOKS : ROUTES.LOGIN}>
              <img src="/Logo.png" alt="Booky" className="h-7 w-7 object-contain" />
            </Link>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              {isAuthenticated && !isAdmin && showSearch && (
                <button onClick={() => setMobileSearchOpen(true)}>
                  <Search className="w-5 h-5 text-neutral-700" />
                </button>
              )}
              {isAuthenticated && !isAdmin && (
                <Link to={ROUTES.CART} className="relative">
                  <ShoppingBag className="w-5 h-5 text-neutral-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-accent-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              {isAuthenticated ? (
                <button onClick={() => setMobileMenuOpen((v) => !v)} className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-neutral-500" />
                </button>
              ) : (
                <button onClick={() => setMobileMenuOpen((v) => !v)}>
                  <Menu className="w-5 h-5 text-neutral-700" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute top-14 left-0 right-0 z-50 bg-white border-b border-neutral-200 shadow-md py-2">
              {!isAuthenticated ? (
                <>
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)} className="flex px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50">Login</Link>
                  <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)} className="flex px-4 py-3 text-sm font-semibold text-primary hover:bg-neutral-50">Register</Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-xs text-neutral-400 font-medium">Logged in as</p>
                    <p className="text-sm font-semibold text-neutral-900">{user?.name}</p>
                  </div>
                  <Link to={ROUTES.MY_PROFILE} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  {!isAdmin && (
                    <Link to={ROUTES.MY_LOANS} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      <BookOpen className="w-4 h-4" /> Borrowed List
                    </Link>
                  )}
                  {!isAdmin && (
                    <Link to={ROUTES.MY_PROFILE + "?tab=reviews"} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      <Star className="w-4 h-4" /> Reviews
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to={ROUTES.ADMIN} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                      <BookOpen className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-neutral-100 mt-1" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-accent-red hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </header>
    </>
  );
}