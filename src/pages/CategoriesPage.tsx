import React from 'react';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoriesPage: React.FC = () => {
  const { categories, products, setSelectedCategoryId, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-100/70 px-3 py-1 rounded-full">
          <Layers className="w-3.5 h-3.5" />
          <span>Our Delicious Range</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2C1810] font-heading">
          Explore All 12 Snack Categories
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          From luscious silk chocolates to fiery noodles and authentic desi namkeen, dive into happiness in every bite.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                navigateTo('shop');
              }}
              className="group cursor-pointer bg-white rounded-3xl border border-stone-200 hover:border-orange-400 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[#2C1810] text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                  0{idx + 1}
                </div>

                {cat.badge && (
                  <span className="absolute top-3 right-3 bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {cat.badge}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-[#2C1810] font-heading group-hover:text-orange-600 transition mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                    {count} Products
                  </span>
                  <span className="text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
