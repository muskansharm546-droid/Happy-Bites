import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Clock,
  ShieldCheck,
  Compass,
  LogOut,
  Package,
  Layers,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cartItemCount,
    cartSubtotal,
    wishlist,
    user,
    logout,
    searchQuery,
    setSearchQuery,
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedProductId,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered live search suggestions
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSelectSearchProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigateTo('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-amber-100/70 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#2C1810] via-[#4A2810] to-[#2C1810] text-[#FEF3E2] px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
              HOT DEAL
            </span>
            <span>⚡ Free Express Delivery in 30 Mins on orders over ₹499!</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-amber-200/90">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Fresh & Authentic
            </span>
            <span className="text-amber-400 font-semibold cursor-pointer hover:underline" onClick={() => navigateTo('cart')}>
              Use Code: <span className="text-white bg-orange-600/60 px-1.5 py-0.5 rounded-sm">HAPPYBITES50</span>
            </span>
            <button
              onClick={() => navigateTo('track-order')}
              className="hover:text-white transition flex items-center gap-1 text-amber-100"
            >
              <Clock className="w-3.5 h-3.5" /> Track Order
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 md:gap-6">
          {/* Brand Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md shadow-orange-500/15 group-hover:scale-105 transition-transform bg-[#FFF8F0] shrink-0">
              <img
                src="/assets/aistudio/happy_bites_logo_6b2fcaa4.png"
                alt="Happy Bites Official Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-[#2C1810] font-heading">
                  Happy<span className="text-orange-600">Bites</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              </div>
              <p className="text-[10px] font-semibold text-amber-800/80 tracking-wide uppercase">
                Happiness in Every Bite!
              </p>
            </div>
          </div>

          {/* Quick Category dropdown trigger (Desktop) */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-[#2C1810] hover:text-orange-600 bg-amber-50/70 hover:bg-amber-100/70 rounded-xl transition border border-amber-200/60"
            >
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  categoryDropdownOpen ? 'rotate-180 text-orange-600' : 'text-stone-500'
                }`}
              />
            </button>

            {categoryDropdownOpen && (
              <div
                onMouseLeave={() => setCategoryDropdownOpen(false)}
                className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-amber-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 pb-2 mb-1 border-b border-stone-100 text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Browse by Snacks & Treats
                </div>
                <div className="max-h-[380px] overflow-y-auto px-1 space-y-0.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        navigateTo('shop');
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:text-orange-600 hover:bg-orange-50/80 transition flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></span>
                        {cat.name}
                      </span>
                      {cat.badge && (
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md font-semibold">
                          {cat.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-xl mx-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search chocolates, chips, namkeen, cold drinks, cakes..."
                className="w-full pl-11 pr-10 py-2.5 bg-stone-50/90 hover:bg-white focus:bg-white text-stone-800 placeholder-stone-400 rounded-full text-sm border border-stone-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 outline-hidden transition shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Autocomplete suggestions */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider flex justify-between">
                  <span>Product Suggestions</span>
                  <span className="text-orange-600 cursor-pointer" onClick={handleSearchSubmit}>
                    View all matching &rarr;
                  </span>
                </div>
                <div className="divide-y divide-stone-100">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSearchProduct(item.id)}
                      className="p-2 hover:bg-orange-50/70 rounded-xl cursor-pointer flex items-center gap-3 transition"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-11 h-11 object-cover rounded-lg border border-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.categoryName} • {item.weight}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#2C1810]">₹{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="block text-[11px] text-stone-400 line-through">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Icons: Wishlist, Cart, Account */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Wishlist */}
            <button
              onClick={() => navigateTo('wishlist')}
              className="relative p-2.5 rounded-full hover:bg-orange-50 text-stone-700 hover:text-orange-600 transition group"
              title="My Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart with pill button */}
            <button
              onClick={() => navigateTo('cart')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-sm transition shadow-sm ${
                cartItemCount > 0
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-orange-500/25'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-orange-600 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {cartItemCount > 0 ? `₹${cartSubtotal}` : 'Cart'}
              </span>
            </button>

            {/* Account / User Menu Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border border-stone-200 hover:border-orange-300 hover:bg-orange-50/50 transition text-stone-700"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs uppercase border border-amber-200">
                  {user ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
                </div>
                <span className="text-xs font-semibold hidden md:inline max-w-[90px] truncate">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden md:inline" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {user ? (
                    <>
                      <div className="px-4 py-3 bg-amber-50/70 border-b border-amber-100 mx-2 rounded-xl mb-1">
                        <p className="text-xs text-stone-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                            Admin Account
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          navigateTo('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-orange-600 flex items-center gap-2.5"
                      >
                        <UserIcon className="w-4 h-4 text-stone-400" />
                        My Profile & Addresses
                      </button>

                      <button
                        onClick={() => {
                          navigateTo('my-orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-orange-600 flex items-center gap-2.5"
                      >
                        <Package className="w-4 h-4 text-stone-400" />
                        My Orders
                      </button>

                      <button
                        onClick={() => {
                          navigateTo('track-order');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-orange-600 flex items-center gap-2.5"
                      >
                        <MapPin className="w-4 h-4 text-stone-400" />
                        Live Order Tracking
                      </button>

                      {/* Admin Dashboard Quick Access */}
                      <div className="my-1 border-t border-stone-100 pt-1">
                        <button
                          onClick={() => {
                            navigateTo('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-900 bg-amber-50/80 hover:bg-amber-100 flex items-center gap-2.5 transition"
                        >
                          <Compass className="w-4 h-4 text-orange-600" />
                          <span>Admin Store Dashboard</span>
                        </button>
                      </div>

                      <div className="border-t border-stone-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </>
                  ) : (
                    <div className="p-3">
                      <p className="text-xs text-stone-500 mb-2 font-medium">
                        Welcome to Happy Bites!
                      </p>
                      <button
                        onClick={() => {
                          navigateTo('login');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-bold transition shadow-xs mb-1.5"
                      >
                        Sign In / Register
                      </button>
                      <button
                        onClick={() => {
                          navigateTo('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full py-1.5 text-xs text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl font-medium transition"
                      >
                        Open Admin Dashboard
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category / Nav Ribbon (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-2 border-t border-stone-100 text-xs font-semibold text-stone-600 no-scrollbar">
          <button
            onClick={() => navigateTo('home')}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
              currentPage === 'home'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'hover:bg-amber-50 hover:text-orange-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setSelectedCategoryId(null);
              navigateTo('shop');
            }}
            className={`px-3 py-1.5 rounded-full transition whitespace-nowrap ${
              currentPage === 'shop' && !selectedCategoryId
                ? 'bg-orange-600 text-white shadow-xs'
                : 'hover:bg-amber-50 hover:text-orange-600'
            }`}
          >
            Shop All Snacks
          </button>

          {/* Quick Category Chips */}
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                navigateTo('shop');
              }}
              className={`px-3 py-1.5 rounded-full transition whitespace-nowrap flex items-center gap-1 ${
                currentPage === 'shop' && cat.id === selectedCategoryId
                  ? 'bg-[#2C1810] text-amber-200 shadow-xs'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => navigateTo('categories')}
            className="ml-auto px-3 py-1.5 rounded-full text-orange-600 hover:bg-orange-50 font-bold whitespace-nowrap"
          >
            All 12 Categories &rarr;
          </button>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            <button
              onClick={() => {
                navigateTo('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Home
            </button>
            <button
              onClick={() => {
                setSelectedCategoryId(null);
                navigateTo('shop');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Shop All Snacks
            </button>
            <button
              onClick={() => {
                navigateTo('categories');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Browse 12 Categories
            </button>
            <button
              onClick={() => {
                navigateTo('track-order');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-stone-800 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-between"
            >
              <span>Track Active Order</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Live
              </span>
            </button>
            <button
              onClick={() => {
                navigateTo('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100"
            >
              Admin Dashboard
            </button>
          </div>

          <div className="border-t border-stone-100 pt-3">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Popular Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {categories.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategoryId(c.id);
                    navigateTo('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left p-2 rounded-lg bg-stone-50 hover:bg-orange-50 hover:text-orange-600 text-stone-700 truncate"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
