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
        <div className="h-full max-w-[1440px] mx-auto px-6 lg:px-12 xl:px-[120px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to={isAuthenticated ? ROUTES.BOOKS : ROUTES.LOGIN} className="flex items-center gap-2 shrink-0">
            <img src="/Logo.png" alt="Booky" className="h-8 w-8 object-contain" />
            <span className="text-[22px] font-bold text-neutral-900">Booky</span>
          </Link>

          {/* Search autocomplete — fleksibel sesuai sisa ruang */}
          {isAuthenticated && !isAdmin && showSearch && (
            <div className="flex-1 max-w-[491px] min-w-[180px]">
              <SearchAutocomplete placeholder="Search book" />
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">

            {/* Before login */}
            {!isAuthenticated && (
              <div className="flex items-center gap-3">
                <Link to={ROUTES.LOGIN} className="h-10 px-5 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center">
                  Login
                </Link>
                <Link to={ROUTES.REGISTER} className="h-10 px-5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center">
                  Register
                </Link>
              </div>
            )}

            {/* After login */}
            {isAuthenticated && (
              <>
                {/* Cart */}
                {!isAdmin && (
                  <Link to={ROUTES.CART} className="relative p-2 hover:bg-neutral-50 rounded-full transition-colors">
                    <ShoppingBag className="w-6 h-6 text-neutral-700" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 bg-accent-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen((v) => !v)} 
                    className="flex items-center gap-2 hover:bg-neutral-50 p-1.5 rounded-xl transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-neutral-500" />
                    </div>
                    {/* Truncate agar nama panjang tidak merusak layout saat layar kecil */}
                    <span className="text-sm font-semibold text-neutral-900 max-w-[80px] lg:max-w-[150px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-12 z-50 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 overflow-hidden">
                        <Link to={ROUTES.MY_PROFILE} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        {!isAdmin && (
                          <>
                            <Link to={ROUTES.MY_LOANS} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                              <BookOpen className="w-4 h-4" /> Borrowed List
                            </Link>
                            <Link to={ROUTES.MY_PROFILE + "?tab=reviews"} onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                              <Star className="w-4 h-4" /> Reviews
                            </Link>
                          </>
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
              className="shrink-0 p-1"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between h-14 px-4">
            <Link to={isAuthenticated ? ROUTES.BOOKS : ROUTES.LOGIN}>
              <img src="/Logo.png" alt="Booky" className="h-7 w-7 object-contain" />
            </Link>

            <div className="flex items-center gap-1">
              {isAuthenticated && !isAdmin && showSearch && (
                <button onClick={() => setMobileSearchOpen(true)} className="p-2">
                  <Search className="w-5 h-5 text-neutral-700" />
                </button>
              )}
              {isAuthenticated && !isAdmin && (
                <Link to={ROUTES.CART} className="relative p-2">
                  <ShoppingBag className="w-5 h-5 text-neutral-700" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-accent-red text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              <button 
                onClick={() => setMobileMenuOpen((v) => !v)} 
                className={`p-2 rounded-full ${isAuthenticated ? 'bg-neutral-100 ml-1' : ''}`}
              >
                {isAuthenticated ? (
                  <User className="w-5 h-5 text-neutral-500" />
                ) : (
                  <Menu className="w-6 h-6 text-neutral-700" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute top-14 left-0 right-0 z-50 bg-white border-b border-neutral-200 shadow-xl py-2 animate-in slide-in-from-top duration-200">
              {!isAuthenticated ? (
                <div className="flex flex-col">
                  <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-sm font-semibold text-neutral-900 active:bg-neutral-50">Login</Link>
                  <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)} className="px-4 py-4 text-sm font-semibold text-primary active:bg-neutral-50">Register</Link>
                </div>
              ) : (
                <>
                  <div className="px-4 py-3 bg-neutral-50/50 border-b border-neutral-100 mb-1">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Account</p>
                    <p className="text-sm font-bold text-neutral-900">{user?.name}</p>
                  </div>
                  <Link to={ROUTES.MY_PROFILE} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-neutral-700 active:bg-neutral-50">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  {!isAdmin && (
                    <>
                      <Link to={ROUTES.MY_LOANS} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-neutral-700 active:bg-neutral-50">
                        <BookOpen className="w-4 h-4" /> Borrowed List
                      </Link>
                      <Link to={ROUTES.MY_PROFILE + "?tab=reviews"} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-neutral-700 active:bg-neutral-50">
                        <Star className="w-4 h-4" /> Reviews
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link to={ROUTES.ADMIN} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-neutral-700 active:bg-neutral-50">
                      <BookOpen className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-neutral-100 my-1" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-accent-red active:bg-red-50 transition-colors">
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