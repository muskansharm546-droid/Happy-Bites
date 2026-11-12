import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

export const ShopPage: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
  } = useApp();

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategoryId || 'all');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyVeg, setOnlyVeg] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Sync external selectedCategoryId if changed
  React.useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
        // Price filter
        if (p.price > priceRange) return false;
        // Discount filter
        if (onlyDiscounted && p.discountPercent <= 0) return false;
        // In stock
        if (onlyInStock && !p.inStock) return false;
        // Veg only
        if (onlyVeg && !p.isVeg) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        // Featured
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    priceRange,
    onlyDiscounted,
    onlyInStock,
    onlyVeg,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCategoryId(null);
    setSearchQuery('');
    setPriceRange(1000);
    setOnlyDiscounted(false);
    setOnlyInStock(false);
    setOnlyVeg(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading">
            {selectedCategory === 'all'
              ? 'All Delicious Snacks & Bites'
              : categories.find((c) => c.id === selectedCategory)?.name || 'Snacks'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Showing <span className="font-bold text-orange-600">{filteredProducts.length}</span> delicious snacks available for instant delivery
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-600" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-semibold text-stone-800 bg-transparent outline-hidden cursor-pointer"
            >
              <option value="featured">Featured & Bestsellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated (★)</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:block ${
            isMobileFiltersOpen
              ? 'fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto flex items-center justify-center'
              : 'hidden'
          }`}
        >
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-6 w-full max-w-sm lg:max-w-none">
            {/* Header for Filter panel */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-[#2C1810]">
                <Filter className="w-4 h-4 text-orange-600" />
                <span>Filters & Refinements</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs text-orange-600 hover:underline font-semibold"
                >
                  Reset All
                </button>
                {isMobileFiltersOpen && (
                  <button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700 lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* 1. Category Filter */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                Categories
              </label>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedCategoryId(null);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-orange-600 text-white font-bold'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] opacity-80">({products.length})</span>
                </button>
                {categories.map((c) => {
                  const count = products.filter((p) => p.categoryId === c.id).length;
                  const isSelected = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.id);
                        setSelectedCategoryId(c.id);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-600 text-white font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] opacity-80 shrink-0">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Max Price
                </label>
                <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  ₹{priceRange}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="800"
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>₹20</span>
                <span>₹400</span>
                <span>₹800+</span>
              </div>
            </div>

            {/* 3. Toggles & Checkboxes */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                Preferences
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDiscounted}
                  onChange={(e) => setOnlyDiscounted(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 accent-orange-600 w-4 h-4"
                />
                <span className="font-medium">Special Offers & Discounts Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 accent-orange-600 w-4 h-4"
                />
                <span className="font-medium">In-Stock Items Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVeg}
                  onChange={(e) => setOnlyVeg(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 accent-orange-600 w-4 h-4"
                />
                <span className="font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  100% Pure Vegetarian
                </span>
              </label>
            </div>

            {isMobileFiltersOpen && (
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl lg:hidden"
              >
                Apply & View Products
              </button>
            )}
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="lg:col-span-3">
          {/* Active Filter Chips */}
          {(selectedCategory !== 'all' ||
            searchQuery.trim() ||
            onlyDiscounted ||
            onlyInStock ||
            priceRange < 1000) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-stone-400 font-semibold">Active:</span>

              {selectedCategory !== 'all' && (
                <span className="bg-orange-50 border border-orange-200 text-orange-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedCategoryId(null);
                    }}
                  >
                    <X className="w-3 h-3 text-orange-600" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="bg-orange-50 border border-orange-200 text-orange-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3 text-orange-600" />
                  </button>
                </span>
              )}

              {onlyDiscounted && (
                <span className="bg-amber-50 border border-amber-200 text-amber-900 text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                  Discounted Only
                  <button onClick={() => setOnlyDiscounted(false)}>
                    <X className="w-3 h-3 text-amber-700" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs text-stone-500 hover:text-stone-900 underline font-semibold ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* If No Products Found */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🍫
              </div>
              <h3 className="font-bold text-lg text-stone-800 font-heading">
                No Munchies Found!
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
                We couldn't find snacks matching your exact filters. Try adjusting price or clearing your search term.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
