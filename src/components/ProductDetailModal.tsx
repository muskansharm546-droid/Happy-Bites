import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    cart,
    addToCart,
    updateQuantity,
    toggleWishlist,
    isInWishlist,
    quickBuyNow,
    addReviewToProduct,
    user,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState(user?.name || '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);

  // Suggest complementary product for "Frequently Bought Together"
  const complementaryProduct =
    products.find(
      (p) => p.id !== product.id && p.categoryId !== product.categoryId && p.inStock
    ) || products[0];

  const handleAddCombo = () => {
    addToCart(product, 1);
    if (complementaryProduct) {
      addToCart(complementaryProduct, 1);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReviewToProduct(product.id, {
      userName: reviewName.trim() || 'Happy Foodie',
      rating: reviewRating,
      comment: reviewComment.trim(),
      verified: true,
    });

    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-stone-100 text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          {/* Top section: Product Media & Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Image & Badges */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full ${
                  product.image.startsWith('/assets') ? 'object-contain p-4' : 'object-cover'
                }`}
              />
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs p-1.5 rounded-md shadow-xs">
                <div className="w-4 h-4 border border-emerald-600 flex items-center justify-center p-0.5 rounded-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                </div>
              </div>

              {product.discountPercent > 0 && (
                <span className="absolute top-4 right-4 bg-orange-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
                  {product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Info and Actions */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {product.brand}
                  </span>
                  <span className="text-xs text-stone-500 font-medium bg-stone-100 px-2.5 py-0.5 rounded-full">
                    {product.categoryName}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">
                    Net Wt: {product.weight}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] font-heading mb-2 leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-amber-500 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                    <span>{product.rating}</span>
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    ({product.reviewCount} customer ratings & reviews)
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Genuine
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 p-3 bg-amber-50/60 rounded-2xl border border-amber-100 mb-4">
                  <span className="text-3xl font-extrabold text-[#2C1810]">
                    ₹{product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-stone-400 line-through">
                      M.R.P: ₹{product.originalPrice}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      You Save ₹{product.originalPrice - product.price} ({product.discountPercent}%)
                    </span>
                  )}
                  <span className="text-[11px] text-stone-500 ml-auto font-medium">
                    (Inclusive of all taxes)
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-stone-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Value perks */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-[11px] text-stone-600 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>30 Min Express Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hygienic Packaging</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Instant Replacement</span>
                  </div>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-stone-200 rounded-2xl bg-stone-50 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl bg-white text-stone-700 hover:bg-orange-600 hover:text-white flex items-center justify-center font-bold transition shadow-xs"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-white text-stone-700 hover:bg-orange-600 hover:text-white flex items-center justify-center font-bold transition shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-xs active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-orange-600" />
                    <span>Add {quantity} to Cart (₹{product.price * quantity})</span>
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-3 border border-stone-200 hover:border-rose-300 hover:bg-rose-50 rounded-2xl transition"
                    title={isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Instant Buy Now Button */}
                <button
                  onClick={() => {
                    quickBuyNow(product);
                    setSelectedProductId(null);
                  }}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-sm transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-amber-200 text-amber-200" />
                  <span>Instant Buy Now & Checkout &rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Nutritional Facts & Ingredients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50/80 p-5 rounded-2xl border border-stone-200/80">
            <div>
              <h3 className="font-bold text-sm text-stone-800 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Nutritional Values (Approx. Per Serving)
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/60 text-center">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Energy</span>
                  <span className="font-extrabold text-stone-800">{product.nutrition.calories}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/60 text-center">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Carbs</span>
                  <span className="font-extrabold text-stone-800">{product.nutrition.carbs}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/60 text-center">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Sugar</span>
                  <span className="font-extrabold text-stone-800">{product.nutrition.sugar}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/60 text-center">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Protein</span>
                  <span className="font-extrabold text-stone-800">{product.nutrition.protein}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/60 text-center">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Fat</span>
                  <span className="font-extrabold text-stone-800">{product.nutrition.fat}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-stone-200/60 text-center">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Type</span>
                  <span className="font-extrabold text-emerald-600">100% Veg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-stone-800 mb-2">Ingredients</h3>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="bg-white px-2.5 py-1 rounded-lg text-xs text-stone-600 border border-stone-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Frequently Bought Together Combo */}
          {complementaryProduct && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block mb-2">
                ✨ Frequently Bought Together
              </span>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-xl border border-white shadow-xs"
                  />
                  <span className="text-xl font-bold text-stone-400">+</span>
                  <img
                    src={complementaryProduct.image}
                    alt={complementaryProduct.name}
                    className="w-14 h-14 object-cover rounded-xl border border-white shadow-xs"
                  />
                  <div>
                    <p className="text-xs font-bold text-stone-800">
                      {product.name.split(' ')[0]} + {complementaryProduct.name.split(' ')[0]} Snack Combo
                    </p>
                    <p className="text-xs text-stone-500">
                      Combo Price:{' '}
                      <span className="font-extrabold text-orange-600">
                        ₹{product.price + complementaryProduct.price}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddCombo}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Both to Cart</span>
                </button>
              </div>
            </div>
          )}

          {/* Section: Customer Reviews & Add Review */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-800">
                  Customer Reviews ({product.reviews.length})
                </h3>
                <p className="text-xs text-stone-500">Real feedback from Happy Bites snackers</p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 border border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200 space-y-3">
                <p className="font-bold text-xs text-stone-800">Share your tasting experience</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Muskan Sharma"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl outline-hidden focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Star Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-stone-700 ml-2">{reviewRating} / 5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Feedback</label>
                  <textarea
                    rows={2}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe taste, crunch, freshness, packaging..."
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl outline-hidden focus:border-orange-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-xl font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {product.reviews.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-2">No reviews yet. Be the first to review this treat!</p>
              ) : (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-800">{rev.userName}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-sm">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-stone-400 text-[10px]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-stone-600">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
