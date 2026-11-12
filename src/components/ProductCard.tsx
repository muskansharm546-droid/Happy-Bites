import React from 'react';
import { Heart, Star, Plus, Minus, ShoppingBag, Zap, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart,
    addToCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    quickBuyNow,
    setSelectedProductId,
    addToRecentlyViewed,
  } = useApp();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const isWishlisted = isInWishlist(product.id);

  const handleCardClick = () => {
    addToRecentlyViewed(product);
    setSelectedProductId(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-orange-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top badges and Wishlist button */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-50 cursor-pointer" onClick={handleCardClick}>
        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full ${
            product.image.startsWith('/assets') ? 'object-contain p-2' : 'object-cover'
          } group-hover:scale-105 transition-transform duration-500`}
          loading="lazy"
        />

        {/* Veg icon */}
        <div className="absolute top-2.5 left-2.5 z-10 bg-white/90 backdrop-blur-xs p-1 rounded-md shadow-xs" title="100% Vegetarian">
          <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5 rounded-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          </div>
        </div>

        {/* Discount badge or special badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1 items-end">
          {product.discountPercent > 0 && (
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-full shadow-xs tracking-wide">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
              ★ BESTSELLER
            </span>
          )}
        </div>

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-rose-600 flex items-center justify-center shadow-md transition transform active:scale-90"
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Weight category */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold text-orange-700 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md text-[11px] font-medium">
              {product.weight}
            </span>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleCardClick}
            className="font-bold text-stone-800 text-sm sm:text-base leading-snug line-clamp-2 hover:text-orange-600 cursor-pointer transition mb-1.5"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-500 line-clamp-1 mb-2">
            {product.description}
          </p>

          {/* Rating & Availability */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold text-amber-900">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>

            {product.inStock ? (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-rose-500">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-[#2C1810]">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-600">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Add to Cart / Quantity controls */}
          <div className="grid grid-cols-2 gap-2">
            {product.inStock ? (
              inCart ? (
                <div className="col-span-1 flex items-center justify-between bg-orange-50 border border-orange-300 rounded-xl px-2 py-1.5">
                  <button
                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                    className="w-6 h-6 rounded-lg bg-white text-orange-700 hover:bg-orange-600 hover:text-white flex items-center justify-center font-bold transition shadow-2xs"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-bold text-sm text-orange-950">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                    className="w-6 h-6 rounded-lg bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center font-bold transition shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product, 1)}
                  className="col-span-1 flex items-center justify-center gap-1.5 py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl text-xs font-bold transition hover:shadow-xs active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-orange-600" />
                  <span>Add</span>
                </button>
              )
            ) : (
              <button
                disabled
                className="col-span-1 py-2 px-2 bg-stone-100 text-stone-400 rounded-xl text-xs font-semibold cursor-not-allowed text-center"
              >
                Unavailable
              </button>
            )}

            {/* Buy Now Button */}
            <button
              onClick={() => quickBuyNow(product)}
              disabled={!product.inStock}
              className="col-span-1 py-2 px-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs hover:shadow-md flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-200 text-amber-200" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
