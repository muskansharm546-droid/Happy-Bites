import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, addToCart, toggleWishlist, navigateTo, showToast } = useApp();

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    showToast(`Added ${wishlist.length} items to your cart!`, 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-3xl shadow-inner">
          ❤️
        </div>
        <h2 className="text-2xl font-black text-[#2C1810] font-heading">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Save your favourite chocolates, pastries, and savory munchies here so you never lose track of them!
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
        >
          Explore Delicious Snacks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] font-heading flex items-center gap-2">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            <span>My Wishlist ({wishlist.length} Items)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Your personal collection of craved snacks & sweets
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Move All to Cart</span>
        </button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
